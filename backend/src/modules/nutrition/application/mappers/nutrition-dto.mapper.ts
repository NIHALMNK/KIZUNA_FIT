import { NutritionPlan } from '../../domain/aggregates/nutrition-plan.aggregate';
import { NutritionCompletion } from '../../domain/aggregates/nutrition-completion.aggregate';
import {
  NutritionPlanResponseDto,
  NutritionDayResponseDto,
  MealResponseDto,
  FoodEntryResponseDto,
} from '../dtos/nutrition-plan.dto';
import {
  NutritionCompletionResponseDto,
  NutritionDaySnapshotResponseDto,
  MealCompletionRecordResponseDto,
} from '../dtos/nutrition-completion.dto';

export class NutritionDtoMapper {
  public static toNutritionPlanResponseDto(entity: NutritionPlan): NutritionPlanResponseDto {
    const nutritionDays: NutritionDayResponseDto[] = entity.nutritionDays.map((d) => {
      const meals: MealResponseDto[] = d.meals.map((m) => {
        const foodEntries: FoodEntryResponseDto[] = m.foodEntries.map((fe) => ({
          id: fe.id ?? null,
          name: fe.name,
          quantity: fe.quantity,
          unit: fe.unit,
          calories: fe.calories ?? null,
          protein: fe.protein ?? null,
          carbohydrates: fe.carbohydrates ?? null,
          fats: fe.fats ?? null,
          notes: fe.notes ?? null,
          alternatives: (fe.alternatives || []).map((alt) => ({
            id: alt.id,
            name: alt.name,
            quantity: alt.quantity,
            unit: alt.unit,
            calories: alt.calories ?? null,
            protein: alt.protein ?? null,
            carbohydrates: alt.carbohydrates ?? null,
            fats: alt.fats ?? null,
            notes: alt.notes ?? null,
          })),
        }));

        return {
          id: m.id,
          mealType: m.mealType,
          name: m.name,
          timeOfDay: m.timeOfDay ?? null,
          targetCalories: m.targetCalories ?? null,
          targetMacros: m.targetMacros ? m.targetMacros.toPrimitives() : null,
          foodEntries,
          notes: m.notes ?? null,
        };
      });

      return {
        id: d.id,
        weekday: d.weekday,
        dayNumber: d.dayNumber,
        name: d.name ?? null,
        targetCalories: d.targetCalories ?? null,
        dailyMacroTargets: d.dailyMacroTargets ? d.dailyMacroTargets.toPrimitives() : null,
        hydrationGoal: d.hydrationGoal ? d.hydrationGoal.toPrimitives() : null,
        meals,
        notes: d.notes ?? null,
      };
    });

    return {
      id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      trainerId: entity.trainerId,
      clientId: entity.clientId,
      version: entity.version,
      title: entity.title,
      description: entity.description ?? null,
      durationWeeks: entity.durationWeeks,
      nutritionDays,
      status: entity.status,
      activatedAt: entity.activatedAt ? entity.activatedAt.toISOString() : null,
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null,
      submittedAt: entity.submittedAt ? entity.submittedAt.toISOString() : null,
      acceptedAt: entity.acceptedAt ? entity.acceptedAt.toISOString() : null,
      reviewedAt: entity.reviewedAt ? entity.reviewedAt.toISOString() : null,
      rejectionReason: entity.rejectionReason ?? null,
      deletionRequestedAt: entity.deletionRequestedAt
        ? entity.deletionRequestedAt.toISOString()
        : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  public static toNutritionCompletionResponseDto(
    entity: NutritionCompletion,
  ): NutritionCompletionResponseDto {
    const snapshotPrims = entity.nutritionDaySnapshot.toPrimitives();
    const snapshotDto: NutritionDaySnapshotResponseDto = {
      weekday: snapshotPrims.weekday,
      dayNumber: snapshotPrims.dayNumber,
      name: snapshotPrims.name ?? null,
      targetCalories: snapshotPrims.targetCalories ?? null,
      dailyMacroTargets: snapshotPrims.dailyMacroTargets ?? null,
      hydrationGoal: snapshotPrims.hydrationGoal ?? null,
      meals: snapshotPrims.meals.map((m) => ({
        mealId: m.mealId,
        mealType: m.mealType,
        name: m.name,
        timeOfDay: m.timeOfDay ?? null,
        targetCalories: m.targetCalories ?? null,
        targetMacros: m.targetMacros ?? null,
        foodEntries: m.foodEntries.map((fe) => ({
          id: fe.id ?? null,
          name: fe.name,
          quantity: fe.quantity,
          unit: fe.unit,
          calories: fe.calories ?? null,
          protein: fe.protein ?? null,
          carbohydrates: fe.carbohydrates ?? null,
          fats: fe.fats ?? null,
          notes: fe.notes ?? null,
          alternatives: (fe.alternatives || []).map((alt) => ({
            id: alt.id,
            name: alt.name,
            quantity: alt.quantity,
            unit: alt.unit,
            calories: alt.calories ?? null,
            protein: alt.protein ?? null,
            carbohydrates: alt.carbohydrates ?? null,
            fats: alt.fats ?? null,
            notes: alt.notes ?? null,
          })),
        })),
        notes: m.notes ?? null,
      })),
      notes: snapshotPrims.notes ?? null,
    };

    const mealCompletions: MealCompletionRecordResponseDto[] = entity.mealCompletions.map((mc) => {
      const firstAlt = mc.consumedItems.find((ci) => ci.consumedType === 'ALTERNATIVE');
      const selectedAlternative = firstAlt
        ? {
            prescribedFoodId: firstAlt.prescribedFoodId ?? null,
            prescribedFoodName: firstAlt.prescribedFoodName,
            alternativeId: firstAlt.consumedFoodId ?? null,
            alternativeName: firstAlt.consumedFoodName,
            quantity: firstAlt.quantity,
            unit: firstAlt.unit,
            calories: firstAlt.calories ?? null,
            protein: firstAlt.protein ?? null,
            carbohydrates: firstAlt.carbohydrates ?? null,
            fats: firstAlt.fats ?? null,
          }
        : null;

      return {
        mealId: mc.mealId,
        mealType: mc.mealType,
        name: mc.name,
        isCompleted: mc.isCompleted,
        state: mc.state,
        consumedItems: mc.consumedItems.map((ci) => ({
          prescribedFoodId: ci.prescribedFoodId ?? null,
          prescribedFoodName: ci.prescribedFoodName,
          consumedType: ci.consumedType,
          consumedFoodId: ci.consumedFoodId ?? null,
          consumedFoodName: ci.consumedFoodName,
          quantity: ci.quantity,
          unit: ci.unit,
          calories: ci.calories ?? null,
          protein: ci.protein ?? null,
          carbohydrates: ci.carbohydrates ?? null,
          fats: ci.fats ?? null,
        })),
        consumedMacros: mc.consumedMacros ? mc.consumedMacros.toPrimitives() : null,
        consumedCalories: mc.consumedCalories ?? null,
        timeConsumed: mc.timeConsumed ? mc.timeConsumed.toISOString() : null,
        notes: mc.notes ?? null,
        selectedAlternative,
      };
    });

    return {
      id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      nutritionPlanId: entity.nutritionPlanId,
      clientId: entity.clientId,
      trainerId: entity.trainerId,
      completionDate: entity.completionDate.toISOString().split('T')[0],
      weekday: entity.weekday,
      dayNumber: entity.dayNumber,
      weekNumber: entity.weekNumber,
      nutritionDaySnapshot: snapshotDto,
      mealCompletions,
      macroSummary: entity.macroSummary ? entity.macroSummary.toPrimitives() : null,
      hydrationSummary: entity.hydrationSummary ? entity.hydrationSummary.toPrimitives() : null,
      feedback: entity.feedback ? entity.feedback.toPrimitives() : null,
      status: entity.status,
      startedAt: entity.startedAt.toISOString(),
      completedAt: entity.completedAt ? entity.completedAt.toISOString() : null,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
