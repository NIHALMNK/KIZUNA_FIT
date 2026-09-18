import { describe, it, expect } from 'vitest';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import {
  HydrationGoal,
  HydrationSummary,
} from '../../../../src/modules/nutrition/domain/value-objects/hydration.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../../../../src/modules/nutrition/domain/value-objects/nutrition-feedback.value-object';
import { MealCompletionRecord } from '../../../../src/modules/nutrition/domain/value-objects/meal-completion-record.value-object';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { MealCompletionStatus, MealType } from '../../../../src/modules/nutrition/domain/enums';

describe('Nutrition Value Objects & Entities Domain Tests', () => {
  describe('MacroNutrients Value Object', () => {
    it('should create valid MacroNutrients', () => {
      const result = MacroNutrients.create({
        calories: 500,
        protein: 40,
        carbohydrates: 50,
        fats: 15,
      });

      expect(result.isSuccess).toBe(true);
      const macros = result.getValue();
      expect(macros.calories).toBe(500);
      expect(macros.protein).toBe(40);
      expect(macros.carbohydrates).toBe(50);
      expect(macros.fats).toBe(15);
      expect(macros.toPrimitives()).toEqual({
        calories: 500,
        protein: 40,
        carbohydrates: 50,
        fats: 15,
      });
    });

    it('should reject negative macro values', () => {
      expect(
        MacroNutrients.create({ calories: -1, protein: 10, carbohydrates: 10, fats: 10 }).isFailure,
      ).toBe(true);
      expect(
        MacroNutrients.create({ calories: 100, protein: -5, carbohydrates: 10, fats: 10 })
          .isFailure,
      ).toBe(true);
      expect(
        MacroNutrients.create({ calories: 100, protein: 10, carbohydrates: -1, fats: 10 })
          .isFailure,
      ).toBe(true);
      expect(
        MacroNutrients.create({ calories: 100, protein: 10, carbohydrates: 10, fats: -2 })
          .isFailure,
      ).toBe(true);
    });
  });

  describe('FoodEntry Value Object', () => {
    it('should create valid FoodEntry', () => {
      const result = FoodEntry.create({
        name: 'Chicken Breast',
        quantity: 150,
        unit: 'g',
        calories: 247,
        protein: 46,
        carbohydrates: 0,
        fats: 5,
        notes: 'Skinless, boneless',
      });

      expect(result.isSuccess).toBe(true);
      const food = result.getValue();
      expect(food.name).toBe('Chicken Breast');
      expect(food.quantity).toBe(150);
      expect(food.unit).toBe('g');
      expect(food.notes).toBe('Skinless, boneless');
    });

    it('should reject empty name or non-positive quantity', () => {
      expect(FoodEntry.create({ name: '', quantity: 100, unit: 'g' }).isFailure).toBe(true);
      expect(FoodEntry.create({ name: 'Rice', quantity: 0, unit: 'g' }).isFailure).toBe(true);
      expect(FoodEntry.create({ name: 'Rice', quantity: -10, unit: 'g' }).isFailure).toBe(true);
    });
  });

  describe('Hydration Value Objects', () => {
    it('should create HydrationGoal and reject zero or negative target', () => {
      const goal = HydrationGoal.create({ targetMl: 3000 }).getValue();
      expect(goal.targetMl).toBe(3000);
      expect(HydrationGoal.create({ targetMl: 0 }).isFailure).toBe(true);
      expect(HydrationGoal.create({ targetMl: -500 }).isFailure).toBe(true);
    });

    it('should create HydrationSummary and reject negative logged values', () => {
      const summary = HydrationSummary.create({ loggedMl: 2500, targetMl: 3000 }).getValue();
      expect(summary.loggedMl).toBe(2500);
      expect(HydrationSummary.create({ loggedMl: -100 }).isFailure).toBe(true);
    });
  });

  describe('NutritionFeedback Value Object', () => {
    it('should create valid feedback and enforce rating bounds 1..5', () => {
      const feedback = NutritionFeedback.create({
        rating: 4,
        energyLevel: 5,
        adherenceConfidence: 4,
        digestionNotes: 'Optimal digestion',
      }).getValue();

      expect(feedback.rating).toBe(4);
      expect(feedback.energyLevel).toBe(5);
      expect(feedback.digestionNotes).toBe('Optimal digestion');

      expect(NutritionFeedback.create({ rating: 0 }).isFailure).toBe(true);
      expect(NutritionFeedback.create({ rating: 6 }).isFailure).toBe(true);
      expect(NutritionFeedback.create({ energyLevel: 6 }).isFailure).toBe(true);
      expect(NutritionFeedback.create({ adherenceConfidence: 0 }).isFailure).toBe(true);
    });
  });

  describe('Meal Entity', () => {
    it('should create valid Meal entity with food entries and macro targets', () => {
      const food = FoodEntry.create({
        name: 'Egg',
        quantity: 3,
        unit: 'whole',
        calories: 210,
      }).getValue();
      const macros = MacroNutrients.create({
        calories: 400,
        protein: 30,
        carbohydrates: 20,
        fats: 20,
      }).getValue();

      const mealResult = Meal.create({
        mealType: MealType.BREAKFAST,
        name: 'Morning Scramble',
        timeOfDay: '07:30 AM',
        targetCalories: 400,
        targetMacros: macros,
        foodEntries: [food],
      });

      expect(mealResult.isSuccess).toBe(true);
      const meal = mealResult.getValue();
      expect(meal.id).toBeDefined();
      expect(meal.mealType).toBe(MealType.BREAKFAST);
      expect(meal.foodEntries.length).toBe(1);
      expect(meal.toPrimitives().foodEntries[0].name).toBe('Egg');
    });

    it('should reject invalid meal type or empty name', () => {
      expect(
        Meal.create({
          mealType: 'INVALID_MEAL' as MealType,
          name: 'Invalid Meal',
          foodEntries: [],
        }).isFailure,
      ).toBe(true);

      expect(
        Meal.create({
          mealType: MealType.LUNCH,
          name: '   ',
          foodEntries: [],
        }).isFailure,
      ).toBe(true);
    });
  });

  describe('NutritionDay Entity & Snapshot Creation', () => {
    it('should create valid NutritionDay and generate immutable NutritionDaySnapshot', () => {
      const meal = Meal.create({
        mealType: MealType.DINNER,
        name: 'Salmon & Asparagus',
        foodEntries: [],
      }).getValue();

      const dayResult = NutritionDay.create({
        dayNumber: 1,
        name: 'Rest Day Nutrition',
        meals: [meal],
      });

      expect(dayResult.isSuccess).toBe(true);
      const day = dayResult.getValue();
      expect(day.dayNumber).toBe(1);
      expect(day.meals.length).toBe(1);

      const snapshot = NutritionDaySnapshot.fromNutritionDay(day);
      expect(snapshot.dayNumber).toBe(1);
      expect(snapshot.meals.length).toBe(1);
      expect(snapshot.meals[0].name).toBe('Salmon & Asparagus');
      expect(snapshot.meals[0].mealType).toBe(MealType.DINNER);
    });

    it('should reject NutritionDay with no meals', () => {
      const dayResult = NutritionDay.create({
        dayNumber: 1,
        name: 'Empty Day',
        meals: [],
      });

      expect(dayResult.isFailure).toBe(true);
      expect(dayResult.error).toContain('must contain at least one prescribed meal');
    });
  });
});
