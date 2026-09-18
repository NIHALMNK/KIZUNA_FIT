import { NutritionCompletion } from '../../../../domain/aggregates/nutrition-completion.aggregate';
import { NutritionDaySnapshot } from '../../../../domain/value-objects/nutrition-day-snapshot.value-object';
import { MealCompletionRecord } from '../../../../domain/value-objects/meal-completion-record.value-object';
import {
  ConsumedFoodItem,
  ConsumedFoodType,
} from '../../../../domain/value-objects/consumed-food-item.value-object';
import { MacroNutrients } from '../../../../domain/value-objects/macro-nutrients.value-object';
import { HydrationSummary } from '../../../../domain/value-objects/hydration.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../../../../domain/value-objects/nutrition-feedback.value-object';
import { INutritionCompletionDocument } from '../schemas/nutrition-completion.schema';
import { MealCompletionStatus, Weekday } from '../../../../domain/enums';

export class NutritionCompletionPersistenceMapper {
  public static toDomain(doc: INutritionCompletionDocument): NutritionCompletion {
    const snapshot = NutritionDaySnapshot.create({
      weekday: (doc.nutritionDaySnapshot.weekday as Weekday) || undefined,
      dayNumber: doc.nutritionDaySnapshot.dayNumber,
      name: doc.nutritionDaySnapshot.name ?? null,
      targetCalories: doc.nutritionDaySnapshot.targetCalories ?? null,
      dailyMacroTargets: doc.nutritionDaySnapshot.dailyMacroTargets ?? null,
      hydrationGoal: doc.nutritionDaySnapshot.hydrationGoal ?? null,
      meals: doc.nutritionDaySnapshot.meals || [],
      notes: doc.nutritionDaySnapshot.notes ?? null,
    }).getValue()!;

    const mealCompletions: MealCompletionRecord[] = (doc.mealCompletions || []).map((mc) => {
      const consumedItems = (mc.consumedItems || []).map((ci: any) =>
        ConsumedFoodItem.create({
          prescribedFoodId: ci.prescribedFoodId ?? null,
          prescribedFoodName: ci.prescribedFoodName || ci.name || 'Food',
          consumedType: (ci.consumedType as ConsumedFoodType) || ConsumedFoodType.PRESCRIBED,
          consumedFoodId: ci.consumedFoodId ?? null,
          consumedFoodName: ci.consumedFoodName || ci.name || 'Food',
          quantity: Number(ci.quantity || 1),
          unit: ci.unit || 'serving',
          calories: ci.calories ?? null,
          protein: ci.protein ?? null,
          carbohydrates: ci.carbohydrates ?? null,
          fats: ci.fats ?? null,
        }).getValue()!,
      );

      const consumedMacros = mc.consumedMacros
        ? MacroNutrients.create({
            calories: mc.consumedMacros.calories,
            protein: mc.consumedMacros.protein,
            carbohydrates: mc.consumedMacros.carbohydrates,
            fats: mc.consumedMacros.fats,
          }).getValue()!
        : null;

      return MealCompletionRecord.create({
        mealId: mc.mealId,
        mealType: mc.mealType,
        name: mc.name,
        isCompleted: mc.isCompleted,
        state:
          mc.state ||
          (mc.isCompleted
            ? MealCompletionStatus.COMPLETED
            : consumedItems.length > 0
              ? MealCompletionStatus.PARTIALLY_COMPLETED
              : MealCompletionStatus.NOT_TRACKED),
        consumedItems,
        consumedMacros,
        consumedCalories: mc.consumedCalories ?? null,
        timeConsumed: mc.timeConsumed ?? null,
        notes: mc.notes ?? null,
      }).getValue()!;
    });

    const macroSummary = doc.macroSummary
      ? DailyMacroSummary.create({
          totalCalories: doc.macroSummary.totalCalories,
          protein: doc.macroSummary.protein,
          carbohydrates: doc.macroSummary.carbohydrates,
          fats: doc.macroSummary.fats,
        }).getValue()!
      : null;

    const hydrationSummary = doc.hydrationSummary
      ? HydrationSummary.create({
          loggedMl: doc.hydrationSummary.loggedMl,
          targetMl: doc.hydrationSummary.targetMl ?? null,
        }).getValue()!
      : null;

    const feedback = doc.feedback
      ? NutritionFeedback.create({
          rating: doc.feedback.rating ?? null,
          energyLevel: doc.feedback.energyLevel ?? null,
          digestionNotes: doc.feedback.digestionNotes ?? null,
          notes: doc.feedback.notes ?? null,
          adherenceConfidence: doc.feedback.adherenceConfidence ?? null,
        }).getValue()!
      : null;

    return NutritionCompletion.reconstitute(
      {
        coachingRelationshipId: doc.coachingRelationshipId,
        nutritionPlanId: doc.nutritionPlanId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        completionDate: doc.completionDate || doc.createdAt,
        weekday: (doc.weekday as Weekday) || snapshot.weekday,
        dayNumber: doc.dayNumber,
        weekNumber: doc.weekNumber || 1,
        nutritionDaySnapshot: snapshot,
        mealCompletions,
        macroSummary,
        hydrationSummary,
        feedback,
        status: doc.status,
        startedAt: doc.startedAt,
        completedAt: doc.completedAt ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: NutritionCompletion): Record<string, any> {
    return {
      _id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      nutritionPlanId: entity.nutritionPlanId,
      clientId: entity.clientId,
      trainerId: entity.trainerId,
      completionDate: entity.completionDate,
      weekday: entity.weekday,
      dayNumber: entity.dayNumber,
      weekNumber: entity.weekNumber,
      nutritionDaySnapshot: entity.nutritionDaySnapshot.toPrimitives(),
      mealCompletions: entity.mealCompletions.map((mc) => mc.toPrimitives()),
      macroSummary: entity.macroSummary ? entity.macroSummary.toPrimitives() : null,
      hydrationSummary: entity.hydrationSummary ? entity.hydrationSummary.toPrimitives() : null,
      feedback: entity.feedback ? entity.feedback.toPrimitives() : null,
      status: entity.status,
      startedAt: entity.startedAt,
      completedAt: entity.completedAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
