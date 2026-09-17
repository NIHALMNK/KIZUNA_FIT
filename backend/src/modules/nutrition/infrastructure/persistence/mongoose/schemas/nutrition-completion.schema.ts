import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  Weekday,
} from '../../../../domain/enums';
import {
  FoodEntrySchema,
  IFoodEntryDocument,
  IMacroNutrientsDocument,
  IHydrationGoalDocument,
  MacroNutrientsSchema,
  HydrationGoalSchema,
} from './nutrition-plan.schema';

export interface IPrescribedMealSnapshotDocument {
  mealId: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: IMacroNutrientsDocument | null;
  foodEntries: IFoodEntryDocument[];
  notes?: string | null;
}

export interface INutritionDaySnapshotDocument {
  weekday?: string | null;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: IMacroNutrientsDocument | null;
  hydrationGoal?: IHydrationGoalDocument | null;
  meals: IPrescribedMealSnapshotDocument[];
  notes?: string | null;
}

export interface IConsumedFoodItemDocument {
  prescribedFoodId?: string | null;
  prescribedFoodName: string;
  consumedType: string;
  consumedFoodId?: string | null;
  consumedFoodName: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export interface IMealCompletionRecordDocument {
  mealId: string;
  mealType: MealType;
  name: string;
  isCompleted: boolean;
  state: MealCompletionStatus;
  consumedItems: IConsumedFoodItemDocument[];
  consumedMacros?: IMacroNutrientsDocument | null;
  consumedCalories?: number | null;
  timeConsumed?: Date | null;
  notes?: string | null;
}

export interface IDailyMacroSummaryDocument {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface IHydrationSummaryDocument {
  loggedMl: number;
  targetMl?: number | null;
}

export interface INutritionFeedbackDocument {
  rating?: number | null;
  energyLevel?: number | null;
  digestionNotes?: string | null;
  notes?: string | null;
  adherenceConfidence?: number | null;
}

export interface INutritionCompletionDocument extends Document<string> {
  _id: string;
  coachingRelationshipId: string;
  nutritionPlanId: string;
  clientId: string;
  trainerId: string;
  completionDate: Date;
  weekday: Weekday;
  dayNumber: number;
  weekNumber: number;
  nutritionDaySnapshot: INutritionDaySnapshotDocument;
  mealCompletions: IMealCompletionRecordDocument[];
  macroSummary?: IDailyMacroSummaryDocument | null;
  hydrationSummary?: IHydrationSummaryDocument | null;
  feedback?: INutritionFeedbackDocument | null;
  status: NutritionCompletionStatus;
  startedAt: Date;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const ConsumedFoodItemSchema = new Schema<IConsumedFoodItemDocument>(
  {
    prescribedFoodId: { type: String, default: null },
    prescribedFoodName: { type: String, required: true, trim: true },
    consumedType: { type: String, required: true, enum: ['PRESCRIBED', 'ALTERNATIVE'] },
    consumedFoodId: { type: String, default: null },
    consumedFoodName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    calories: { type: Number, default: null, min: 0 },
    protein: { type: Number, default: null, min: 0 },
    carbohydrates: { type: Number, default: null, min: 0 },
    fats: { type: Number, default: null, min: 0 },
  },
  { _id: false },
);

export const PrescribedMealSnapshotSchema = new Schema<IPrescribedMealSnapshotDocument>(
  {
    mealId: { type: String, required: true },
    mealType: {
      type: String,
      enum: Object.values(MealType),
      required: true,
    },
    name: { type: String, required: true },
    timeOfDay: { type: String, default: null },
    targetCalories: { type: Number, default: null },
    targetMacros: { type: MacroNutrientsSchema, default: null },
    foodEntries: { type: [FoodEntrySchema], default: [] },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const NutritionDaySnapshotSchema = new Schema<INutritionDaySnapshotDocument>(
  {
    weekday: {
      type: String,
      enum: Object.values(Weekday),
      default: null,
    },
    dayNumber: { type: Number, required: true, min: 1 },
    name: { type: String, default: null },
    targetCalories: { type: Number, default: null },
    dailyMacroTargets: { type: MacroNutrientsSchema, default: null },
    hydrationGoal: { type: HydrationGoalSchema, default: null },
    meals: { type: [PrescribedMealSnapshotSchema], default: [] },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const MealCompletionRecordSchema = new Schema<IMealCompletionRecordDocument>(
  {
    mealId: { type: String, required: true },
    mealType: {
      type: String,
      enum: Object.values(MealType),
      required: true,
    },
    name: { type: String, required: true },
    isCompleted: { type: Boolean, required: true, default: false },
    state: {
      type: String,
      enum: Object.values(MealCompletionStatus),
      default: MealCompletionStatus.NOT_TRACKED,
      required: true,
    },
    consumedItems: { type: [ConsumedFoodItemSchema], default: [] },
    consumedMacros: { type: MacroNutrientsSchema, default: null },
    consumedCalories: { type: Number, default: null },
    timeConsumed: { type: Date, default: null },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const DailyMacroSummarySchema = new Schema<IDailyMacroSummaryDocument>(
  {
    totalCalories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const HydrationSummarySchema = new Schema<IHydrationSummaryDocument>(
  {
    loggedMl: { type: Number, required: true, min: 0 },
    targetMl: { type: Number, default: null, min: 0 },
  },
  { _id: false },
);

export const NutritionFeedbackSchema = new Schema<INutritionFeedbackDocument>(
  {
    rating: { type: Number, min: 1, max: 5, default: null },
    energyLevel: { type: Number, min: 1, max: 5, default: null },
    digestionNotes: { type: String, default: null },
    notes: { type: String, default: null },
    adherenceConfidence: { type: Number, min: 1, max: 5, default: null },
  },
  { _id: false },
);

export const NutritionCompletionSchema = new Schema<INutritionCompletionDocument>(
  {
    _id: { type: String, required: true },
    coachingRelationshipId: { type: String, required: true, index: true },
    nutritionPlanId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    completionDate: { type: Date, required: true, index: true },
    weekday: {
      type: String,
      enum: Object.values(Weekday),
      required: true,
      index: true,
    },
    dayNumber: { type: Number, required: true, index: true },
    weekNumber: { type: Number, required: true, default: 1, min: 1 },
    nutritionDaySnapshot: { type: NutritionDaySnapshotSchema, required: true },
    mealCompletions: { type: [MealCompletionRecordSchema], default: [] },
    macroSummary: { type: DailyMacroSummarySchema, default: null },
    hydrationSummary: { type: HydrationSummarySchema, default: null },
    feedback: { type: NutritionFeedbackSchema, default: null },
    status: {
      type: String,
      enum: Object.values(NutritionCompletionStatus),
      default: NutritionCompletionStatus.IN_PROGRESS,
      required: true,
      index: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'nutritionCompletions',
    timestamps: true,
  },
);

// Indexes
// Unique index: one completion record per plan, client, and calendar date
NutritionCompletionSchema.index(
  { nutritionPlanId: 1, clientId: 1, completionDate: 1 },
  { unique: true, name: 'uniq_plan_client_date_nutrition_completion' },
);

NutritionCompletionSchema.index({ clientId: 1, completedAt: -1 });
NutritionCompletionSchema.index({ coachingRelationshipId: 1, completedAt: -1 });
NutritionCompletionSchema.index({ clientId: 1, nutritionPlanId: 1, completionDate: 1 });
NutritionCompletionSchema.index({ clientId: 1, nutritionPlanId: 1, dayNumber: 1, status: 1 });

export const NutritionCompletionModel: Model<INutritionCompletionDocument> =
  mongoose.models.NutritionCompletion ||
  mongoose.model<INutritionCompletionDocument>('NutritionCompletion', NutritionCompletionSchema);
