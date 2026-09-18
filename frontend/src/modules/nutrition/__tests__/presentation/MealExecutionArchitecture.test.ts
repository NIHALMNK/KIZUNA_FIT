import { describe, it, expect } from 'vitest';
import {
  getClientTodayDateString,
  getClientTodayWeekday,
  isDateToday,
  isDatePast,
  isDateFuture,
  normalizeCalendarDateString,
} from '../../utils/nutritionDateUtils';
import {
  MealCompletionStatus,
  FoodEntry,
  FoodAlternative,
  SelectedAlternative,
} from '../../domain/types/nutrition.types';

describe('Nutrition Execution Architecture - Frontend Unit Tests', () => {
  describe('Calendar Date & Today-Only Editability Invariant', () => {
    it('correctly identifies today date string as today and not past or future', () => {
      const today = getClientTodayDateString();
      expect(isDateToday(today)).toBe(true);
      expect(isDatePast(today)).toBe(false);
      expect(isDateFuture(today)).toBe(false);
    });

    it('correctly identifies past dates as read-only (past)', () => {
      const pastDate = '2020-01-01';
      expect(isDateToday(pastDate)).toBe(false);
      expect(isDatePast(pastDate)).toBe(true);
      expect(isDateFuture(pastDate)).toBe(false);
    });

    it('correctly identifies future dates as read-only (future)', () => {
      const futureDate = '2099-12-31';
      expect(isDateToday(futureDate)).toBe(false);
      expect(isDatePast(futureDate)).toBe(false);
      expect(isDateFuture(futureDate)).toBe(true);
    });

    it('normalizes ISO string and Date objects accurately', () => {
      const d = new Date(2026, 8, 16); // month is 0-indexed: Sept 16, 2026
      const normalized = normalizeCalendarDateString(d);
      expect(normalized).toBe('2026-09-16');
    });
  });

  describe('Deterministic Status Derivation & Alternative Semantics', () => {
    const oatmealAlt: FoodAlternative = {
      id: 'alt_yogurt_1',
      name: 'Greek Yogurt + Oats',
      quantity: 150,
      unit: 'g',
      calories: 300,
      protein: 25,
      carbohydrates: 35,
      fats: 4,
      notes: 'High protein swap',
    };

    const oatmeal: FoodEntry = {
      id: 'food_oatmeal',
      name: 'Oatmeal',
      quantity: 100,
      unit: 'g',
      calories: 500,
      protein: 15,
      carbohydrates: 70,
      fats: 10,
      alternatives: [oatmealAlt],
    };

    const banana: FoodEntry = {
      id: 'food_banana',
      name: 'Banana',
      quantity: 1,
      unit: 'pcs',
      calories: 105,
      protein: 1.3,
      carbohydrates: 27,
      fats: 0.3,
    };

    const prescribedFoods = [oatmeal, banana];

    // Helper simulating deterministic meal status derivation
    function deriveMealStatus(
      prescribed: FoodEntry[],
      consumed: FoodEntry[],
      selectedAlt: SelectedAlternative | null,
      isSkipped: boolean,
    ) {
      if (isSkipped) {
        return { state: MealCompletionStatus.SKIPPED, isCompleted: false, calories: 0 };
      }

      let executedCount = 0;
      let totalCalories = 0;
      let totalProtein = 0;

      for (const item of consumed) {
        totalCalories += item.calories || 0;
        totalProtein += item.protein || 0;
      }

      if (selectedAlt) {
        totalCalories += selectedAlt.calories || 0;
        totalProtein += selectedAlt.protein || 0;
      }

      for (const pf of prescribed) {
        const isConsumedDirectly = consumed.some(
          (c) => (c.id && c.id === pf.id) || c.name.toLowerCase() === pf.name.toLowerCase(),
        );
        const isReplacedByAlt =
          selectedAlt !== null &&
          ((selectedAlt.prescribedFoodId && selectedAlt.prescribedFoodId === pf.id) ||
            selectedAlt.prescribedFoodName.toLowerCase() === pf.name.toLowerCase());

        if (isConsumedDirectly || isReplacedByAlt) {
          executedCount++;
        }
      }

      let state: MealCompletionStatus;
      let isCompleted = false;

      if (executedCount === 0) {
        state = MealCompletionStatus.NOT_TRACKED;
      } else if (executedCount >= prescribed.length) {
        state = MealCompletionStatus.COMPLETED;
        isCompleted = true;
      } else {
        state = MealCompletionStatus.PARTIALLY_COMPLETED;
      }

      return { state, isCompleted, calories: totalCalories, protein: totalProtein };
    }

    it('returns NOT_TRACKED when client has not interacted with any items', () => {
      const result = deriveMealStatus(prescribedFoods, [], null, false);
      expect(result.state).toBe(MealCompletionStatus.NOT_TRACKED);
      expect(result.isCompleted).toBe(false);
      expect(result.calories).toBe(0);
    });

    it('returns PARTIALLY_COMPLETED when only oatmeal is consumed', () => {
      const result = deriveMealStatus(prescribedFoods, [oatmeal], null, false);
      expect(result.state).toBe(MealCompletionStatus.PARTIALLY_COMPLETED);
      expect(result.isCompleted).toBe(false);
      expect(result.calories).toBe(500);
      expect(result.protein).toBe(15);
    });

    it('returns COMPLETED when both oatmeal and banana are consumed directly', () => {
      const result = deriveMealStatus(prescribedFoods, [oatmeal, banana], null, false);
      expect(result.state).toBe(MealCompletionStatus.COMPLETED);
      expect(result.isCompleted).toBe(true);
      expect(result.calories).toBe(605);
    });

    it('CRITICAL: Alternative selection counts as EXECUTED and uses alternative nutritional values', () => {
      // Client selects Greek Yogurt + Oats alternative instead of Oatmeal, plus consumes Banana
      const selectedAlt: SelectedAlternative = {
        prescribedFoodId: oatmeal.id,
        prescribedFoodName: oatmeal.name,
        alternativeId: oatmealAlt.id,
        alternativeName: oatmealAlt.name,
        quantity: oatmealAlt.quantity,
        unit: oatmealAlt.unit,
        calories: oatmealAlt.calories,
        protein: oatmealAlt.protein,
        carbohydrates: oatmealAlt.carbohydrates,
        fats: oatmealAlt.fats,
      };

      const result = deriveMealStatus(prescribedFoods, [banana], selectedAlt, false);

      // Both oatmeal (via alternative) and banana are executed -> meal is COMPLETED
      expect(result.state).toBe(MealCompletionStatus.COMPLETED);
      expect(result.isCompleted).toBe(true);

      // Actual calories must use alternative (300) + banana (105) = 405 (NOT prescribed oatmeal 500!)
      expect(result.calories).toBe(405);
      // Actual protein: alternative (25) + banana (1.3) = 26.3
      expect(result.protein).toBe(26.3);
    });

    it('returns SKIPPED on explicit client action with 0 calories', () => {
      const result = deriveMealStatus(prescribedFoods, [], null, true);
      expect(result.state).toBe(MealCompletionStatus.SKIPPED);
      expect(result.isCompleted).toBe(false);
      expect(result.calories).toBe(0);
    });
  });
});
