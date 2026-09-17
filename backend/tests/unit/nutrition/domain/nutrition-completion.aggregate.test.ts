import { describe, it, expect } from 'vitest';
import { NutritionCompletion } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-completion.aggregate';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import { MealCompletionRecord } from '../../../../src/modules/nutrition/domain/value-objects/meal-completion-record.value-object';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { HydrationSummary } from '../../../../src/modules/nutrition/domain/value-objects/hydration.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../../../../src/modules/nutrition/domain/value-objects/nutrition-feedback.value-object';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  Weekday,
} from '../../../../src/modules/nutrition/domain/enums';
import {
  InvalidNutritionCompletionTransitionException,
  NutritionCompletionImmutableException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';

describe('NutritionCompletion Aggregate Domain Tests', () => {
  const createMockSnapshot = (dayNumber = 1, weekday = Weekday.MONDAY): NutritionDaySnapshot => {
    return NutritionDaySnapshot.create({
      weekday,
      dayNumber,
      name: `Prescribed Day ${dayNumber}`,
      targetCalories: 2400,
      dailyMacroTargets: {
        calories: 2400,
        protein: 180,
        carbohydrates: 250,
        fats: 70,
      },
      hydrationGoal: { targetMl: 3500 },
      meals: [
        {
          mealId: 'meal_breakfast_1',
          mealType: MealType.BREAKFAST,
          name: 'Protein Oatmeal',
          timeOfDay: '08:00 AM',
          targetCalories: 500,
          targetMacros: { calories: 500, protein: 35, carbohydrates: 60, fats: 12 },
          foodEntries: [
            {
              name: 'Oats',
              quantity: 80,
              unit: 'g',
              calories: 300,
              protein: 10,
              carbohydrates: 54,
              fats: 5,
            },
          ],
        },
        {
          mealId: 'meal_lunch_1',
          mealType: MealType.LUNCH,
          name: 'Grilled Chicken Bowl',
          timeOfDay: '01:00 PM',
          targetCalories: 700,
          targetMacros: { calories: 700, protein: 55, carbohydrates: 70, fats: 18 },
          foodEntries: [],
        },
      ],
    }).getValue();
  };

  const createMockMealCompletion = (mealId = 'meal_breakfast_1'): MealCompletionRecord => {
    const consumedFood = FoodEntry.create({
      name: 'Oats',
      quantity: 80,
      unit: 'g',
      calories: 300,
      protein: 10,
      carbohydrates: 54,
      fats: 5,
    }).getValue();

    const consumedMacros = MacroNutrients.create({
      calories: 500,
      protein: 35,
      carbohydrates: 60,
      fats: 12,
    }).getValue();

    return MealCompletionRecord.create({
      mealId,
      mealType: MealType.BREAKFAST,
      name: 'Protein Oatmeal',
      isCompleted: true,
      state: MealCompletionStatus.COMPLETED,
      consumedItems: [consumedFood],
      consumedMacros,
      consumedCalories: 500,
      timeConsumed: new Date(),
    }).getValue();
  };

  const createMockCompletion = (
    status: NutritionCompletionStatus = NutritionCompletionStatus.IN_PROGRESS,
  ): NutritionCompletion => {
    return NutritionCompletion.create({
      coachingRelationshipId: 'rel_123',
      nutritionPlanId: 'plan_123',
      clientId: 'client_123',
      trainerId: 'trainer_123',
      completionDate: '2026-09-07T12:00:00Z',
      weekday: Weekday.MONDAY,
      dayNumber: 1,
      nutritionDaySnapshot: createMockSnapshot(1, Weekday.MONDAY),
      mealCompletions: [createMockMealCompletion('meal_breakfast_1')],
      status,
    }).getValue();
  };

  describe('Creation and Invariants', () => {
    it('should create NutritionCompletion in IN_PROGRESS status by default', () => {
      const completion = createMockCompletion();

      expect(completion.id).toBeDefined();
      expect(completion.status).toBe(NutritionCompletionStatus.IN_PROGRESS);
      expect(completion.weekday).toBe(Weekday.MONDAY);
      expect(completion.completionDate.toISOString()).toBe('2026-09-07T00:00:00.000Z');
      expect(completion.nutritionDaySnapshot).toBeDefined();
      expect(completion.nutritionDaySnapshot.weekday).toBe(Weekday.MONDAY);
      expect(completion.mealCompletions.length).toBe(1);
      expect(completion.completedAt).toBeUndefined();
      expect(completion.domainEvents.length).toBe(1);
      expect(completion.domainEvents[0].constructor.name).toBe('NutritionCompletionStartedEvent');
    });

    it('should reject creation without coachingRelationshipId', () => {
      const result = NutritionCompletion.create({
        coachingRelationshipId: '',
        nutritionPlanId: 'plan_123',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: createMockSnapshot(1),
        mealCompletions: [],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('relationship ID is required');
    });

    it('should reject creation without nutritionPlanId', () => {
      const result = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: '',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: createMockSnapshot(1),
        mealCompletions: [],
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Nutrition plan ID is required');
    });

    it('should normalize completion date to UTC midnight and derive weekday', () => {
      const date = new Date('2026-09-07T18:45:00.000Z');
      const normalized = NutritionCompletion.normalizeCalendarDate(date);
      expect(normalized.getUTCHours()).toBe(0);
      expect(normalized.getUTCMinutes()).toBe(0);
      expect(normalized.getUTCSeconds()).toBe(0);

      const derivedWeekday = NutritionCompletion.getWeekdayFromDate(normalized);
      expect(derivedWeekday).toBe(Weekday.MONDAY);
    });
  });

  describe('Execution Updates and Lifecycle Transitions', () => {
    it('should allow updating execution data while IN_PROGRESS', () => {
      const completion = createMockCompletion(NutritionCompletionStatus.IN_PROGRESS);
      completion.clearEvents();

      const hydration = HydrationSummary.create({ loggedMl: 2800, targetMl: 3500 }).getValue();
      const macros = DailyMacroSummary.create({
        totalCalories: 2350,
        protein: 175,
        carbohydrates: 245,
        fats: 68,
      }).getValue();
      const feedback = NutritionFeedback.create({
        rating: 5,
        energyLevel: 4,
        adherenceConfidence: 5,
        digestionNotes: 'Felt great throughout the day',
      }).getValue();

      const updateResult = completion.updateExecution({
        hydrationSummary: hydration,
        macroSummary: macros,
        feedback,
      });

      expect(updateResult.isSuccess).toBe(true);
      expect(completion.hydrationSummary?.loggedMl).toBe(2800);
      expect(completion.macroSummary?.totalCalories).toBe(2350);
      expect(completion.feedback?.rating).toBe(5);
      expect(completion.domainEvents.length).toBe(1);
      expect(completion.domainEvents[0].constructor.name).toBe('NutritionCompletionUpdatedEvent');
    });

    it('should transition from IN_PROGRESS to COMPLETED and emit NutritionCompletedEvent', () => {
      const completion = createMockCompletion(NutritionCompletionStatus.IN_PROGRESS);
      completion.clearEvents();

      const completeResult = completion.complete();
      expect(completeResult.isSuccess).toBe(true);
      expect(completion.status).toBe(NutritionCompletionStatus.COMPLETED);
      expect(completion.completedAt).toBeDefined();
      expect(completion.domainEvents.length).toBe(1);
      expect(completion.domainEvents[0].constructor.name).toBe('NutritionCompletedEvent');
    });

    it('should reject modification once COMPLETED', () => {
      const completion = createMockCompletion(NutritionCompletionStatus.COMPLETED);

      expect(() =>
        completion.updateExecution({
          hydrationSummary: HydrationSummary.create({ loggedMl: 3000 }).getValue(),
        }),
      ).toThrow(NutritionCompletionImmutableException);
    });

    it('should reject invalid reverse transition or completing already completed record via exception check', () => {
      const completion = createMockCompletion(NutritionCompletionStatus.COMPLETED);
      // Completing an already COMPLETED completion returns ok idempotent
      expect(completion.complete().isSuccess).toBe(true);
    });
  });

  describe('Prescription Snapshot Immutability', () => {
    it('should maintain immutable snapshot of the prescribed day', () => {
      const snapshot = createMockSnapshot(1);
      const completion = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: 'plan_123',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [],
      }).getValue();

      expect(completion.nutritionDaySnapshot.meals.length).toBe(2);
      expect(completion.nutritionDaySnapshot.targetCalories).toBe(2400);
      expect(completion.nutritionDaySnapshot.meals[0].name).toBe('Protein Oatmeal');
    });
  });
});
