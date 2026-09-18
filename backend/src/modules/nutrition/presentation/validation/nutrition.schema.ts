import { z } from 'zod';
import {
  MealType,
  MealCompletionStatus,
  NutritionPlanStatus,
  NutritionCompletionStatus,
  Weekday,
} from '../../domain/enums';

// -------------------------------------------------------------
// Common / Shared Sub-schemas
// -------------------------------------------------------------

export const MacroNutrientsValidationSchema = z.object({
  calories: z.number().min(0, 'Calories must be non-negative'),
  protein: z.number().min(0, 'Protein must be non-negative'),
  carbohydrates: z.number().min(0, 'Carbohydrates must be non-negative'),
  fats: z.number().min(0, 'Fats must be non-negative'),
});

export const HydrationGoalValidationSchema = z.object({
  targetMl: z.number().min(1, 'Target hydration must be at least 1 ml'),
  notes: z.string().max(500).optional().nullable(),
});

export const FoodAlternativeValidationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Food alternative name is required').max(100),
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required').max(30),
  calories: z.number().min(0).optional().nullable(),
  protein: z.number().min(0).optional().nullable(),
  carbohydrates: z.number().min(0).optional().nullable(),
  fats: z.number().min(0).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const FoodEntryValidationSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1, 'Food entry name is required').max(100),
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required').max(30),
  calories: z.number().min(0).optional().nullable(),
  protein: z.number().min(0).optional().nullable(),
  carbohydrates: z.number().min(0).optional().nullable(),
  fats: z.number().min(0).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  alternatives: z.array(FoodAlternativeValidationSchema).optional().default([]),
});

export const MealValidationSchema = z.object({
  mealType: z.nativeEnum(MealType),
  name: z.string().min(1, 'Meal name is required').max(100),
  timeOfDay: z.string().max(50).optional().nullable(),
  targetCalories: z.number().min(0).optional().nullable(),
  targetMacros: MacroNutrientsValidationSchema.optional().nullable(),
  foodEntries: z.array(FoodEntryValidationSchema).default([]),
  notes: z.string().max(500).optional().nullable(),
});

export const NutritionDayValidationSchema = z.object({
  weekday: z.nativeEnum(Weekday).optional(),
  dayNumber: z.number().int().min(1, 'Day number must be >= 1').optional(),
  name: z.string().max(100).optional().nullable(),
  targetCalories: z.number().min(0).optional().nullable(),
  dailyMacroTargets: MacroNutrientsValidationSchema.optional().nullable(),
  hydrationGoal: HydrationGoalValidationSchema.optional().nullable(),
  meals: z.array(MealValidationSchema).min(1, 'Each day must contain at least one meal'),
  notes: z.string().max(500).optional().nullable(),
});

// -------------------------------------------------------------
// Nutrition Plan Request Schemas
// -------------------------------------------------------------

export const CreateNutritionPlanSchema = z.object({
  body: z.object({
    coachingRelationshipId: z.string().min(1, 'coachingRelationshipId is required'),
    title: z.string().min(1, 'Title is required').max(100),
    description: z.string().max(1000).optional().nullable(),
    durationWeeks: z
      .number()
      .int()
      .min(1, 'Duration must be at least 1 week')
      .max(52, 'Duration cannot exceed 52 weeks'),
    nutritionDays: z
      .array(NutritionDayValidationSchema)
      .min(1, 'Plan must contain at least one day'),
  }),
});

export const UpdateNutritionPlanSchema = z.object({
  params: z.object({
    planId: z.string().min(1, 'planId parameter is required'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100).optional(),
    description: z.string().max(1000).optional().nullable(),
    durationWeeks: z
      .number()
      .int()
      .min(1, 'Duration must be at least 1 week')
      .max(52, 'Duration cannot exceed 52 weeks')
      .optional(),
    nutritionDays: z
      .array(NutritionDayValidationSchema)
      .min(1, 'Plan must contain at least one day')
      .optional(),
  }),
});

export const CreateNutritionPlanVersionSchema = z.object({
  params: z.object({
    planId: z.string().min(1, 'planId parameter is required'),
  }),
  body: z
    .object({
      title: z.string().min(1).max(100).optional(),
      description: z.string().max(1000).optional().nullable(),
      durationWeeks: z.number().int().min(1).max(52).optional(),
      nutritionDays: z.array(NutritionDayValidationSchema).min(1).optional(),
    })
    .optional(),
});

export const PlanIdParamSchema = z.object({
  params: z.object({
    planId: z.string().min(1, 'planId parameter is required'),
  }),
});

export const RejectNutritionPlanSchema = z.object({
  params: z.object({
    planId: z.string().min(1, 'planId parameter is required'),
  }),
  body: z
    .object({
      reason: z.string().max(500).optional(),
    })
    .optional(),
});

export const RelationshipParamSchema = z.object({
  params: z.object({
    relationshipId: z.string().min(1, 'relationshipId parameter is required'),
  }),
});

export const ListNutritionPlansQuerySchema = z.object({
  query: z.object({
    coachingRelationshipId: z.string().optional(),
    trainerId: z.string().optional(),
    clientId: z.string().optional(),
    status: z.nativeEnum(NutritionPlanStatus).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    skip: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});

// -------------------------------------------------------------
// Nutrition Completion Request Schemas
// -------------------------------------------------------------

export const ConsumedFoodItemValidationSchema = z.object({
  prescribedFoodId: z.string().optional().nullable(),
  prescribedFoodName: z.string().min(1, 'Prescribed food name is required'),
  consumedType: z.enum(['PRESCRIBED', 'ALTERNATIVE']),
  consumedFoodId: z.string().optional().nullable(),
  consumedFoodName: z.string().min(1, 'Consumed food name is required'),
  quantity: z.number().min(0, 'Quantity must be non-negative'),
  unit: z.string().min(1, 'Unit is required'),
  calories: z.number().min(0).optional().nullable(),
  protein: z.number().min(0).optional().nullable(),
  carbohydrates: z.number().min(0).optional().nullable(),
  fats: z.number().min(0).optional().nullable(),
});

export const MealCompletionRecordValidationSchema = z.object({
  mealId: z.string().min(1, 'mealId is required'),
  mealType: z.nativeEnum(MealType),
  name: z.string().min(1, 'Meal name is required'),
  isCompleted: z.boolean().optional(),
  state: z.nativeEnum(MealCompletionStatus).optional(),
  consumedItems: z.array(ConsumedFoodItemValidationSchema).optional().default([]),
  consumedMacros: MacroNutrientsValidationSchema.optional().nullable(),
  consumedCalories: z.number().min(0).optional().nullable(),
  timeConsumed: z.string().or(z.date()).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const DailyMacroSummaryValidationSchema = z.object({
  totalCalories: z.number().min(0),
  protein: z.number().min(0),
  carbohydrates: z.number().min(0),
  fats: z.number().min(0),
});

export const HydrationSummaryValidationSchema = z.object({
  loggedMl: z.number().min(0),
  targetMl: z.number().min(0).optional().nullable(),
});

export const NutritionFeedbackValidationSchema = z.object({
  rating: z.number().int().min(1).max(5).optional().nullable(),
  energyLevel: z.number().int().min(1).max(5).optional().nullable(),
  digestionNotes: z.string().max(500).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  adherenceConfidence: z.number().int().min(1).max(5).optional().nullable(),
});

export const StartNutritionCompletionSchema = z.object({
  body: z
    .object({
      nutritionPlanId: z.string().optional(),
      completionDate: z.string().optional(),
      dayNumber: z.number().int().min(1).optional(),
      weekday: z.nativeEnum(Weekday).optional(),
    })
    .optional(),
});

export const UpdateNutritionCompletionSchema = z.object({
  params: z.object({
    completionId: z.string().min(1, 'completionId parameter is required'),
  }),
  body: z.object({
    mealCompletions: z.array(MealCompletionRecordValidationSchema).optional(),
    macroSummary: DailyMacroSummaryValidationSchema.optional().nullable(),
    hydrationSummary: HydrationSummaryValidationSchema.optional().nullable(),
    feedback: NutritionFeedbackValidationSchema.optional().nullable(),
    clientToday: z.string().or(z.date()).optional(),
  }),
});

export const CompleteNutritionCompletionSchema = z.object({
  params: z.object({
    completionId: z.string().min(1, 'completionId parameter is required'),
  }),
  body: z
    .object({
      mealCompletions: z.array(MealCompletionRecordValidationSchema).optional(),
      macroSummary: DailyMacroSummaryValidationSchema.optional().nullable(),
      hydrationSummary: HydrationSummaryValidationSchema.optional().nullable(),
      feedback: NutritionFeedbackValidationSchema.optional().nullable(),
      clientToday: z.string().or(z.date()).optional(),
    })
    .optional(),
});

export const CompletionIdParamSchema = z.object({
  params: z.object({
    completionId: z.string().min(1, 'completionId parameter is required'),
  }),
});

export const ListNutritionCompletionsQuerySchema = z.object({
  query: z.object({
    coachingRelationshipId: z.string().optional(),
    nutritionPlanId: z.string().optional(),
    clientId: z.string().optional(),
    trainerId: z.string().optional(),
    dayNumber: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.nativeEnum(NutritionCompletionStatus).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    skip: z.string().regex(/^\d+$/).transform(Number).optional(),
  }),
});
