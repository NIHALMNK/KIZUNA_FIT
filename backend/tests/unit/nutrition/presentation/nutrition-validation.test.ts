import { describe, it, expect } from 'vitest';
import {
  CreateNutritionPlanSchema,
  CreateNutritionPlanVersionSchema,
  StartNutritionCompletionSchema,
  UpdateNutritionCompletionSchema,
  ListNutritionPlansQuerySchema,
  ListNutritionCompletionsQuerySchema,
} from '../../../../src/modules/nutrition/presentation/validation/nutrition.schema';
import { MealType, MealCompletionStatus } from '../../../../src/modules/nutrition/domain/enums';

describe('Nutrition Presentation Validation Schemas Tests', () => {
  describe('CreateNutritionPlanSchema', () => {
    it('should successfully parse valid create plan payload', async () => {
      const validPayload = {
        body: {
          coachingRelationshipId: 'rel_123',
          title: 'Muscle Hypertrophy Plan',
          description: 'High protein nutrition plan',
          durationWeeks: 8,
          nutritionDays: [
            {
              dayNumber: 1,
              name: 'High Carb Day',
              targetCalories: 2600,
              dailyMacroTargets: {
                calories: 2600,
                protein: 200,
                carbohydrates: 300,
                fats: 65,
              },
              hydrationGoal: {
                targetMl: 3500,
              },
              meals: [
                {
                  mealType: MealType.BREAKFAST,
                  name: 'Oats and Whey',
                  foodEntries: [
                    {
                      name: 'Rolled Oats',
                      quantity: 100,
                      unit: 'g',
                      calories: 380,
                      protein: 13,
                      carbohydrates: 68,
                      fats: 7,
                    },
                  ],
                },
              ],
            },
          ],
        },
      };

      const result = await CreateNutritionPlanSchema.parseAsync(validPayload);
      expect(result.body.title).toBe('Muscle Hypertrophy Plan');
      expect(result.body.durationWeeks).toBe(8);
    });

    it('should reject invalid durationWeeks outside 1..52', async () => {
      const invalidPayload = {
        body: {
          coachingRelationshipId: 'rel_123',
          title: 'Invalid Duration Plan',
          durationWeeks: 0,
          nutritionDays: [
            {
              dayNumber: 1,
              meals: [{ mealType: MealType.LUNCH, name: 'Lunch' }],
            },
          ],
        },
      };

      await expect(CreateNutritionPlanSchema.parseAsync(invalidPayload)).rejects.toThrow();
    });

    it('should reject plan with empty nutritionDays array', async () => {
      const invalidPayload = {
        body: {
          coachingRelationshipId: 'rel_123',
          title: 'Empty Days Plan',
          durationWeeks: 4,
          nutritionDays: [],
        },
      };

      await expect(CreateNutritionPlanSchema.parseAsync(invalidPayload)).rejects.toThrow();
    });

    it('should reject invalid mealType enum', async () => {
      const invalidPayload = {
        body: {
          coachingRelationshipId: 'rel_123',
          title: 'Invalid Meal Type',
          durationWeeks: 4,
          nutritionDays: [
            {
              dayNumber: 1,
              meals: [{ mealType: 'MIDNIGHT_FEAST' as any, name: 'Feast' }],
            },
          ],
        },
      };

      await expect(CreateNutritionPlanSchema.parseAsync(invalidPayload)).rejects.toThrow();
    });
  });

  describe('StartNutritionCompletionSchema', () => {
    it('should successfully parse valid start completion payload', async () => {
      const validPayload = {
        body: {
          nutritionPlanId: 'plan_123',
          dayNumber: 1,
        },
      };

      const result = await StartNutritionCompletionSchema.parseAsync(validPayload);
      expect(result.body.nutritionPlanId).toBe('plan_123');
      expect(result.body.dayNumber).toBe(1);
    });

    it('should reject negative or zero dayNumber', async () => {
      const invalidPayload = {
        body: {
          nutritionPlanId: 'plan_123',
          dayNumber: 0,
        },
      };

      await expect(StartNutritionCompletionSchema.parseAsync(invalidPayload)).rejects.toThrow();
    });
  });

  describe('UpdateNutritionCompletionSchema', () => {
    it('should accept valid execution updates', async () => {
      const validPayload = {
        params: { completionId: 'comp_123' },
        body: {
          mealCompletions: [
            {
              mealId: 'm_1',
              mealType: MealType.BREAKFAST,
              name: 'Oats & Berries',
              isCompleted: true,
              state: MealCompletionStatus.COMPLETED,
              consumedCalories: 450,
            },
          ],
          hydrationSummary: {
            loggedMl: 2500,
          },
          feedback: {
            rating: 5,
            energyLevel: 4,
            notes: 'Felt great energy today',
          },
        },
      };

      const result = await UpdateNutritionCompletionSchema.parseAsync(validPayload);
      expect(result.params.completionId).toBe('comp_123');
      expect(result.body.mealCompletions?.[0].isCompleted).toBe(true);
    });

    it('should reject out-of-bounds feedback ratings', async () => {
      const invalidPayload = {
        params: { completionId: 'comp_123' },
        body: {
          feedback: {
            rating: 6, // max is 5
          },
        },
      };

      await expect(UpdateNutritionCompletionSchema.parseAsync(invalidPayload)).rejects.toThrow();
    });
  });
});
