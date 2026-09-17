import mongoose, { Schema, Document, Model } from 'mongoose';
import { MealType, NutritionPlanStatus, Weekday } from '../../../../domain/enums';

export interface IFoodAlternativeDocument {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
}

export interface IFoodEntryDocument {
  id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
  alternatives?: IFoodAlternativeDocument[];
}

export interface IMacroNutrientsDocument {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface IHydrationGoalDocument {
  targetMl: number;
  notes?: string | null;
}

export interface IMealDocument {
  id: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: IMacroNutrientsDocument | null;
  foodEntries: IFoodEntryDocument[];
  notes?: string | null;
}

export interface INutritionDayDocument {
  id: string;
  weekday?: string | null;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: IMacroNutrientsDocument | null;
  hydrationGoal?: IHydrationGoalDocument | null;
  meals: IMealDocument[];
  notes?: string | null;
}

export interface INutritionPlanDocument extends Document<string> {
  _id: string;
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  durationWeeks: number;
  nutritionDays: INutritionDayDocument[];
  status: NutritionPlanStatus;
  activatedAt?: Date | null;
  completedAt?: Date | null;
  submittedAt?: Date | null;
  acceptedAt?: Date | null;
  reviewedAt?: Date | null;
  rejectionReason?: string | null;
  deletionRequestedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export const FoodAlternativeSchema = new Schema<IFoodAlternativeDocument>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    calories: { type: Number, default: null, min: 0 },
    protein: { type: Number, default: null, min: 0 },
    carbohydrates: { type: Number, default: null, min: 0 },
    fats: { type: Number, default: null, min: 0 },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const FoodEntrySchema = new Schema<IFoodEntryDocument>(
  {
    id: { type: String, default: null },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    calories: { type: Number, default: null, min: 0 },
    protein: { type: Number, default: null, min: 0 },
    carbohydrates: { type: Number, default: null, min: 0 },
    fats: { type: Number, default: null, min: 0 },
    notes: { type: String, default: null },
    alternatives: { type: [FoodAlternativeSchema], default: [] },
  },
  { _id: false },
);

export const MacroNutrientsSchema = new Schema<IMacroNutrientsDocument>(
  {
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const HydrationGoalSchema = new Schema<IHydrationGoalDocument>(
  {
    targetMl: { type: Number, required: true, min: 1 },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const MealSchema = new Schema<IMealDocument>(
  {
    id: { type: String, required: true },
    mealType: {
      type: String,
      enum: Object.values(MealType),
      required: true,
    },
    name: { type: String, required: true, trim: true },
    timeOfDay: { type: String, default: null },
    targetCalories: { type: Number, default: null, min: 0 },
    targetMacros: { type: MacroNutrientsSchema, default: null },
    foodEntries: { type: [FoodEntrySchema], default: [] },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const NutritionDaySchema = new Schema<INutritionDayDocument>(
  {
    id: { type: String, required: true },
    weekday: {
      type: String,
      enum: Object.values(Weekday),
      default: null,
    },
    dayNumber: { type: Number, required: true, min: 1 },
    name: { type: String, default: null },
    targetCalories: { type: Number, default: null, min: 0 },
    dailyMacroTargets: { type: MacroNutrientsSchema, default: null },
    hydrationGoal: { type: HydrationGoalSchema, default: null },
    meals: { type: [MealSchema], default: [] },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const NutritionPlanSchema = new Schema<INutritionPlanDocument>(
  {
    _id: { type: String, required: true },
    coachingRelationshipId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    version: { type: Number, required: true, default: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    durationWeeks: {
      type: Number,
      required: true,
      min: 1,
      max: 52,
    },
    nutritionDays: { type: [NutritionDaySchema], default: [] },
    status: {
      type: String,
      enum: Object.values(NutritionPlanStatus),
      default: NutritionPlanStatus.DRAFT,
      required: true,
      index: true,
    },
    activatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    submittedAt: { type: Date, default: null },
    acceptedAt: { type: Date, default: null },
    reviewedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: null },
    deletionRequestedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'nutritionPlans',
    timestamps: true,
  },
);

// Indexes
// 1. One version number per coaching relationship
NutritionPlanSchema.index({ coachingRelationshipId: 1, version: 1 }, { unique: true });

// 2. Partial unique index: at most one ACTIVE plan per coaching relationship
NutritionPlanSchema.index(
  { coachingRelationshipId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: NutritionPlanStatus.ACTIVE },
    name: 'uniq_active_nutrition_plan_per_relationship',
  },
);

// 3. Partial unique index: at most one PENDING_APPROVAL plan per coaching relationship
NutritionPlanSchema.index(
  { coachingRelationshipId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: NutritionPlanStatus.PENDING_APPROVAL },
    name: 'uniq_pending_nutrition_plan_per_relationship',
  },
);

NutritionPlanSchema.index({ clientId: 1, status: 1 });
NutritionPlanSchema.index({ trainerId: 1, status: 1 });

export const NutritionPlanModel: Model<INutritionPlanDocument> =
  mongoose.models.NutritionPlan ||
  mongoose.model<INutritionPlanDocument>('NutritionPlan', NutritionPlanSchema);
