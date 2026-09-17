import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import mongoose, { ClientSession } from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { MealType, NutritionPlanStatus } from '../../../../src/modules/nutrition/domain/enums';
import { NutritionPlanModel } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-plan.schema';
import { NutritionCompletionModel } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-completion.schema';
import { MongoNutritionPlanRepository } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/repositories/MongoNutritionPlanRepository';
import { MongoNutritionCompletionRepository } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/repositories/MongoNutritionCompletionRepository';
import {
  MongooseNutritionUnitOfWork,
  NutritionRepositoryFactory,
} from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/MongooseNutritionUnitOfWork';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { IDomainEvent } from '../../../../src/shared/core/AggregateRoot';

describe('MongooseNutritionUnitOfWork Transaction Tests', () => {
  let mongoServer: MongoMemoryReplSet;
  let unitOfWork: MongooseNutritionUnitOfWork;
  let mockEventDispatcher: DomainEventDispatcher;

  beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    await NutritionPlanModel.createCollection();
    await NutritionPlanModel.syncIndexes();
    await NutritionCompletionModel.createCollection();
    await NutritionCompletionModel.syncIndexes();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await NutritionPlanModel.deleteMany({});
      await NutritionCompletionModel.deleteMany({});
    }

    mockEventDispatcher = {
      dispatch: vi.fn().mockResolvedValue(undefined),
      dispatchAll: vi.fn().mockResolvedValue(undefined),
      register: vi.fn(),
    } as unknown as DomainEventDispatcher;

    const repositoryFactory: NutritionRepositoryFactory = (
      session?: ClientSession,
      eventQueue?: IDomainEvent[],
    ) => ({
      planRepo: new MongoNutritionPlanRepository(mockEventDispatcher, session, eventQueue),
      completionRepo: new MongoNutritionCompletionRepository(
        mockEventDispatcher,
        session,
        eventQueue,
      ),
    });

    unitOfWork = new MongooseNutritionUnitOfWork(repositoryFactory, mockEventDispatcher);
  });

  const createTestPlan = (
    version = 1,
    status: NutritionPlanStatus = NutritionPlanStatus.DRAFT,
    relId = 'rel_uow_test',
  ): NutritionPlan => {
    const meal = Meal.create({
      mealType: MealType.BREAKFAST,
      name: 'Oats & Eggs',
      foodEntries: [],
    }).getValue();

    const day = NutritionDay.create({
      dayNumber: 1,
      name: 'Day 1',
      meals: [meal],
    }).getValue();

    return NutritionPlan.create({
      coachingRelationshipId: relId,
      trainerId: 'trainer_123',
      clientId: 'client_123',
      version,
      title: `Plan v${version}`,
      durationWeeks: 4,
      nutritionDays: [day],
      status,
    }).getValue();
  };

  it('should successfully commit atomic plan activation inside transaction', async () => {
    // 1. Setup existing ACTIVE plan (v1) and DRAFT plan (v2)
    const directPlanRepo = new MongoNutritionPlanRepository();
    const activePlan = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_atomic_activate');
    const pendingPlan = createTestPlan(
      2,
      NutritionPlanStatus.PENDING_APPROVAL,
      'rel_atomic_activate',
    );

    await directPlanRepo.save(activePlan);
    await directPlanRepo.save(pendingPlan);

    // 2. Execute atomic activation within UnitOfWork transaction
    await unitOfWork.withTransaction(async ({ planRepo }) => {
      const currentActive = await planRepo.findActiveByRelationshipId('rel_atomic_activate');
      expect(currentActive).not.toBeNull();
      expect(currentActive!.id).toBe(activePlan.id);

      currentActive!.complete();
      pendingPlan.activate();

      await planRepo.save(currentActive!);
      await planRepo.save(pendingPlan);
    });

    // 3. Verify final state committed in database
    const finalActive = await directPlanRepo.findActiveByRelationshipId('rel_atomic_activate');
    const finalV1 = await directPlanRepo.findById(activePlan.id);

    expect(finalActive).not.toBeNull();
    expect(finalActive!.id).toBe(pendingPlan.id);
    expect(finalActive!.status).toBe(NutritionPlanStatus.ACTIVE);
    expect(finalV1!.status).toBe(NutritionPlanStatus.COMPLETED);
  });

  it('should dispatch collected domain events ONLY after successful commit', async () => {
    const directPlanRepo = new MongoNutritionPlanRepository();
    const activePlan = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_events_commit');
    const pendingPlan = createTestPlan(
      2,
      NutritionPlanStatus.PENDING_APPROVAL,
      'rel_events_commit',
    );

    await directPlanRepo.save(activePlan);
    await directPlanRepo.save(pendingPlan);

    (mockEventDispatcher.dispatchAll as any).mockClear();

    let eventsDispatchedDuringTransaction = false;
    await unitOfWork.withTransaction(async ({ planRepo }) => {
      const currentActive = await planRepo.findActiveByRelationshipId('rel_events_commit');
      currentActive!.complete();
      pendingPlan.activate();

      await planRepo.save(currentActive!);
      await planRepo.save(pendingPlan);

      // Verify that dispatchAll has NOT been called yet while transaction is still open
      eventsDispatchedDuringTransaction =
        (mockEventDispatcher.dispatchAll as any).mock.calls.length > 0;
    });

    expect(eventsDispatchedDuringTransaction).toBe(false);
    expect(mockEventDispatcher.dispatchAll).toHaveBeenCalledTimes(1);

    const dispatchedEvents: IDomainEvent[] = (mockEventDispatcher.dispatchAll as any).mock
      .calls[0][0];
    expect(dispatchedEvents.length).toBe(2);
    expect(dispatchedEvents[0].getAggregateId()).toBe(activePlan.id);
    expect(dispatchedEvents[1].getAggregateId()).toBe(pendingPlan.id);
  });

  it('should rollback all modifications and emit NO domain events if an error occurs', async () => {
    const directPlanRepo = new MongoNutritionPlanRepository();
    const activePlan = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_rollback_test');
    const draftPlan = createTestPlan(2, NutritionPlanStatus.DRAFT, 'rel_rollback_test');

    await directPlanRepo.save(activePlan);
    await directPlanRepo.save(draftPlan);

    (mockEventDispatcher.dispatchAll as any).mockClear();

    // Attempt transactional update that errors midway
    await expect(
      unitOfWork.withTransaction(async ({ planRepo }) => {
        const currentActive = await planRepo.findActiveByRelationshipId('rel_rollback_test');
        currentActive!.complete();
        await planRepo.save(currentActive!);

        throw new Error('Simulated network or business failure during activation');
      }),
    ).rejects.toThrow('Simulated network or business failure during activation');

    // Verify zero events dispatched after rollback
    expect(mockEventDispatcher.dispatchAll).not.toHaveBeenCalled();

    // Verify rollback in DB: previous plan is still ACTIVE, not COMPLETED
    const currentActiveAfterRollback =
      await directPlanRepo.findActiveByRelationshipId('rel_rollback_test');
    expect(currentActiveAfterRollback).not.toBeNull();
    expect(currentActiveAfterRollback!.id).toBe(activePlan.id);
    expect(currentActiveAfterRollback!.status).toBe(NutritionPlanStatus.ACTIVE);
  });

  it('should not duplicate domain events if transaction callback retries internally', async () => {
    const directPlanRepo = new MongoNutritionPlanRepository();
    const activePlan = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_retry_test');
    const pendingPlan = createTestPlan(2, NutritionPlanStatus.PENDING_APPROVAL, 'rel_retry_test');

    await directPlanRepo.save(activePlan);
    await directPlanRepo.save(pendingPlan);

    (mockEventDispatcher.dispatchAll as any).mockClear();

    let attempts = 0;
    await unitOfWork.withTransaction(async ({ planRepo }) => {
      attempts++;
      const currentActive = await planRepo.findActiveByRelationshipId('rel_retry_test');
      const targetDraft = await planRepo.findById(pendingPlan.id);
      currentActive!.complete();
      targetDraft!.activate();

      await planRepo.save(currentActive!);
      await planRepo.save(targetDraft!);

      if (attempts === 1) {
        // Simulate a transient error triggering a retry on attempt 1
        const err = new mongoose.mongo.MongoServerError({ message: 'WriteConflict' });
        err.addErrorLabel('TransientTransactionError');
        throw err;
      }
    });

    expect(attempts).toBeGreaterThanOrEqual(2);
    expect(mockEventDispatcher.dispatchAll).toHaveBeenCalledTimes(1);

    const dispatchedEvents: IDomainEvent[] = (mockEventDispatcher.dispatchAll as any).mock
      .calls[0][0];
    // Exactly 2 events from the final committed attempt, not 4 accumulated across attempts
    expect(dispatchedEvents.length).toBe(2);
  });

  it('should return successfully even if post-commit event dispatch encounters an error', async () => {
    const directPlanRepo = new MongoNutritionPlanRepository();
    const activePlan = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_dispatch_err_test');
    const pendingPlan = createTestPlan(
      2,
      NutritionPlanStatus.PENDING_APPROVAL,
      'rel_dispatch_err_test',
    );

    await directPlanRepo.save(activePlan);
    await directPlanRepo.save(pendingPlan);

    (mockEventDispatcher.dispatchAll as any).mockRejectedValueOnce(
      new Error('Simulated event bus/realtime failure'),
    );

    // Transaction should commit and complete without throwing to caller
    await expect(
      unitOfWork.withTransaction(async ({ planRepo }) => {
        const currentActive = await planRepo.findActiveByRelationshipId('rel_dispatch_err_test');
        currentActive!.complete();
        pendingPlan.activate();

        await planRepo.save(currentActive!);
        await planRepo.save(pendingPlan);
        return { success: true };
      }),
    ).resolves.toEqual({ success: true });

    // Verify DB committed successfully
    const finalActive = await directPlanRepo.findActiveByRelationshipId('rel_dispatch_err_test');
    expect(finalActive!.id).toBe(pendingPlan.id);
  });
});
