import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan.use-case';
import { UpdateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/update-nutrition-plan.use-case';
import { CreateNutritionPlanVersionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan-version.use-case';
import { ActivateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/activate-nutrition-plan.use-case';
import { CompleteNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/complete-nutrition-plan.use-case';
import { DeleteDraftNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/delete-draft-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/get-nutrition-plan.use-case';
import { ListNutritionPlansUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/list-nutrition-plans.use-case';
import { INutritionPlanRepository } from '../../../../src/modules/nutrition/domain/repositories/INutritionPlanRepository';
import { INutritionUnitOfWork } from '../../../../src/modules/nutrition/application/ports/INutritionUnitOfWork';
import { INutritionCoachingGateway } from '../../../../src/modules/nutrition/application/ports/INutritionCoachingGateway';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import {
  MealType,
  NutritionPlanStatus,
  Weekday,
} from '../../../../src/modules/nutrition/domain/enums';
import {
  ActiveNutritionPlanImmutableException,
  CompletedNutritionPlanImmutableException,
  InvalidNutritionPlanTransitionException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError } from '../../../../src/shared/exceptions/AppError';

describe('Nutrition Plan Application Use Cases Tests', () => {
  let mockPlanRepo: INutritionPlanRepository;
  let mockUow: INutritionUnitOfWork;
  let mockCoachingGateway: INutritionCoachingGateway;

  const createMockMeal = (): Meal => {
    return Meal.create({
      mealType: MealType.BREAKFAST,
      name: 'Oatmeal',
      foodEntries: [],
    }).getValue();
  };

  const createMockDay = (dayNumber = 1): NutritionDay => {
    return NutritionDay.create({
      dayNumber,
      name: `Day ${dayNumber}`,
      meals: [createMockMeal()],
    }).getValue();
  };

  const createMockPlan = (
    version = 1,
    status: NutritionPlanStatus = NutritionPlanStatus.DRAFT,
  ): NutritionPlan => {
    return NutritionPlan.create({
      coachingRelationshipId: 'rel_123',
      trainerId: 'trainer_123',
      clientId: 'client_123',
      version,
      title: `Nutrition Plan v${version}`,
      durationWeeks: 4,
      nutritionDays: [createMockDay(1)],
      status,
    }).getValue();
  };

  beforeEach(() => {
    mockPlanRepo = {
      findById: vi.fn(),
      findActiveByRelationshipId: vi.fn(),
      findByRelationshipId: vi.fn(),
      findHighestVersionNumber: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    mockUow = {
      withTransaction: vi.fn().mockImplementation(async (work) => {
        return await work({
          planRepo: mockPlanRepo,
          completionRepo: {} as any,
        });
      }),
    };

    mockCoachingGateway = {
      getRelationshipAccess: vi.fn().mockResolvedValue({
        relationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        isActive: true,
        status: 'ACTIVE',
      }),
      getActiveRelationshipForClient: vi.fn(),
    };
  });

  describe('CreateNutritionPlanUseCase', () => {
    it('should create and save a new DRAFT nutrition plan for an authorized trainer', async () => {
      const useCase = new CreateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);

      const result = await useCase.execute(
        {
          coachingRelationshipId: 'rel_123',
          title: 'New Cutting Plan',
          description: 'Low carb plan',
          durationWeeks: 4,
          nutritionDays: [
            {
              dayNumber: 1,
              name: 'Day 1',
              meals: [
                {
                  mealType: MealType.BREAKFAST,
                  name: 'Oats & Protein',
                },
              ],
            },
          ],
        },
        'trainer_123',
      );

      expect(result).toBeDefined();
      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
      expect(result.version).toBe(1);
      expect(result.title).toBe('New Cutting Plan');
      expect(mockPlanRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject creation if trainer does not own coaching relationship', async () => {
      const useCase = new CreateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);

      await expect(
        useCase.execute(
          {
            coachingRelationshipId: 'rel_123',
            title: 'Unauthorized Plan',
            durationWeeks: 4,
            nutritionDays: [],
          },
          'trainer_impostor',
        ),
      ).rejects.toThrow(UnauthorizedNutritionActionException);
    });

    it('should reject creation if coaching relationship is not found', async () => {
      (mockCoachingGateway.getRelationshipAccess as any).mockResolvedValue(null);
      const useCase = new CreateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);

      await expect(
        useCase.execute(
          {
            coachingRelationshipId: 'rel_unknown',
            title: 'Plan',
            durationWeeks: 4,
            nutritionDays: [],
          },
          'trainer_123',
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('UpdateNutritionPlanUseCase', () => {
    it('should update an existing DRAFT plan for authorized trainer', async () => {
      const draftPlan = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(draftPlan);

      const useCase = new UpdateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);
      const result = await useCase.execute(
        {
          planId: draftPlan.id,
          title: 'Updated Cutting Plan',
          durationWeeks: 6,
        },
        'trainer_123',
      );

      expect(result.id).toBe(draftPlan.id);
      expect(result.title).toBe('Updated Cutting Plan');
      expect(result.durationWeeks).toBe(6);
      expect(mockPlanRepo.save).toHaveBeenCalledWith(draftPlan);
    });

    it('should reject update on an ACTIVE plan', async () => {
      const activePlan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);

      const useCase = new UpdateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);
      await expect(
        useCase.execute(
          {
            planId: activePlan.id,
            title: 'Illegal Update',
          },
          'trainer_123',
        ),
      ).rejects.toThrow(ActiveNutritionPlanImmutableException);
    });

    it('should reject update on a COMPLETED plan', async () => {
      const completedPlan = createMockPlan(1, NutritionPlanStatus.COMPLETED);
      (mockPlanRepo.findById as any).mockResolvedValue(completedPlan);

      const useCase = new UpdateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);
      await expect(
        useCase.execute(
          {
            planId: completedPlan.id,
            title: 'Illegal Update',
          },
          'trainer_123',
        ),
      ).rejects.toThrow(CompletedNutritionPlanImmutableException);
    });

    it('should reject update if trainer is unauthorized', async () => {
      const draftPlan = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(draftPlan);

      const useCase = new UpdateNutritionPlanUseCase(mockPlanRepo, mockCoachingGateway);
      await expect(
        useCase.execute(
          {
            planId: draftPlan.id,
            title: 'Unauthorized Edit',
          },
          'trainer_impostor',
        ),
      ).rejects.toThrow(UnauthorizedNutritionActionException);
    });
  });

  describe('CreateNutritionPlanVersionUseCase', () => {
    it('should create a new sequential DRAFT version from existing plan', async () => {
      const existingPlan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(existingPlan);
      (mockPlanRepo.findHighestVersionNumber as any).mockResolvedValue(1);

      const useCase = new CreateNutritionPlanVersionUseCase(mockPlanRepo);
      const result = await useCase.execute(
        {
          planId: existingPlan.id,
          title: 'Nutrition Plan v2',
        },
        'trainer_123',
      );

      expect(result).toBeDefined();
      expect(result.version).toBe(2);
      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
      expect(result.title).toBe('Nutrition Plan v2');
      expect(mockPlanRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject version creation if trainer does not own the plan', async () => {
      const existingPlan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(existingPlan);

      const useCase = new CreateNutritionPlanVersionUseCase(mockPlanRepo);
      await expect(
        useCase.execute(
          {
            planId: existingPlan.id,
          },
          'trainer_impostor',
        ),
      ).rejects.toThrow(UnauthorizedNutritionActionException);
    });
  });

  describe('ActivateNutritionPlanUseCase', () => {
    it('should reject direct trainer activation of V1 plans — all plans require client approval', async () => {
      const v1Draft = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(v1Draft);

      const useCase = new ActivateNutritionPlanUseCase(mockPlanRepo, mockUow);
      await expect(useCase.execute(v1Draft.id, 'trainer_123')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
      expect(mockPlanRepo.save).not.toHaveBeenCalled();
    });

    it('should reject direct trainer activation of V2+ plans', async () => {
      const v2Draft = createMockPlan(2, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(v2Draft);

      const useCase = new ActivateNutritionPlanUseCase(mockPlanRepo, mockUow);
      await expect(useCase.execute(v2Draft.id, 'trainer_123')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
      expect(mockPlanRepo.save).not.toHaveBeenCalled();
    });

    it('should reject activation if caller is not the owning trainer', async () => {
      const targetDraft = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(targetDraft);

      const useCase = new ActivateNutritionPlanUseCase(mockPlanRepo, mockUow);
      await expect(useCase.execute(targetDraft.id, 'unauthorized_trainer')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
    });
  });

  describe('CompleteNutritionPlanUseCase', () => {
    it('should complete an active nutrition plan', async () => {
      const activePlan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);

      const useCase = new CompleteNutritionPlanUseCase(mockPlanRepo);
      const result = await useCase.execute(activePlan.id, 'trainer_123');

      expect(result.status).toBe(NutritionPlanStatus.COMPLETED);
      expect(mockPlanRepo.save).toHaveBeenCalledWith(activePlan);
    });

    it('should reject completion of a DRAFT plan', async () => {
      const draftPlan = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(draftPlan);

      const useCase = new CompleteNutritionPlanUseCase(mockPlanRepo);
      await expect(useCase.execute(draftPlan.id, 'trainer_123')).rejects.toThrow(
        InvalidNutritionPlanTransitionException,
      );
    });
  });

  describe('DeleteDraftNutritionPlanUseCase', () => {
    it('should delete a DRAFT plan', async () => {
      const draftPlan = createMockPlan(1, NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(draftPlan);

      const useCase = new DeleteDraftNutritionPlanUseCase(mockPlanRepo);
      await useCase.execute(draftPlan.id, 'trainer_123');

      expect(mockPlanRepo.delete).toHaveBeenCalledWith(draftPlan.id);
    });

    it('should reject deletion of an ACTIVE plan', async () => {
      const activePlan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);

      const useCase = new DeleteDraftNutritionPlanUseCase(mockPlanRepo);
      await expect(useCase.execute(activePlan.id, 'trainer_123')).rejects.toThrow(
        ActiveNutritionPlanImmutableException,
      );
    });
  });

  describe('GetNutritionPlanUseCase & ListNutritionPlansUseCase', () => {
    it('should allow authorized client or trainer to get plan', async () => {
      const plan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(plan);

      const useCase = new GetNutritionPlanUseCase(mockPlanRepo);
      const byTrainer = await useCase.execute(plan.id, 'trainer_123');
      const byClient = await useCase.execute(plan.id, 'client_123');

      expect(byTrainer.id).toBe(plan.id);
      expect(byClient.id).toBe(plan.id);
    });

    it('should reject unauthorized user from accessing plan', async () => {
      const plan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(plan);

      const useCase = new GetNutritionPlanUseCase(mockPlanRepo);
      await expect(useCase.execute(plan.id, 'unauthorized_user')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
    });

    it('should list plans for authorized relationship members', async () => {
      const plan = createMockPlan(1, NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findByRelationshipId as any).mockResolvedValue([plan]);

      const useCase = new ListNutritionPlansUseCase(mockPlanRepo, mockCoachingGateway);
      const plans = await useCase.execute('rel_123', 'trainer_123');

      expect(plans.length).toBe(1);
      expect(plans[0].id).toBe(plan.id);
    });
  });
});
