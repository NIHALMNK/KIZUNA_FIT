import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StartNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/start-nutrition-completion.use-case';
import { UpdateNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/update-nutrition-completion.use-case';
import { INutritionCompletionRepository } from '../../../../src/modules/nutrition/domain/repositories/INutritionCompletionRepository';
import { INutritionPlanRepository } from '../../../../src/modules/nutrition/domain/repositories/INutritionPlanRepository';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { FoodAlternative } from '../../../../src/modules/nutrition/domain/value-objects/food-alternative.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { NutritionCompletion } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-completion.aggregate';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  NutritionPlanStatus,
  Weekday,
} from '../../../../src/modules/nutrition/domain/enums';
import { ValidationError } from '../../../../src/shared/exceptions/AppError';

describe('Nutrition Execution Architecture Core Invariants Tests', () => {
  let mockCompletionRepo: INutritionCompletionRepository;
  let mockPlanRepo: INutritionPlanRepository;

  const createTestPlan = (): NutritionPlan => {
    const altResult = FoodAlternative.create({
      id: 'alt_yogurt',
      name: 'Greek Yogurt + Oats',
      quantity: 200,
      unit: 'g',
      calories: 250,
      protein: 20,
      carbohydrates: 30,
      fats: 5,
    });
    expect(altResult.isSuccess).toBe(true);

    const food1 = FoodEntry.create({
      id: 'food_oats',
      name: 'Oatmeal',
      quantity: 100,
      unit: 'g',
      calories: 350,
      protein: 12,
      carbohydrates: 60,
      fats: 6,
      alternatives: [altResult.getValue()],
    }).getValue();

    const food2 = FoodEntry.create({
      id: 'food_whey',
      name: 'Whey Protein',
      quantity: 30,
      unit: 'g',
      calories: 120,
      protein: 24,
      carbohydrates: 2,
      fats: 1,
    }).getValue();

    const breakfastMeal = Meal.create(
      {
        mealType: MealType.BREAKFAST,
        name: 'Power Breakfast',
        targetCalories: 470,
        targetMacros: MacroNutrients.create({
          calories: 470,
          protein: 36,
          carbohydrates: 62,
          fats: 7,
        }).getValue(),
        foodEntries: [food1, food2],
      },
      'meal_breakfast',
    ).getValue();

    const lunchMeal = Meal.create(
      {
        mealType: MealType.LUNCH,
        name: 'Chicken Rice',
        targetCalories: 600,
        foodEntries: [
          FoodEntry.create({
            id: 'food_chicken',
            name: 'Grilled Chicken',
            quantity: 200,
            unit: 'g',
            calories: 330,
            protein: 62,
            carbohydrates: 0,
            fats: 7,
          }).getValue(),
        ],
      },
      'meal_lunch',
    ).getValue();

    const todayWeekday = NutritionCompletion.getWeekdayFromDate(new Date());

    const day = NutritionDay.create({
      weekday: todayWeekday,
      dayNumber: 1,
      name: `${todayWeekday} Schedule`,
      targetCalories: 1070,
      meals: [breakfastMeal, lunchMeal],
    }).getValue();

    return NutritionPlan.create({
      coachingRelationshipId: 'rel_test_1',
      trainerId: 'trainer_1',
      clientId: 'client_1',
      version: 1,
      title: 'Targeted Plan',
      durationWeeks: 4,
      nutritionDays: [day],
      status: NutritionPlanStatus.ACTIVE,
      activatedAt: new Date(),
    }).getValue();
  };

  const createActiveCompletion = (plan: NutritionPlan): NutritionCompletion => {
    const snapshot = NutritionDaySnapshot.fromNutritionDay(plan.nutritionDays[0]);
    return NutritionCompletion.create({
      coachingRelationshipId: plan.coachingRelationshipId,
      nutritionPlanId: plan.id,
      clientId: plan.clientId,
      trainerId: plan.trainerId,
      completionDate: new Date(),
      weekday: plan.nutritionDays[0].weekday,
      dayNumber: 1,
      nutritionDaySnapshot: snapshot,
      mealCompletions: [],
      status: NutritionCompletionStatus.IN_PROGRESS,
    }).getValue();
  };

  beforeEach(() => {
    mockCompletionRepo = {
      findById: vi.fn(),
      findByPlanAndDay: vi.fn(),
      findByPlanClientAndDate: vi.fn(),
      findByRelationshipId: vi.fn(),
      findByClientId: vi.fn(),
      findByClientIdInRange: vi.fn(),
      findByRelationshipIdInRange: vi.fn(),
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
  });

  it('1. New daily completion initializes all meals as NOT_TRACKED', async () => {
    const plan = createTestPlan();
    (mockPlanRepo.findById as any).mockResolvedValue(plan);
    (mockCompletionRepo.findByPlanClientAndDate as any).mockResolvedValue(null);

    const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);
    const res = await useCase.execute(
      { nutritionPlanId: plan.id, completionDate: new Date().toISOString() },
      'client_1',
    );

    expect(res.mealCompletions.length).toBe(2);
    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.NOT_TRACKED);
    expect(res.mealCompletions[1].state).toBe(MealCompletionStatus.NOT_TRACKED);
    expect(res.mealCompletions[0].isCompleted).toBe(false);
  });

  it('2. Untouched meals remain NOT_TRACKED during updates', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            consumedItems: [],
          },
        ],
      },
      'client_1',
    );

    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.NOT_TRACKED);
    expect(res.mealCompletions[0].isCompleted).toBe(false);
  });

  it('3. All prescribed foods consumed -> COMPLETED', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            consumedItems: [
              {
                name: 'Oatmeal',
                quantity: 100,
                unit: 'g',
                calories: 350,
                protein: 12,
                carbohydrates: 60,
                fats: 6,
              },
              {
                name: 'Whey Protein',
                quantity: 30,
                unit: 'g',
                calories: 120,
                protein: 24,
                carbohydrates: 2,
                fats: 1,
              },
            ],
          },
        ],
      },
      'client_1',
    );

    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.COMPLETED);
    expect(res.mealCompletions[0].isCompleted).toBe(true);
    expect(res.mealCompletions[0].consumedCalories).toBe(470);
  });

  it('4. Some prescribed foods consumed -> PARTIALLY_COMPLETED', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            consumedItems: [
              {
                name: 'Oatmeal',
                quantity: 100,
                unit: 'g',
                calories: 350,
                protein: 12,
                carbohydrates: 60,
                fats: 6,
              },
            ],
          },
        ],
      },
      'client_1',
    );

    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.PARTIALLY_COMPLETED);
    expect(res.mealCompletions[0].isCompleted).toBe(false);
  });

  it('5. Explicit meal skip -> SKIPPED (clearing consumed foods)', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            state: MealCompletionStatus.SKIPPED,
            consumedItems: [],
          },
        ],
      },
      'client_1',
    );

    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.SKIPPED);
    expect(res.mealCompletions[0].isCompleted).toBe(false);
    expect(res.mealCompletions[0].consumedItems.length).toBe(0);
  });

  it('6 & 7 & 10. Alternative selection persists, preserves original prescription, and uses alternative macros', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            consumedItems: [
              {
                name: 'Whey Protein',
                quantity: 30,
                unit: 'g',
                calories: 120,
                protein: 24,
                carbohydrates: 2,
                fats: 1,
              },
            ],
            selectedAlternative: {
              prescribedFoodId: 'food_oats',
              prescribedFoodName: 'Oatmeal',
              alternativeId: 'alt_yogurt',
              alternativeName: 'Greek Yogurt + Oats',
              quantity: 200,
              unit: 'g',
              calories: 250,
              protein: 20,
              carbohydrates: 30,
              fats: 5,
            },
          },
        ],
      },
      'client_1',
    );

    // 6. Both items executed (1 consumed + 1 alternative) -> COMPLETED
    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.COMPLETED);
    expect(res.mealCompletions[0].isCompleted).toBe(true);
    expect(res.mealCompletions[0].selectedAlternative).toBeDefined();
    expect(res.mealCompletions[0].selectedAlternative?.alternativeName).toBe('Greek Yogurt + Oats');

    // 7. Original prescribed snapshot remains Oatmeal
    expect(res.nutritionDaySnapshot.meals[0].foodEntries[0].name).toBe('Oatmeal');

    // 10. Meal calories = 120 (whey) + 250 (alternative) = 370
    expect(res.mealCompletions[0].consumedCalories).toBe(370);
    expect(res.mealCompletions[0].consumedMacros?.protein).toBe(44);
  });

  it('12 & 13. Single meal execution invariant: duplicate mealIds are deduplicated', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: new Date().toISOString().split('T')[0],
        mealCompletions: [
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast',
            isCompleted: false,
            consumedItems: [],
          },
          {
            mealId: 'meal_breakfast',
            mealType: MealType.BREAKFAST,
            name: 'Power Breakfast Duplicate',
            isCompleted: false,
            consumedItems: [],
          },
        ],
      },
      'client_1',
    );

    // Exactly one record for meal_breakfast
    const breakfastRecords = res.mealCompletions.filter((m) => m.mealId === 'meal_breakfast');
    expect(breakfastRecords.length).toBe(1);
  });

  it('14 & 15. Client cannot modify yesterday or tomorrow (read-only dates)', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);

    // Yesterday client date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await expect(
      useCase.execute(
        completion.id,
        {
          clientToday: yesterday.toISOString().split('T')[0],
          mealCompletions: [],
        },
        'client_1',
      ),
    ).rejects.toThrow(ValidationError);

    // Tomorrow client date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    await expect(
      useCase.execute(
        completion.id,
        {
          clientToday: tomorrow.toISOString().split('T')[0],
          mealCompletions: [],
        },
        'client_1',
      ),
    ).rejects.toThrow(ValidationError);
  });

  it('16. Client can modify today', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const today = new Date().toISOString().split('T')[0];

    const res = await useCase.execute(
      completion.id,
      {
        clientToday: today,
        mealCompletions: [],
      },
      'client_1',
    );

    expect(res).toBeDefined();
    expect(mockCompletionRepo.save).toHaveBeenCalledTimes(1);
  });

  it('17. Multiple FoodEntry items in the same meal can independently select alternatives', async () => {
    const altOats = FoodAlternative.create({
      id: 'alt_yogurt',
      name: 'Greek Yogurt + Oats',
      quantity: 200,
      unit: 'g',
      calories: 250,
      protein: 20,
      carbohydrates: 30,
      fats: 5,
    }).getValue();

    const altWhey = FoodAlternative.create({
      id: 'alt_plant_protein',
      name: 'Plant Protein Blend',
      quantity: 35,
      unit: 'g',
      calories: 140,
      protein: 25,
      carbohydrates: 4,
      fats: 2,
    }).getValue();

    const foodOats = FoodEntry.create({
      id: 'food_oats',
      name: 'Oatmeal',
      quantity: 100,
      unit: 'g',
      calories: 350,
      protein: 12,
      carbohydrates: 60,
      fats: 6,
      alternatives: [altOats],
    }).getValue();

    const foodWhey = FoodEntry.create({
      id: 'food_whey',
      name: 'Whey Protein',
      quantity: 30,
      unit: 'g',
      calories: 120,
      protein: 24,
      carbohydrates: 2,
      fats: 1,
      alternatives: [altWhey],
    }).getValue();

    const meal = Meal.create(
      {
        mealType: MealType.BREAKFAST,
        name: 'Super Breakfast',
        foodEntries: [foodOats, foodWhey],
      },
      'meal_multi',
    ).getValue();

    const todayWd = NutritionCompletion.getWeekdayFromDate(new Date());
    const day = NutritionDay.create(
      {
        weekday: todayWd,
        dayNumber: 1,
        meals: [meal],
      },
      'day_multi',
    ).getValue();

    const plan = NutritionPlan.reconstitute(
      {
        coachingRelationshipId: 'rel_1',
        trainerId: 'trainer_1',
        clientId: 'client_1',
        version: 1,
        title: 'Plan Multi',
        durationWeeks: 4,
        nutritionDays: [day],
        status: NutritionPlanStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      'plan_multi',
    );

    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const today = new Date().toISOString().split('T')[0];

    // Both foods choose alternatives independently
    const res = await useCase.execute(
      completion.id,
      {
        clientToday: today,
        mealCompletions: [
          {
            mealId: 'meal_multi',
            mealType: MealType.BREAKFAST,
            name: 'Super Breakfast',
            consumedItems: [
              {
                prescribedFoodId: 'food_oats',
                prescribedFoodName: 'Oatmeal',
                consumedType: 'ALTERNATIVE',
                consumedFoodId: 'alt_yogurt',
                consumedFoodName: 'Greek Yogurt + Oats',
                quantity: 200,
                unit: 'g',
              },
              {
                prescribedFoodId: 'food_whey',
                prescribedFoodName: 'Whey Protein',
                consumedType: 'ALTERNATIVE',
                consumedFoodId: 'alt_plant_protein',
                consumedFoodName: 'Plant Protein Blend',
                quantity: 35,
                unit: 'g',
              },
            ],
          },
        ],
      },
      'client_1',
    );

    expect(res.mealCompletions[0].state).toBe(MealCompletionStatus.COMPLETED);
    expect(res.mealCompletions[0].isCompleted).toBe(true);
    expect(res.mealCompletions[0].consumedItems.length).toBe(2);
    // Calories = 250 (yogurt) + 140 (plant protein) = 390
    expect(res.mealCompletions[0].consumedCalories).toBe(390);
    // Protein = 20 + 25 = 45
    expect(res.mealCompletions[0].consumedMacros?.protein).toBe(45);
  });

  it('18. Client selecting arbitrary unconfigured alternative is strictly rejected by backend', async () => {
    const plan = createTestPlan();
    const completion = createActiveCompletion(plan);
    (mockCompletionRepo.findById as any).mockResolvedValue(completion);

    const useCase = new UpdateNutritionCompletionUseCase(mockCompletionRepo);
    const today = new Date().toISOString().split('T')[0];

    await expect(
      useCase.execute(
        completion.id,
        {
          clientToday: today,
          mealCompletions: [
            {
              mealId: 'meal_breakfast',
              mealType: MealType.BREAKFAST,
              name: 'Power Breakfast',
              consumedItems: [
                {
                  prescribedFoodId: 'food_oats',
                  prescribedFoodName: 'Oatmeal',
                  consumedType: 'ALTERNATIVE',
                  consumedFoodId: 'alt_random_pizza',
                  consumedFoodName: 'Pepperoni Pizza',
                  quantity: 1,
                  unit: 'slice',
                },
              ],
            },
          ],
        },
        'client_1',
      ),
    ).rejects.toThrow(ValidationError);
  });

  it('19. Week 1 Monday and Week 2 Monday have distinct weekNumber and separate completion occurrences', async () => {
    const plan = createTestPlan();
    (mockPlanRepo.findById as any).mockResolvedValue(plan);
    (mockCompletionRepo.findByPlanClientAndDate as any).mockResolvedValue(null);

    const useCase = new StartNutritionCompletionUseCase(mockCompletionRepo, mockPlanRepo);

    // Week 1 occurrence
    const startDate = plan.activatedAt || plan.createdAt;
    const week1Res = await useCase.execute(
      {
        nutritionPlanId: plan.id,
        completionDate: startDate.toISOString().split('T')[0],
      },
      'client_1',
    );

    expect(week1Res.weekNumber).toBe(1);

    // Week 2 occurrence (7 days later)
    const week2Date = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const week2Res = await useCase.execute(
      {
        nutritionPlanId: plan.id,
        completionDate: week2Date.toISOString().split('T')[0],
      },
      'client_1',
    );

    expect(week2Res.weekNumber).toBe(2);
    expect(week1Res.completionDate).not.toBe(week2Res.completionDate);
  });
});
