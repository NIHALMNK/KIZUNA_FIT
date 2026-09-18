import { describe, it, expect } from 'vitest';
import { NutritionPlan } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-plan.aggregate';
import { NutritionCompletion } from '../../../../src/modules/nutrition/domain/aggregates/nutrition-completion.aggregate';
import { NutritionDay } from '../../../../src/modules/nutrition/domain/entities/nutrition-day.entity';
import { Meal } from '../../../../src/modules/nutrition/domain/entities/meal.entity';
import { FoodEntry } from '../../../../src/modules/nutrition/domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../src/modules/nutrition/domain/value-objects/macro-nutrients.value-object';
import {
  HydrationGoal,
  HydrationSummary,
} from '../../../../src/modules/nutrition/domain/value-objects/hydration.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../../../../src/modules/nutrition/domain/value-objects/nutrition-feedback.value-object';
import { NutritionDaySnapshot } from '../../../../src/modules/nutrition/domain/value-objects/nutrition-day-snapshot.value-object';
import { MealCompletionRecord } from '../../../../src/modules/nutrition/domain/value-objects/meal-completion-record.value-object';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  NutritionPlanStatus,
} from '../../../../src/modules/nutrition/domain/enums';
import { NutritionPlanPersistenceMapper } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/mappers/nutrition-plan-persistence.mapper';
import { NutritionCompletionPersistenceMapper } from '../../../../src/modules/nutrition/infrastructure/persistence/mongoose/mappers/nutrition-completion-persistence.mapper';

describe('Nutrition Persistence Mappers Unit Tests', () => {
  describe('NutritionPlanPersistenceMapper', () => {
    it('should map NutritionPlan Domain Aggregate to Persistence document and back to Domain without data loss', () => {
      const food = FoodEntry.create({
        name: 'Oats',
        quantity: 80,
        unit: 'g',
        calories: 300,
        protein: 10,
        carbohydrates: 54,
        fats: 5,
        notes: 'Organic rolled oats',
      }).getValue();

      const mealMacros = MacroNutrients.create({
        calories: 450,
        protein: 30,
        carbohydrates: 60,
        fats: 10,
      }).getValue();

      const meal = Meal.create({
        mealType: MealType.BREAKFAST,
        name: 'Power Oats',
        timeOfDay: '08:00 AM',
        targetCalories: 450,
        targetMacros: mealMacros,
        foodEntries: [food],
        notes: 'Add cinnamon',
      }).getValue();

      const dayMacros = MacroNutrients.create({
        calories: 2200,
        protein: 160,
        carbohydrates: 240,
        fats: 65,
      }).getValue();

      const hydration = HydrationGoal.create({
        targetMl: 3500,
        notes: 'Drink with electrolytes',
      }).getValue();

      const day = NutritionDay.create({
        dayNumber: 1,
        name: 'Training Day 1',
        targetCalories: 2200,
        dailyMacroTargets: dayMacros,
        hydrationGoal: hydration,
        meals: [meal],
        notes: 'High carb on leg day',
      }).getValue();

      const plan = NutritionPlan.create({
        coachingRelationshipId: 'rel_123',
        trainerId: 'trainer_123',
        clientId: 'client_123',
        version: 2,
        title: 'Hypertrophy Cutting Phase',
        description: 'Targeted caloric deficit',
        durationWeeks: 4,
        nutritionDays: [day],
        status: NutritionPlanStatus.ACTIVE,
      }).getValue();

      // Domain -> Persistence
      const raw = NutritionPlanPersistenceMapper.toPersistence(plan);
      expect(raw._id).toBe(plan.id);
      expect(raw.coachingRelationshipId).toBe('rel_123');
      expect(raw.version).toBe(2);
      expect(raw.durationWeeks).toBe(4);
      expect(raw.nutritionDays.length).toBe(1);
      expect(raw.nutritionDays[0].meals[0].foodEntries[0].name).toBe('Oats');
      expect(raw.nutritionDays[0].hydrationGoal.targetMl).toBe(3500);

      // Persistence -> Domain
      const restored = NutritionPlanPersistenceMapper.toDomain(raw as any);
      expect(restored.id).toBe(plan.id);
      expect(restored.coachingRelationshipId).toBe('rel_123');
      expect(restored.version).toBe(2);
      expect(restored.durationWeeks).toBe(4);
      expect(restored.status).toBe(NutritionPlanStatus.ACTIVE);
      expect(restored.nutritionDays.length).toBe(1);
      expect(restored.nutritionDays[0].dayNumber).toBe(1);
      expect(restored.nutritionDays[0].meals[0].name).toBe('Power Oats');
      expect(restored.nutritionDays[0].meals[0].foodEntries[0].name).toBe('Oats');
      expect(restored.nutritionDays[0].hydrationGoal?.targetMl).toBe(3500);
    });
  });

  describe('NutritionCompletionPersistenceMapper', () => {
    it('should map NutritionCompletion Domain Aggregate to Persistence and back to Domain preserving immutable snapshot', () => {
      const snapshot = NutritionDaySnapshot.create({
        dayNumber: 1,
        name: 'Prescribed Leg Day',
        targetCalories: 2500,
        dailyMacroTargets: {
          calories: 2500,
          protein: 180,
          carbohydrates: 280,
          fats: 70,
        },
        hydrationGoal: { targetMl: 4000 },
        meals: [
          {
            mealId: 'meal_1',
            mealType: MealType.BREAKFAST,
            name: 'Breakfast Bowl',
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
        ],
      }).getValue();

      const consumedFood = FoodEntry.create({
        name: 'Oats',
        quantity: 80,
        unit: 'g',
        calories: 300,
        protein: 10,
        carbohydrates: 54,
        fats: 5,
      }).getValue();

      const mealRecord = MealCompletionRecord.create({
        mealId: 'meal_1',
        mealType: MealType.BREAKFAST,
        name: 'Breakfast Bowl',
        isCompleted: true,
        state: MealCompletionStatus.COMPLETED,
        consumedItems: [consumedFood],
        consumedCalories: 500,
      }).getValue();

      const macroSummary = DailyMacroSummary.create({
        totalCalories: 2450,
        protein: 175,
        carbohydrates: 275,
        fats: 68,
      }).getValue();

      const hydrationSummary = HydrationSummary.create({
        loggedMl: 3800,
        targetMl: 4000,
      }).getValue();

      const feedback = NutritionFeedback.create({
        rating: 5,
        energyLevel: 4,
        adherenceConfidence: 5,
        digestionNotes: 'Optimal digestion',
      }).getValue();

      const completion = NutritionCompletion.create({
        coachingRelationshipId: 'rel_123',
        nutritionPlanId: 'plan_123',
        clientId: 'client_123',
        trainerId: 'trainer_123',
        dayNumber: 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions: [mealRecord],
        macroSummary,
        hydrationSummary,
        feedback,
        status: NutritionCompletionStatus.IN_PROGRESS,
      }).getValue();

      // Domain -> Persistence
      const raw = NutritionCompletionPersistenceMapper.toPersistence(completion);
      expect(raw._id).toBe(completion.id);
      expect(raw.nutritionPlanId).toBe('plan_123');
      expect(raw.dayNumber).toBe(1);
      expect(raw.nutritionDaySnapshot.targetCalories).toBe(2500);
      expect(raw.nutritionDaySnapshot.meals[0].name).toBe('Breakfast Bowl');
      expect(raw.mealCompletions[0].isCompleted).toBe(true);
      expect(raw.macroSummary.totalCalories).toBe(2450);
      expect(raw.hydrationSummary.loggedMl).toBe(3800);
      expect(raw.feedback.rating).toBe(5);

      // Persistence -> Domain
      const restored = NutritionCompletionPersistenceMapper.toDomain(raw as any);
      expect(restored.id).toBe(completion.id);
      expect(restored.nutritionPlanId).toBe('plan_123');
      expect(restored.dayNumber).toBe(1);
      expect(restored.nutritionDaySnapshot.targetCalories).toBe(2500);
      expect(restored.nutritionDaySnapshot.meals[0].name).toBe('Breakfast Bowl');
      expect(restored.mealCompletions.length).toBe(1);
      expect(restored.mealCompletions[0].mealId).toBe('meal_1');
      expect(restored.macroSummary?.totalCalories).toBe(2450);
      expect(restored.hydrationSummary?.loggedMl).toBe(3800);
      expect(restored.feedback?.rating).toBe(5);
    });
  });
});
