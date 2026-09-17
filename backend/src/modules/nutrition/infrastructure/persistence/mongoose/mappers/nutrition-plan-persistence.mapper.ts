import { NutritionPlan } from '../../../../domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../../domain/entities/nutrition-day.entity';
import { Meal } from '../../../../domain/entities/meal.entity';
import { FoodEntry } from '../../../../domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../../domain/value-objects/macro-nutrients.value-object';
import { HydrationGoal } from '../../../../domain/value-objects/hydration.value-object';
import { INutritionPlanDocument } from '../schemas/nutrition-plan.schema';
import { Weekday } from '../../../../domain/enums';

export class NutritionPlanPersistenceMapper {
  public static toDomain(doc: INutritionPlanDocument): NutritionPlan {
    const nutritionDays: NutritionDay[] = (doc.nutritionDays || []).map((d) => {
      const meals: Meal[] = (d.meals || []).map((m) => {
        const foodEntries: FoodEntry[] = (m.foodEntries || []).map((fe) =>
          FoodEntry.create({
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
          }).getValue()!,
        );

        const targetMacros = m.targetMacros
          ? MacroNutrients.create({
              calories: m.targetMacros.calories,
              protein: m.targetMacros.protein,
              carbohydrates: m.targetMacros.carbohydrates,
              fats: m.targetMacros.fats,
            }).getValue()!
          : null;

        return Meal.create(
          {
            mealType: m.mealType,
            name: m.name,
            timeOfDay: m.timeOfDay ?? null,
            targetCalories: m.targetCalories ?? null,
            targetMacros,
            foodEntries,
            notes: m.notes ?? null,
          },
          m.id,
        ).getValue()!;
      });

      const dailyMacroTargets = d.dailyMacroTargets
        ? MacroNutrients.create({
            calories: d.dailyMacroTargets.calories,
            protein: d.dailyMacroTargets.protein,
            carbohydrates: d.dailyMacroTargets.carbohydrates,
            fats: d.dailyMacroTargets.fats,
          }).getValue()!
        : null;

      const hydrationGoal = d.hydrationGoal
        ? HydrationGoal.create({
            targetMl: d.hydrationGoal.targetMl,
            notes: d.hydrationGoal.notes ?? null,
          }).getValue()!
        : null;

      return NutritionDay.create(
        {
          weekday: (d.weekday as Weekday) || undefined,
          dayNumber: d.dayNumber,
          name: d.name ?? null,
          targetCalories: d.targetCalories ?? null,
          dailyMacroTargets,
          hydrationGoal,
          meals,
          notes: d.notes ?? null,
        },
        d.id,
      ).getValue()!;
    });

    return NutritionPlan.reconstitute(
      {
        coachingRelationshipId: doc.coachingRelationshipId,
        trainerId: doc.trainerId,
        clientId: doc.clientId,
        version: doc.version,
        title: doc.title,
        description: doc.description ?? null,
        durationWeeks: doc.durationWeeks,
        nutritionDays,
        status: doc.status,
        activatedAt: doc.activatedAt ?? null,
        completedAt: doc.completedAt ?? null,
        submittedAt: doc.submittedAt ?? null,
        acceptedAt: doc.acceptedAt ?? null,
        reviewedAt: doc.reviewedAt ?? null,
        rejectionReason: doc.rejectionReason ?? null,
        deletionRequestedAt: doc.deletionRequestedAt ?? null,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: NutritionPlan): Record<string, any> {
    return {
      _id: entity.id,
      coachingRelationshipId: entity.coachingRelationshipId,
      trainerId: entity.trainerId,
      clientId: entity.clientId,
      version: entity.version,
      title: entity.title,
      description: entity.description ?? null,
      durationWeeks: entity.durationWeeks,
      nutritionDays: entity.nutritionDays.map((d) => ({
        id: d.id,
        weekday: d.weekday,
        dayNumber: d.dayNumber,
        name: d.name ?? null,
        targetCalories: d.targetCalories ?? null,
        dailyMacroTargets: d.dailyMacroTargets ? d.dailyMacroTargets.toPrimitives() : null,
        hydrationGoal: d.hydrationGoal ? d.hydrationGoal.toPrimitives() : null,
        meals: d.meals.map((m) => ({
          id: m.id,
          mealType: m.mealType,
          name: m.name,
          timeOfDay: m.timeOfDay ?? null,
          targetCalories: m.targetCalories ?? null,
          targetMacros: m.targetMacros ? m.targetMacros.toPrimitives() : null,
          foodEntries: m.foodEntries.map((fe) => fe.toPrimitives()),
          notes: m.notes ?? null,
        })),
        notes: d.notes ?? null,
      })),
      status: entity.status,
      activatedAt: entity.activatedAt ?? null,
      completedAt: entity.completedAt ?? null,
      submittedAt: entity.submittedAt ?? null,
      acceptedAt: entity.acceptedAt ?? null,
      reviewedAt: entity.reviewedAt ?? null,
      rejectionReason: entity.rejectionReason ?? null,
      deletionRequestedAt: entity.deletionRequestedAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
