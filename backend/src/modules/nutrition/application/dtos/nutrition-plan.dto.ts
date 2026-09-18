import { MealType, NutritionPlanStatus, Weekday } from '../../domain/enums';

export interface FoodAlternativeInputDto {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
}

export interface FoodEntryInputDto {
  id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
  alternatives?: FoodAlternativeInputDto[];
}

export interface MacroNutrientsInputDto {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface HydrationGoalInputDto {
  targetMl: number;
  notes?: string | null;
}

export interface MealInputDto {
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrientsInputDto | null;
  foodEntries?: FoodEntryInputDto[];
  notes?: string | null;
}

export interface NutritionDayInputDto {
  weekday?: Weekday;
  dayNumber?: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsInputDto | null;
  hydrationGoal?: HydrationGoalInputDto | null;
  meals: MealInputDto[];
  notes?: string | null;
}

export interface CreateNutritionPlanDto {
  coachingRelationshipId: string;
  title: string;
  description?: string | null;
  durationWeeks: number;
  nutritionDays: NutritionDayInputDto[];
}

export interface UpdateNutritionPlanDto {
  title?: string;
  description?: string | null;
  durationWeeks?: number;
  nutritionDays?: NutritionDayInputDto[];
}

export interface CreateNutritionPlanVersionDto {
  planId: string;
  title?: string;
  description?: string | null;
  durationWeeks?: number;
  nutritionDays?: NutritionDayInputDto[];
}

// Response DTOs
export interface FoodAlternativeResponseDto {
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

export interface FoodEntryResponseDto {
  id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
  notes?: string | null;
  alternatives?: FoodAlternativeResponseDto[];
}

export interface MacroNutrientsResponseDto {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface HydrationGoalResponseDto {
  targetMl: number;
  notes?: string | null;
}

export interface MealResponseDto {
  id: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrientsResponseDto | null;
  foodEntries: FoodEntryResponseDto[];
  notes?: string | null;
}

export interface NutritionDayResponseDto {
  id: string;
  weekday: Weekday;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsResponseDto | null;
  hydrationGoal?: HydrationGoalResponseDto | null;
  meals: MealResponseDto[];
  notes?: string | null;
}

export interface RejectNutritionPlanDto {
  reason?: string;
}

export interface NutritionPlanResponseDto {
  id: string;
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  durationWeeks: number;
  nutritionDays: NutritionDayResponseDto[];
  status: NutritionPlanStatus;
  activatedAt?: string | null;
  completedAt?: string | null;
  submittedAt?: string | null;
  acceptedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  deletionRequestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
