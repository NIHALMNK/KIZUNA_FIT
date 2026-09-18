/**
 * KIZUNAFIT - Nutrition Domain Types & Contracts
 * Authoritative frontend domain definitions matching the approved backend API contracts.
 */

export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export enum NutritionPlanStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  DELETION_PENDING = 'DELETION_PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum NutritionCompletionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACK = 'SNACK',
  CUSTOM = 'CUSTOM',
}

export enum MealCompletionStatus {
  NOT_TRACKED = 'NOT_TRACKED',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED',
}

// -------------------------------------------------------------
// Prescription Sub-models & Value Objects
// -------------------------------------------------------------

export interface FoodAlternative {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly unit: string;
  readonly calories?: number | null;
  readonly protein?: number | null;
  readonly carbohydrates?: number | null;
  readonly fats?: number | null;
  readonly notes?: string | null;
}

export interface FoodEntry {
  readonly id?: string | null;
  readonly name: string;
  readonly quantity: number;
  readonly unit: string;
  readonly calories?: number | null;
  readonly protein?: number | null;
  readonly carbohydrates?: number | null;
  readonly fats?: number | null;
  readonly notes?: string | null;
  readonly alternatives?: FoodAlternative[];
}

export interface MacroNutrients {
  readonly calories: number;
  readonly protein: number;
  readonly carbohydrates: number;
  readonly fats: number;
}

export interface HydrationGoal {
  readonly targetMl: number;
  readonly notes?: string | null;
}

export interface Meal {
  readonly id: string;
  readonly mealType: MealType;
  readonly name: string;
  readonly timeOfDay?: string | null;
  readonly targetCalories?: number | null;
  readonly targetMacros?: MacroNutrients | null;
  readonly foodEntries: FoodEntry[];
  readonly notes?: string | null;
}

export interface NutritionDay {
  readonly id: string;
  readonly weekday: Weekday;
  readonly dayNumber?: number;
  readonly name?: string | null;
  readonly targetCalories?: number | null;
  readonly dailyMacroTargets?: MacroNutrients | null;
  readonly hydrationGoal?: HydrationGoal | null;
  readonly meals: Meal[];
  readonly notes?: string | null;
}

// -------------------------------------------------------------
// Nutrition Plan Aggregate
// -------------------------------------------------------------

export interface NutritionPlan {
  readonly id: string;
  readonly coachingRelationshipId: string;
  readonly trainerId: string;
  readonly clientId: string;
  readonly version: number;
  readonly title: string;
  readonly description?: string | null;
  readonly durationWeeks: number;
  readonly nutritionDays: NutritionDay[];
  readonly status: NutritionPlanStatus;
  readonly activatedAt?: string | null;
  readonly completedAt?: string | null;
  readonly submittedAt?: string | null;
  readonly acceptedAt?: string | null;
  readonly reviewedAt?: string | null;
  readonly rejectionReason?: string | null;
  readonly deletionRequestedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// -------------------------------------------------------------
// Daily Execution & Completion Snapshot Sub-models
// -------------------------------------------------------------

export interface PrescribedMealSnapshot {
  readonly mealId: string;
  readonly mealType: MealType;
  readonly name: string;
  readonly timeOfDay?: string | null;
  readonly targetCalories?: number | null;
  readonly targetMacros?: MacroNutrients | null;
  readonly foodEntries: FoodEntry[];
  readonly notes?: string | null;
}

export interface NutritionDaySnapshot {
  readonly weekday: Weekday;
  readonly dayNumber?: number;
  readonly name?: string | null;
  readonly targetCalories?: number | null;
  readonly dailyMacroTargets?: MacroNutrients | null;
  readonly hydrationGoal?: HydrationGoal | null;
  readonly meals: PrescribedMealSnapshot[];
  readonly notes?: string | null;
}

export interface SelectedAlternative {
  readonly prescribedFoodId?: string | null;
  readonly prescribedFoodName: string;
  readonly alternativeId?: string | null;
  readonly alternativeName: string;
  readonly quantity: number;
  readonly unit: string;
  readonly calories?: number | null;
  readonly protein?: number | null;
  readonly carbohydrates?: number | null;
  readonly fats?: number | null;
}

export interface ConsumedFoodItem {
  readonly prescribedFoodId: string;
  readonly prescribedFoodName: string;
  readonly consumedType: 'PRESCRIBED' | 'ALTERNATIVE';
  readonly consumedFoodId: string;
  readonly consumedFoodName: string;
  readonly quantity: number;
  readonly unit: string;
  readonly calories?: number | null;
  readonly protein?: number | null;
  readonly carbohydrates?: number | null;
  readonly fats?: number | null;
}

export interface MealCompletionRecord {
  readonly mealId: string;
  readonly mealType: MealType;
  readonly name: string;
  readonly isCompleted: boolean;
  readonly state: MealCompletionStatus;
  readonly consumedItems: ConsumedFoodItem[];
  readonly consumedMacros?: MacroNutrients | null;
  readonly consumedCalories?: number | null;
  readonly timeConsumed?: string | null;
  readonly notes?: string | null;
  readonly selectedAlternative?: SelectedAlternative | null;
}

export interface DailyMacroSummary {
  readonly totalCalories: number;
  readonly protein: number;
  readonly carbohydrates: number;
  readonly fats: number;
}

export interface HydrationSummary {
  readonly loggedMl: number;
  readonly targetMl?: number | null;
}

export interface NutritionFeedback {
  readonly rating?: number | null;
  readonly energyLevel?: number | null;
  readonly digestionNotes?: string | null;
  readonly notes?: string | null;
  readonly adherenceConfidence?: number | null;
}

// -------------------------------------------------------------
// Nutrition Completion Aggregate
// -------------------------------------------------------------

export interface NutritionCompletion {
  readonly id: string;
  readonly coachingRelationshipId: string;
  readonly nutritionPlanId: string;
  readonly clientId: string;
  readonly trainerId: string;
  readonly completionDate: string;
  readonly weekday: Weekday;
  readonly dayNumber?: number;
  readonly weekNumber?: number;
  readonly nutritionDaySnapshot: NutritionDaySnapshot;
  readonly mealCompletions: MealCompletionRecord[];
  readonly macroSummary?: DailyMacroSummary | null;
  readonly hydrationSummary?: HydrationSummary | null;
  readonly feedback?: NutritionFeedback | null;
  readonly status: NutritionCompletionStatus;
  readonly startedAt: string;
  readonly completedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// -------------------------------------------------------------
// DTOs & Request / Filter Types
// -------------------------------------------------------------

export interface MealInputDTO {
  readonly mealType: MealType;
  readonly name: string;
  readonly timeOfDay?: string | null;
  readonly targetCalories?: number | null;
  readonly targetMacros?: MacroNutrients | null;
  readonly foodEntries?: FoodEntry[];
  readonly notes?: string | null;
}

export interface NutritionDayInputDTO {
  readonly weekday: Weekday;
  readonly dayNumber?: number;
  readonly name?: string | null;
  readonly targetCalories?: number | null;
  readonly dailyMacroTargets?: MacroNutrients | null;
  readonly hydrationGoal?: HydrationGoal | null;
  readonly meals: MealInputDTO[];
  readonly notes?: string | null;
}

export interface CreateNutritionPlanDTO {
  readonly coachingRelationshipId: string;
  readonly title: string;
  readonly description?: string | null;
  readonly durationWeeks: number;
  readonly nutritionDays: NutritionDayInputDTO[];
}

export interface UpdateNutritionPlanDTO {
  readonly title?: string;
  readonly description?: string | null;
  readonly durationWeeks?: number;
  readonly nutritionDays?: NutritionDayInputDTO[];
}

export interface CreateNutritionPlanVersionDTO {
  readonly title?: string;
  readonly description?: string | null;
  readonly durationWeeks?: number;
  readonly nutritionDays?: NutritionDayInputDTO[];
}

export interface StartNutritionCompletionDTO {
  readonly nutritionPlanId?: string;
  readonly completionDate?: string;
  readonly weekday?: Weekday;
  readonly dayNumber?: number;
}

export interface UpdateNutritionCompletionDTO {
  readonly mealCompletions?: MealCompletionRecord[];
  readonly macroSummary?: DailyMacroSummary | null;
  readonly hydrationSummary?: HydrationSummary | null;
  readonly feedback?: NutritionFeedback | null;
  readonly clientToday?: string | Date;
}

export interface CompleteNutritionCompletionDTO {
  readonly mealCompletions?: MealCompletionRecord[];
  readonly macroSummary?: DailyMacroSummary | null;
  readonly hydrationSummary?: HydrationSummary | null;
  readonly feedback?: NutritionFeedback | null;
  readonly clientToday?: string | Date;
}

export interface NutritionPlanFilterParams {
  readonly coachingRelationshipId?: string;
  readonly trainerId?: string;
  readonly clientId?: string;
  readonly status?: NutritionPlanStatus;
  readonly limit?: number;
  readonly skip?: number;
}

export interface NutritionCompletionFilterParams {
  readonly coachingRelationshipId?: string;
  readonly nutritionPlanId?: string;
  readonly clientId?: string;
  readonly trainerId?: string;
  readonly date?: string;
  readonly weekday?: Weekday;
  readonly dayNumber?: number;
  readonly status?: NutritionCompletionStatus;
  readonly limit?: number;
  readonly skip?: number;
}
