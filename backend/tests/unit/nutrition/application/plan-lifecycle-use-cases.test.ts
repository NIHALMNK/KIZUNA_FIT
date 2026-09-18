import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SubmitNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/submit-nutrition-plan.use-case';
import { RecallNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/recall-nutrition-plan.use-case';
import { AcceptNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/accept-nutrition-plan.use-case';
import { RejectNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/reject-nutrition-plan.use-case';
import { RequestNutritionPlanDeletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/request-nutrition-plan-deletion.use-case';
import { AcceptNutritionPlanDeletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/accept-nutrition-plan-deletion.use-case';
import { RejectNutritionPlanDeletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/reject-nutrition-plan-deletion.use-case';
import { CreateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan.use-case';
import { CreateNutritionPlanVersionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan-version.use-case';
import { ActivateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/activate-nutrition-plan.use-case';
import { DeleteDraftNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/delete-draft-nutrition-plan.use-case';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import {
  MealType,
  NutritionPlanStatus,
  Weekday,
} from '../../../../src/modules/nutrition/domain/enums';
import {
  InitialNutritionPlanAlreadyExistsException,
  InvalidNutritionPlanTransitionException,
  NutritionConcurrencyConflictException,
  NutritionPlanNotFoundException,
  NutritionPlanVersionAlreadyExistsException,
  PendingNutritionPlanAlreadyExistsException,
  UnauthorizedNutritionActionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';

function buildMockPlan(props?: Partial<any>): NutritionPlan {
  const food = FoodEntry.create({
    name: 'Oats',
    quantity: 50,
    unit: 'g',
    calories: 180,
    protein: 6,
    carbohydrates: 30,
    fats: 3,
  }).getValue();

  const meal = Meal.create({
    mealType: MealType.BREAKFAST,
    name: 'Breakfast',
    foodEntries: [food],
  }).getValue();

  const day = NutritionDay.create({
    weekday: Weekday.MONDAY,
    dayNumber: 1,
    meals: [meal],
  }).getValue();

  const planRes = NutritionPlan.create({
    coachingRelationshipId: props?.coachingRelationshipId || 'rel_test_1',
    trainerId: props?.trainerId || 'trainer_1',
    clientId: props?.clientId || 'client_1',
    version: props?.version || 1,
    title: props?.title || 'Test Plan',
    durationWeeks: props?.durationWeeks || 4,
    nutritionDays: [day],
    status: props?.status || NutritionPlanStatus.DRAFT,
  });

  return planRes.getValue();
}

describe('Nutrition Plan Lifecycle Use Cases Tests', () => {
  let mockPlanRepo: any;
  let mockGateway: any;
  let mockUnitOfWork: any;

  beforeEach(() => {
    mockPlanRepo = {
      findById: vi.fn(),
      findByRelationshipId: vi.fn(),
      findActiveByRelationshipId: vi.fn(),
      findPendingByRelationshipId: vi.fn(),
      findHighestVersionNumber: vi.fn().mockResolvedValue(1),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    mockGateway = {
      getRelationshipAccess: vi.fn().mockResolvedValue({
        relationshipId: 'rel_test_1',
        trainerId: 'trainer_1',
        clientId: 'client_1',
        status: 'ACTIVE',
      }),
    };

    mockUnitOfWork = {
      withTransaction: vi.fn(async (cb) => cb({ planRepo: mockPlanRepo })),
    };
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1 & 2: Initial plan creation
  // ─────────────────────────────────────────────────────────────────────────────
  describe('CreateNutritionPlanUseCase', () => {
    const validCreateDto = {
      coachingRelationshipId: 'rel_test_1',
      title: 'Initial Plan',
      durationWeeks: 4,
      nutritionDays: [
        {
          weekday: Weekday.MONDAY,
          dayNumber: 1,
          meals: [
            {
              mealType: MealType.BREAKFAST,
              name: 'B',
              foodEntries: [{ name: 'Food', quantity: 100, unit: 'g' }],
            },
          ],
        },
      ],
    };

    it('TEST 1: should succeed for a relationship with zero nutrition history', async () => {
      mockPlanRepo.findByRelationshipId.mockResolvedValue([]);

      const useCase = new CreateNutritionPlanUseCase(mockPlanRepo, mockGateway);
      const result = await useCase.execute(validCreateDto, 'trainer_1');

      expect(result.version).toBe(1);
      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
      expect(mockPlanRepo.save).toHaveBeenCalledOnce();
    });

    it('TEST 2: should reject initial plan creation if relationship already has history', async () => {
      const existingPlan = buildMockPlan();
      mockPlanRepo.findByRelationshipId.mockResolvedValue([existingPlan]);

      const useCase = new CreateNutritionPlanUseCase(mockPlanRepo, mockGateway);
      await expect(useCase.execute(validCreateDto, 'trainer_1')).rejects.toThrow(
        InitialNutritionPlanAlreadyExistsException,
      );
      expect(mockPlanRepo.save).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3 & 4: Direct trainer activation prohibited for all versions (V1 and V2+)
  // ─────────────────────────────────────────────────────────────────────────────
  describe('ActivateNutritionPlanUseCase — Direct activation prohibited rule', () => {
    it('TEST 3: should reject direct activation of V1 DRAFT by trainer (must use submit → approve flow)', async () => {
      const v1Draft = buildMockPlan({ version: 1, status: NutritionPlanStatus.DRAFT });
      mockPlanRepo.findById.mockResolvedValue(v1Draft);

      const useCase = new ActivateNutritionPlanUseCase(mockPlanRepo, mockUnitOfWork);
      await expect(useCase.execute(v1Draft.id, 'trainer_1')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
      expect(mockPlanRepo.save).not.toHaveBeenCalled();
    });

    it('TEST 4: should reject direct activation of V2+ DRAFT by trainer', async () => {
      const v2Draft = buildMockPlan({ version: 2, status: NutritionPlanStatus.DRAFT });
      mockPlanRepo.findById.mockResolvedValue(v2Draft);

      const useCase = new ActivateNutritionPlanUseCase(mockPlanRepo, mockUnitOfWork);
      await expect(useCase.execute(v2Draft.id, 'trainer_1')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
      expect(mockPlanRepo.save).not.toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 5, 6, 7: Version creation and concurrency
  // ─────────────────────────────────────────────────────────────────────────────
  describe('CreateNutritionPlanVersionUseCase', () => {
    it('TEST 5: should create a new version with the next sequential version number', async () => {
      const activePlan = buildMockPlan({ version: 1, status: NutritionPlanStatus.ACTIVE });
      mockPlanRepo.findById.mockResolvedValue(activePlan);
      mockPlanRepo.findHighestVersionNumber.mockResolvedValue(1);

      const useCase = new CreateNutritionPlanVersionUseCase(mockPlanRepo);
      const result = await useCase.execute({ planId: activePlan.id }, 'trainer_1');

      expect(result.version).toBe(2);
      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
      expect(mockPlanRepo.save).toHaveBeenCalledOnce();
    });

    it('TEST 6: should retry on version collision and succeed on later attempt', async () => {
      const existingPlan = buildMockPlan({ version: 1, status: NutritionPlanStatus.ACTIVE });
      mockPlanRepo.findById.mockResolvedValue(existingPlan);

      let saveCall = 0;
      mockPlanRepo.save.mockImplementation(async (plan: NutritionPlan) => {
        saveCall++;
        if (saveCall === 1) {
          // First attempt hits collision
          const err = new NutritionPlanVersionAlreadyExistsException('rel_test_1', plan.version);
          throw err;
        }
        // Second attempt succeeds
      });

      mockPlanRepo.findHighestVersionNumber
        .mockResolvedValueOnce(1) // first attempt: V1 highest → try V2
        .mockResolvedValueOnce(2); // second attempt: V2 highest → try V3

      const useCase = new CreateNutritionPlanVersionUseCase(mockPlanRepo);
      const result = await useCase.execute({ planId: existingPlan.id }, 'trainer_1');

      expect(result.version).toBe(3);
      expect(mockPlanRepo.save).toHaveBeenCalledTimes(2);
    });

    it('TEST 7: should throw NutritionConcurrencyConflictException after MAX_RETRIES exhausted', async () => {
      const existingPlan = buildMockPlan({ version: 1, status: NutritionPlanStatus.ACTIVE });
      mockPlanRepo.findById.mockResolvedValue(existingPlan);

      // All save attempts produce version collision
      mockPlanRepo.save.mockImplementation(async (plan: NutritionPlan) => {
        throw new NutritionPlanVersionAlreadyExistsException('rel_test_1', plan.version);
      });

      mockPlanRepo.findHighestVersionNumber.mockResolvedValue(1);

      const useCase = new CreateNutritionPlanVersionUseCase(mockPlanRepo);
      await expect(useCase.execute({ planId: existingPlan.id }, 'trainer_1')).rejects.toThrow(
        NutritionConcurrencyConflictException,
      );

      expect(mockPlanRepo.save).toHaveBeenCalledTimes(3); // MAX_RETRIES = 3
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 8, 9, 10: Rejection lifecycle
  // ─────────────────────────────────────────────────────────────────────────────
  describe('RejectNutritionPlanUseCase — rejection lifecycle', () => {
    it('TEST 8: should return rejected V2 to DRAFT status and store rejection reason', async () => {
      const pendingV2 = buildMockPlan({ version: 2, status: NutritionPlanStatus.DRAFT });
      pendingV2.submit();
      mockPlanRepo.findById.mockResolvedValue(pendingV2);

      const useCase = new RejectNutritionPlanUseCase(mockPlanRepo);
      const result = await useCase.execute(
        { planId: pendingV2.id, reason: 'Need more carbs around workouts' },
        'client_1',
      );

      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
      expect(result.rejectionReason).toBe('Need more carbs around workouts');
    });

    it('TEST 9: should NOT create V3 when V2 is rejected — the same V2 stays in DRAFT', async () => {
      const pendingV2 = buildMockPlan({ version: 2, status: NutritionPlanStatus.DRAFT });
      pendingV2.submit();
      mockPlanRepo.findById.mockResolvedValue(pendingV2);

      const useCase = new RejectNutritionPlanUseCase(mockPlanRepo);
      await useCase.execute({ planId: pendingV2.id, reason: 'Too many calories' }, 'client_1');

      // Only one plan should be saved (the rejected V2 back to DRAFT) — no new plan created
      expect(mockPlanRepo.save).toHaveBeenCalledOnce();
      expect(mockPlanRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: NutritionPlanStatus.DRAFT }),
      );
    });

    it('TEST 10: V1 must remain ACTIVE after V2 rejection', async () => {
      // Simulate the domain: V1 active, V2 pending, client rejects V2
      const v1Active = buildMockPlan({ version: 1, status: NutritionPlanStatus.ACTIVE });
      const v2Pending = buildMockPlan({ version: 2, status: NutritionPlanStatus.DRAFT });
      v2Pending.submit();

      mockPlanRepo.findById.mockResolvedValue(v2Pending);
      // V1 should NOT be touched during rejection
      mockPlanRepo.findActiveByRelationshipId.mockResolvedValue(v1Active);

      const useCase = new RejectNutritionPlanUseCase(mockPlanRepo);
      await useCase.execute({ planId: v2Pending.id, reason: 'Not enough variety' }, 'client_1');

      // V1 status must be unchanged
      expect(v1Active.status).toBe(NutritionPlanStatus.ACTIVE);
      // Only V2 was saved
      expect(mockPlanRepo.save).toHaveBeenCalledOnce();
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 11: Accept V2 → completes V1 and activates V2
  // ─────────────────────────────────────────────────────────────────────────────
  describe('AcceptNutritionPlanUseCase', () => {
    it('TEST 11: should complete V1 and activate V2 upon client acceptance', async () => {
      const v1Active = buildMockPlan({ version: 1, status: NutritionPlanStatus.ACTIVE });
      const v2Pending = buildMockPlan({ version: 2, status: NutritionPlanStatus.DRAFT });
      v2Pending.submit();

      mockPlanRepo.findById.mockResolvedValue(v2Pending);
      mockPlanRepo.findActiveByRelationshipId.mockResolvedValue(v1Active);

      const useCase = new AcceptNutritionPlanUseCase(mockPlanRepo, mockUnitOfWork);
      const result = await useCase.execute(v2Pending.id, 'client_1');

      expect(result.status).toBe(NutritionPlanStatus.ACTIVE);
      expect(result.version).toBe(2);
      expect(v1Active.status).toBe(NutritionPlanStatus.COMPLETED);
      expect(mockPlanRepo.save).toHaveBeenCalledWith(v1Active);
      expect(mockPlanRepo.save).toHaveBeenCalledWith(v2Pending);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 12 & 13: Retirement flow
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Retirement Flow: Request, Accept, Reject Deletion', () => {
    it('should allow trainer to request retirement transitioning ACTIVE to DELETION_PENDING', async () => {
      const activePlan = buildMockPlan({ status: NutritionPlanStatus.ACTIVE });
      mockPlanRepo.findById.mockResolvedValue(activePlan);

      const useCase = new RequestNutritionPlanDeletionUseCase(mockPlanRepo);
      const res = await useCase.execute(activePlan.id, 'trainer_1');

      expect(res.status).toBe(NutritionPlanStatus.DELETION_PENDING);
    });

    it('TEST 12: retirement acceptance transitions DELETION_PENDING to CANCELLED', async () => {
      const plan = buildMockPlan({ status: NutritionPlanStatus.ACTIVE });
      plan.requestDeletion();
      mockPlanRepo.findById.mockResolvedValue(plan);

      const useCase = new AcceptNutritionPlanDeletionUseCase(mockPlanRepo);
      const res = await useCase.execute(plan.id, 'client_1');

      expect(res.status).toBe(NutritionPlanStatus.CANCELLED);
    });

    it('TEST 13: retirement rejection restores DELETION_PENDING to ACTIVE', async () => {
      const plan = buildMockPlan({ status: NutritionPlanStatus.ACTIVE });
      plan.requestDeletion();
      mockPlanRepo.findById.mockResolvedValue(plan);

      const useCase = new RejectNutritionPlanDeletionUseCase(mockPlanRepo);
      const res = await useCase.execute(plan.id, 'client_1');

      expect(res.status).toBe(NutritionPlanStatus.ACTIVE);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 14: Active plan immutability
  // ─────────────────────────────────────────────────────────────────────────────
  describe('Active plan immutability', () => {
    it('TEST 14: should throw when attempting to directly mutate an ACTIVE plan via updateDraft', () => {
      const activePlan = buildMockPlan({ status: NutritionPlanStatus.ACTIVE });

      // updateDraft is the domain-level guard — the use case delegates to it
      expect(() => activePlan.updateDraft({ title: 'Sneaky edit' })).toThrow(
        /* ActiveNutritionPlanImmutableException */
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 15: Draft deletion — only never-activated drafts
  // ─────────────────────────────────────────────────────────────────────────────
  describe('DeleteDraftNutritionPlanUseCase', () => {
    it('TEST 15: should allow physical deletion of a DRAFT plan that was never activated', async () => {
      const draft = buildMockPlan({ version: 1, status: NutritionPlanStatus.DRAFT });
      mockPlanRepo.findById.mockResolvedValue(draft);

      const useCase = new DeleteDraftNutritionPlanUseCase(mockPlanRepo);
      await useCase.execute(draft.id, 'trainer_1');

      expect(mockPlanRepo.delete).toHaveBeenCalledWith(draft.id);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Existing tests (preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  describe('SubmitNutritionPlanUseCase & RecallNutritionPlanUseCase', () => {
    it('should transition DRAFT to PENDING_APPROVAL and notify via domain event', async () => {
      const draftPlan = buildMockPlan({ status: NutritionPlanStatus.DRAFT });
      mockPlanRepo.findById.mockResolvedValue(draftPlan);
      mockPlanRepo.findPendingByRelationshipId.mockResolvedValue(null);

      const useCase = new SubmitNutritionPlanUseCase(mockPlanRepo);
      const res = await useCase.execute(draftPlan.id, 'trainer_1');

      expect(res.status).toBe(NutritionPlanStatus.PENDING_APPROVAL);
      expect(mockPlanRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: NutritionPlanStatus.PENDING_APPROVAL }),
      );
    });

    it('should reject submit if a plan is already pending approval', async () => {
      const draftPlan = buildMockPlan({ status: NutritionPlanStatus.DRAFT });
      const pendingPlan = buildMockPlan({ status: NutritionPlanStatus.PENDING_APPROVAL });
      mockPlanRepo.findById.mockResolvedValue(draftPlan);
      mockPlanRepo.findPendingByRelationshipId.mockResolvedValue(pendingPlan);

      const useCase = new SubmitNutritionPlanUseCase(mockPlanRepo);
      await expect(useCase.execute(draftPlan.id, 'trainer_1')).rejects.toThrow(
        PendingNutritionPlanAlreadyExistsException,
      );
    });

    it('should allow trainer to recall a pending submission back to DRAFT', async () => {
      const plan = buildMockPlan({ status: NutritionPlanStatus.DRAFT });
      plan.submit();
      mockPlanRepo.findById.mockResolvedValue(plan);

      const useCase = new RecallNutritionPlanUseCase(mockPlanRepo);
      const res = await useCase.execute(plan.id, 'trainer_1');

      expect(res.status).toBe(NutritionPlanStatus.DRAFT);
    });
  });
});
