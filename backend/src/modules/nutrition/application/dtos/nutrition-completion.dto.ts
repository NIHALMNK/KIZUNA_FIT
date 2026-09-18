import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
  Weekday,
} from '../../domain/enums';
import {
  FoodEntryResponseDto,
  HydrationGoalResponseDto,
  MacroNutrientsInputDto,
  MacroNutrientsResponseDto,
} from './nutrition-plan.dto';

export interface StartNutritionCompletionDto {
  nutritionPlanId?: string;
  weekday?: Weekday;
  dayNumber?: number;
  completionDate?: string | Date;
  clientTimezone?: string;
}

export interface ConsumedFoodItemInputDto {
  prescribedFoodId?: string | null;
  prescribedFoodName: string;
  consumedType: 'PRESCRIBED' | 'ALTERNATIVE';
  consumedFoodId?: string | null;
  consumedFoodName: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export interface MealCompletionRecordInputDto {
  mealId: string;
  mealType: MealType;
  name: string;
  isCompleted?: boolean;
  state?: MealCompletionStatus;
  consumedItems?: ConsumedFoodItemInputDto[];
  consumedMacros?: MacroNutrientsInputDto | null;
  consumedCalories?: number | null;
  timeConsumed?: string | Date | null;
  notes?: string | null;
  selectedAlternative?: any;
}

export interface DailyMacroSummaryInputDto {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface HydrationSummaryInputDto {
  loggedMl: number;
  targetMl?: number | null;
}

export interface NutritionFeedbackInputDto {
  rating?: number | null;
  energyLevel?: number | null;
  digestionNotes?: string | null;
  notes?: string | null;
  adherenceConfidence?: number | null;
}

export interface UpdateNutritionCompletionDto {
  mealCompletions?: MealCompletionRecordInputDto[];
  macroSummary?: DailyMacroSummaryInputDto | null;
  hydrationSummary?: HydrationSummaryInputDto | null;
  feedback?: NutritionFeedbackInputDto | null;
  clientToday?: string | Date;
}

export interface CompleteNutritionCompletionDto {
  mealCompletions?: MealCompletionRecordInputDto[];
  macroSummary?: DailyMacroSummaryInputDto | null;
  hydrationSummary?: HydrationSummaryInputDto | null;
  feedback?: NutritionFeedbackInputDto | null;
  clientToday?: string | Date;
}

// Response DTOs
export interface PrescribedMealSnapshotResponseDto {
  mealId: string;
  mealType: MealType;
  name: string;
  timeOfDay?: string | null;
  targetCalories?: number | null;
  targetMacros?: MacroNutrientsResponseDto | null;
  foodEntries: FoodEntryResponseDto[];
  notes?: string | null;
}

export interface NutritionDaySnapshotResponseDto {
  weekday: Weekday;
  dayNumber: number;
  name?: string | null;
  targetCalories?: number | null;
  dailyMacroTargets?: MacroNutrientsResponseDto | null;
  hydrationGoal?: HydrationGoalResponseDto | null;
  meals: PrescribedMealSnapshotResponseDto[];
  notes?: string | null;
}

export interface ConsumedFoodItemResponseDto {
  prescribedFoodId?: string | null;
  prescribedFoodName: string;
  consumedType: 'PRESCRIBED' | 'ALTERNATIVE';
  consumedFoodId?: string | null;
  consumedFoodName: string;
  quantity: number;
  unit: string;
  calories?: number | null;
  protein?: number | null;
  carbohydrates?: number | null;
  fats?: number | null;
}

export interface MealCompletionRecordResponseDto {
  mealId: string;
  mealType: MealType;
  name: string;
  isCompleted: boolean;
  state: MealCompletionStatus;
  consumedItems: ConsumedFoodItemResponseDto[];
  consumedMacros?: MacroNutrientsResponseDto | null;
  consumedCalories?: number | null;
  timeConsumed?: string | null;
  notes?: string | null;
  selectedAlternative?: any;
}

export interface DailyMacroSummaryResponseDto {
  totalCalories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
}

export interface HydrationSummaryResponseDto {
  loggedMl: number;
  targetMl?: number | null;
}

export interface NutritionFeedbackResponseDto {
  rating?: number | null;
  energyLevel?: number | null;
  digestionNotes?: string | null;
  notes?: string | null;
  adherenceConfidence?: number | null;
}

export interface NutritionCompletionResponseDto {
  id: string;
  coachingRelationshipId: string;
  nutritionPlanId: string;
  clientId: string;
  trainerId: string;
  completionDate: string;
  weekday: Weekday;
  dayNumber: number;
  weekNumber: number;
  nutritionDaySnapshot: NutritionDaySnapshotResponseDto;
  mealCompletions: MealCompletionRecordResponseDto[];
  macroSummary?: DailyMacroSummaryResponseDto | null;
  hydrationSummary?: HydrationSummaryResponseDto | null;
  feedback?: NutritionFeedbackResponseDto | null;
  status: NutritionCompletionStatus;
  startedAt: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
