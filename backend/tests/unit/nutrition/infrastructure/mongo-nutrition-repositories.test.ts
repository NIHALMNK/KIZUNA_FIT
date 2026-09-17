import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionCompletion } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-completion.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import {
  MealType,
  NutritionCompletionStatus,
  NutritionPlanStatus,
} from '../../../../src/modules/nutrition/domain/enums';
import { NutritionPlanModel } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-plan.schema';
import { NutritionCompletionModel } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/schemas/nutrition-completion.schema';
import { MongoNutritionPlanRepository } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/repositories/MongoNutritionPlanRepository';
import { MongoNutritionCompletionRepository } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/repositories/MongoNutritionCompletionRepository';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import {
  ActiveNutritionPlanAlreadyExistsException,
  DuplicateNutritionCompletionException,
  NutritionConcurrencyConflictException,
  NutritionPlanVersionAlreadyExistsException,
  PendingNutritionPlanAlreadyExistsException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';

describe('MongoNutritionRepositories Persistence Tests', () => {
  let mongoServer: MongoMemoryReplSet;
  let mockDispatcher: DomainEventDispatcher;
  let planRepo: MongoNutritionPlanRepository;
  let completionRepo: MongoNutritionCompletionRepository;

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

    mockDispatcher = {
      dispatchAll: vi.fn().mockResolvedValue(undefined),
    } as unknown as DomainEventDispatcher;

    planRepo = new MongoNutritionPlanRepository(mockDispatcher);
    completionRepo = new MongoNutritionCompletionRepository(mockDispatcher);
  });

  const createTestMeal = (name = 'Breakfast Bowl'): Meal => {
    const food = FoodEntry.create({
      name: 'Oats',
      quantity: 80,
      unit: 'g',
      calories: 300,
      protein: 10,
      carbohydrates: 54,
      fats: 5,
    }).getValue();

    return Meal.create({
      mealType: MealType.BREAKFAST,
      name,
      foodEntries: [food],
    }).getValue();
  };

  const createTestDay = (dayNumber = 1): NutritionDay => {
    return NutritionDay.create({
      dayNumber,
      name: `Day ${dayNumber}`,
      meals: [createTestMeal()],
    }).getValue();
  };

  const createTestPlan = (
    version = 1,
    status: NutritionPlanStatus = NutritionPlanStatus.DRAFT,
    relId = 'rel_123',
  ): NutritionPlan => {
    return NutritionPlan.create({
      coachingRelationshipId: relId,
      trainerId: 'trainer_123',
      clientId: 'client_123',
      version,
      title: `Nutrition Plan v${version}`,
      durationWeeks: 4,
      nutritionDays: [createTestDay(1)],
      status,
    }).getValue();
  };

  describe('MongoNutritionPlanRepository', () => {
    it('should save and retrieve NutritionPlan by id and relationshipId', async () => {
      const plan = createTestPlan(1, NutritionPlanStatus.DRAFT);
      await planRepo.save(plan);

      const retrieved = await planRepo.findById(plan.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(plan.id);
      expect(retrieved!.title).toBe('Nutrition Plan v1');
      expect(retrieved!.version).toBe(1);
      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
    });

    it('should find active plan by coachingRelationshipId', async () => {
      const draftPlan = createTestPlan(1, NutritionPlanStatus.DRAFT);
      const activePlan = createTestPlan(2, NutritionPlanStatus.ACTIVE);

      await planRepo.save(draftPlan);
      await planRepo.save(activePlan);

      const foundActive = await planRepo.findActiveByRelationshipId('rel_123');
      expect(foundActive).not.toBeNull();
      expect(foundActive!.id).toBe(activePlan.id);
      expect(foundActive!.status).toBe(NutritionPlanStatus.ACTIVE);
    });

    it('should find highest version number for relationship', async () => {
      const plan1 = createTestPlan(1, NutritionPlanStatus.COMPLETED);
      const plan2 = createTestPlan(2, NutritionPlanStatus.ACTIVE);

      await planRepo.save(plan1);
      await planRepo.save(plan2);

      const highest = await planRepo.findHighestVersionNumber('rel_123');
      expect(highest).toBe(2);
    });

    it('should enforce partial unique index: at most one ACTIVE plan per relationship', async () => {
      const activePlan1 = createTestPlan(1, NutritionPlanStatus.ACTIVE, 'rel_single_active');
      const activePlan2 = createTestPlan(2, NutritionPlanStatus.ACTIVE, 'rel_single_active');

      await planRepo.save(activePlan1);

      await expect(planRepo.save(activePlan2)).rejects.toThrow(
        ActiveNutritionPlanAlreadyExistsException,
      );
    });

    it('should enforce version uniqueness per coaching relationship', async () => {
      const plan1 = createTestPlan(1, NutritionPlanStatus.DRAFT, 'rel_version_test');
      const plan2 = createTestPlan(1, NutritionPlanStatus.DRAFT, 'rel_version_test');

      await planRepo.save(plan1);

      await expect(planRepo.save(plan2)).rejects.toThrow(
        NutritionPlanVersionAlreadyExistsException,
      );
    });

    it('should delete draft plan', async () => {
      const draftPlan = createTestPlan(1, NutritionPlanStatus.DRAFT);
      await planRepo.save(draftPlan);

      await planRepo.delete(draftPlan.id);
      const retrieved = await planRepo.findById(draftPlan.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('MongoNutritionCompletionRepository', () => {
    it('should save and find NutritionCompletion by plan and dayNumber', async () => {
      const snapshot = NutritionDaySnapshot.fromNutritionDay(createTestDay(1));
      const completion = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: 'plan_123',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [],
      }).getValue();

      await completionRepo.save(completion);

      const retrieved = await completionRepo.findByPlanAndDay('plan_123', 1);
      expect(retrieved).not.toBeNull();
      expect(retrieved!.id).toBe(completion.id);
      expect(retrieved!.dayNumber).toBe(1);
      expect(retrieved!.nutritionDaySnapshot.meals.length).toBe(1);
      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
    });

    it('should enforce unique compound index: at most one completion per plan and dayNumber', async () => {
      const snapshot = NutritionDaySnapshot.fromNutritionDay(createTestDay(1));
      const completion1 = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: 'plan_unique_check',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [],
      }).getValue();

      const completion2 = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: 'plan_unique_check',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [],
      }).getValue();

      await completionRepo.save(completion1);

      await expect(completionRepo.save(completion2)).rejects.toThrow(
        DuplicateNutritionCompletionException,
      );
    });

    it('should find completions by relationshipId and clientId', async () => {
      const snapshot = NutritionDaySnapshot.fromNutritionDay(createTestDay(1));
      const completion = NutritionCompletion.create({
        coachingRelationshipId: 'rel_query_test',
        nutritionPlanId: 'plan_123',
        clientId: 'client_query_test',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [],
      }).getValue();

      await completionRepo.save(completion);

      const byRel = await completionRepo.findByRelationshipId('rel_query_test');
      expect(byRel.length).toBe(1);

      const byClient = await completionRepo.findByClientId('client_query_test');
      expect(byClient.length).toBe(1);
    });
  });
});
