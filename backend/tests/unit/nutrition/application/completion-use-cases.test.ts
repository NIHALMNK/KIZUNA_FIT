import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StartNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/start-nutrition-completion.use-case';
import { UpdateNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/update-nutrition-completion.use-case';
import { CompleteNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/complete-nutrition-completion.use-case';
import { GetNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/get-nutrition-completion.use-case';
import { ListNutritionCompletionsUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/list-nutrition-completions.use-case';
import { INutritionCompletionRepository } from '../../../../src/modules/nutrition/domain/repositories/INutritionCompletionRepository';
import { INutritionPlanRepository } from '../../../../src/modules/nutrition/domain/repositories/INutritionPlanRepository';
import { INutritionCoachingGateway } from '../../../../src/modules/nutrition/application/ports/INutritionCoachingGateway';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionCompletion } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-completion.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  NutritionPlanStatus,
} from '../../../../src/modules/nutrition/domain/enums';
import {
  DuplicateNutritionCompletionException,
  NutritionCompletionImmutableException,
  NutritionCompletionNotFoundException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../src/shared/exceptions/AppError';

describe('Nutrition Completion Application Use Cases Tests', () => {
  let mockCompletionRepo: INutritionCompletionRepository;
  let mockPlanRepo: INutritionPlanRepository;
  let mockCoachingGateway: INutritionCoachingGateway;

  const createMockMeal = (): Meal => {
    const food = FoodEntry.create({
      name: 'Oats',
      quantity: 80,
      unit: 'g',
      calories: 300,
      protein: 10,
      carbohydrates: 54,
      fats: 5,
    }).getValue();

    const macros = MacroNutrients.create({
      calories: 450,
      protein: 25,
      carbohydrates: 55,
      fats: 12,
    }).getValue();

    return Meal.create(
      {
        mealType: MealType.BREAKFAST,
        name: 'Protein Oatmeal',
        targetCalories: 450,
        targetMacros: macros,
        foodEntries: [food],
      },
      'meal_1',
    ).getValue();
  };

  const createMockPlan = (
    status: NutritionPlanStatus = NutritionPlanStatus.ACTIVE,
  ): NutritionPlan => {
    const now = new Date();
    const currentWeekday = NutritionCompletion.getWeekdayFromDate(now);
    const day = NutritionDay.create({
      weekday: currentWeekday,
      dayNumber: 1,
      name: `${currentWeekday} Training`,
      targetCalories: 2200,
      meals: [createMockMeal()],
    }).getValue();

    return NutritionPlan.create({
      coachingRelationshipId: 'rel_123',
      trainerId: 'trainer_123',
      clientId: 'client_123',
      version: 1,
      title: 'Active Nutrition Plan',
      durationWeeks: 4,
      nutritionDays: [day],
      status,
      activatedAt: status === NutritionPlanStatus.ACTIVE ? now : undefined,
    }).getValue();
  };

  const createMockCompletion = (
    status: NutritionCompletionStatus = NutritionCompletionStatus.IN_PROGRESS,
  ): NutritionCompletion => {
    const plan = createMockPlan(NutritionPlanStatus.ACTIVE);
    const snapshot = NutritionDaySnapshot.fromNutritionDay(plan.nutritionDays[0]);

    return NutritionCompletion.create({
      coachingRelationshipId: 'rel_123',
      nutritionPlanId: plan.id,
      clientId: 'client_123',
      trainerId: 'trainer_123',
      completionDate: new Date(),
      weekday: plan.nutritionDays[0].weekday,
      dayNumber: 1,
      nutritionDaySnapshot: snapshot,
      mealCompletions: [],
      status,
    }).getValue();
  };

  beforeEach(() => {
    mockCompletionRepo = {
      findById: vi.fn(),
      findByPlanAndDay: vi.fn(),
      findByPlanClientAndDate: vi.fn(),
      findByRelationshipId: vi.fn(),
      findByClientId: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    mockPlanRepo = {
      findById: vi.fn(),
      findActiveByRelationshipId: vi.fn(),
      findActiveByClientId: vi.fn(),
      findByRelationshipId: vi.fn(),
      findHighestVersionNumber: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined),
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

  describe('StartNutritionCompletionUseCase', () => {
    it('should start a daily nutrition completion with server-generated snapshot', async () => {
      const activePlan = createMockPlan(NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);
      (mockCompletionRepo.findByPlanClientAndDate as any).mockResolvedValue(null);

      const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);

      const result = await useCase.execute(
        {
          nutritionPlanId: activePlan.id,
          completionDate: new Date().toISOString(),
        },
        'client_123',
      );

      expect(result).toBeDefined();
      expect(result.status).toBe(NutritionCompletionStatus.IN_PROGRESS);
      expect(result.weekday).toBe(activePlan.nutritionDays[0].weekday);
      expect(result.nutritionDaySnapshot.targetCalories).toBe(2200);
      expect(result.nutritionDaySnapshot.meals[0].name).toBe('Protein Oatmeal');
      expect(result.mealCompletions.length).toBe(1);
      expect(mockCompletionRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject starting completion on non-ACTIVE plan', async () => {
      const draftPlan = createMockPlan(NutritionPlanStatus.DRAFT);
      (mockPlanRepo.findById as any).mockResolvedValue(draftPlan);

      const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);

      await expect(
        useCase.execute(
          {
            nutritionPlanId: draftPlan.id,
            completionDate: new Date().toISOString(),
          },
          'client_123',
        ),
      ).rejects.toThrow(ValidationError);
    });

    it('should reject starting duplicate completion for same plan and day', async () => {
      const activePlan = createMockPlan(NutritionPlanStatus.ACTIVE);
      const existingCompletion = createMockCompletion();

      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);
      (mockCompletionRepo.findByPlanClientAndDate as any).mockResolvedValue(existingCompletion);

      const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);

      await expect(
        useCase.execute(
          {
            nutritionPlanId: activePlan.id,
            completionDate: new Date().toISOString(),
          },
          'client_123',
        ),
      ).rejects.toThrow(DuplicateNutritionCompletionException);
    });

    it('should reject client who does not own the plan', async () => {
      const activePlan = createMockPlan(NutritionPlanStatus.ACTIVE);
      (mockPlanRepo.findById as any).mockResolvedValue(activePlan);

      const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);

      await expect(
        useCase.execute(
          {
            nutritionPlanId: activePlan.id,
            completionDate: new Date().toISOString(),
          },
          'client_impostor',
        ),
      ).rejects.toThrow(UnauthorizedNutritionActionException);
    });
  });

  describe('UpdateNutritionCompletionUseCase', () => {
    it('should update execution details while IN_PROGRESS', async () => {
      const completion = createMockCompletion(NutritionCompletionStatus.IN_PROGRESS);
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
      const result = await useCase.execute(
        completion.id,
        {
          hydrationSummary: { loggedMl: 3200, targetMl: 3500 },
          macroSummary: { totalCalories: 2150, protein: 160, carbohydrates: 230, fats: 65 },
          feedback: { rating: 5, energyLevel: 4, digestionNotes: 'Smooth' },
          mealCompletions: [
            {
              mealId: 'meal_1',
              mealType: MealType.BREAKFAST,
              name: 'Protein Oatmeal',
              isCompleted: true,
              state: MealCompletionStatus.COMPLETED,
              consumedCalories: 450,
            },
          ],
        },
        'client_123',
      );

      expect(result.hydrationSummary?.loggedMl).toBe(3200);
      expect(result.macroSummary?.totalCalories).toBe(2150);
      expect(result.feedback?.rating).toBe(5);
      expect(result.mealCompletions[0].isCompleted).toBe(true);
      expect(mockCompletionRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject update on COMPLETED completion record', async () => {
      const completion = createMockCompletion(NutritionCompletionStatus.COMPLETED);
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
      await expect(
        useCase.execute(
          completion.id,
          {
            hydrationSummary: { loggedMl: 3000 },
          },
          'client_123',
        ),
      ).rejects.toThrow(NutritionCompletionImmutableException);
    });
  });

  describe('CompleteNutritionCompletionUseCase', () => {
    it('should complete IN_PROGRESS nutrition completion and finalize record', async () => {
      const completion = createMockCompletion(NutritionCompletionStatus.IN_PROGRESS);
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new CompleteNutritionCompletionUseCase(mockCompletionRepo);
      const result = await useCase.execute(completion.id, 'client_123', {
        feedback: { rating: 5, adherenceConfidence: 5 },
      });

      expect(result.status).toBe(NutritionCompletionStatus.COMPLETED);
      expect(result.completedAt).toBeDefined();
      expect(result.feedback?.rating).toBe(5);
      expect(mockCompletionRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject completing if client does not own record', async () => {
      const completion = createMockCompletion(NutritionCompletionStatus.IN_PROGRESS);
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new CompleteNutritionCompletionUseCase(mockCompletionRepo);
      await expect(useCase.execute(completion.id, 'client_impostor')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
    });
  });

  describe('GetNutritionCompletionUseCase & ListNutritionCompletionsUseCase', () => {
    it('should allow authorized client or trainer to get completion', async () => {
      const completion = createMockCompletion();
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new GetNutritionCompletionUseCase(mockCompletionRepo);
      const byClient = await useCase.execute(completion.id, 'client_123');
      const byTrainer = await useCase.execute(completion.id, 'trainer_123');

      expect(byClient.id).toBe(completion.id);
      expect(byTrainer.id).toBe(completion.id);
    });

    it('should reject unauthorized user from reading completion', async () => {
      const completion = createMockCompletion();
      (mockCompletionRepo.findById as any).mockResolvedValue(completion);

      const useCase = new GetNutritionCompletionUseCase(mockCompletionRepo);
      await expect(useCase.execute(completion.id, 'unauthorized_user')).rejects.toThrow(
        UnauthorizedNutritionActionException,
      );
    });

    it('should list completions for authorized relationship', async () => {
      const completion = createMockCompletion();
      (mockCompletionRepo.findByRelationshipId as any).mockResolvedValue([completion]);

      const useCase = new ListNutritionCompletionsUseCase(mockCompletionRepo, mockCoachingGateway);

      const list = await useCase.execute('rel_123', 'client_123');
      expect(list.length).toBe(1);
      expect(list[0].id).toBe(completion.id);
    });
  });
});
