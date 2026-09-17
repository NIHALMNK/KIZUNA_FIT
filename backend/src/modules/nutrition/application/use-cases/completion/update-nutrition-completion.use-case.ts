import { INutritionCompletionRepository } from '../../../domain/repositories/INutritionCompletionRepository';
import {
  NutritionCompletionNotFoundException,
  NutritionCompletionImmutableException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';
import {
  UpdateNutritionCompletionDto,
  NutritionCompletionResponseDto,
  MealCompletionRecordInputDto,
} from '../../dtos/nutrition-completion.dto';
import { NutritionCompletion } from '../../../domain/aggregates/nutrition-completion.aggregate';
import { MealCompletionRecord } from '../../../domain/value-objects/meal-completion-record.value-object';
import {
  ConsumedFoodItem,
  ConsumedFoodType,
} from '../../../domain/value-objects/consumed-food-item.value-object';
import { MacroNutrients } from '../../../domain/value-objects/macro-nutrients.value-object';
import { HydrationSummary } from '../../../domain/value-objects/hydration.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../../../domain/value-objects/nutrition-feedback.value-object';
import { MealCompletionStatus, NutritionCompletionStatus } from '../../../domain/enums';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';

export class UpdateNutritionCompletionUseCase {
  constructor(private readonly nutritionCompletionRepository: INutritionCompletionRepository) {}

  async execute(
    completionId: string,
    dto: UpdateNutritionCompletionDto,
    requestingClientId: string,
  ): Promise<NutritionCompletionResponseDto> {
    const completion = await this.nutritionCompletionRepository.findById(completionId);
    if (!completion) {
      throw new NutritionCompletionNotFoundException(completionId);
    }

    if (completion.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'update-completion',
        'Client does not own this nutrition completion record.',
      );
    }

    if (completion.status !== NutritionCompletionStatus.IN_PROGRESS) {
      throw new NutritionCompletionImmutableException(completion.id, completion.status);
    }

    // -------------------------------------------------------------
    // Calendar Date Editability Rule: Only client local today is editable!
    // -------------------------------------------------------------
    const clientTodayDate = dto.clientToday
      ? NutritionCompletion.normalizeCalendarDate(dto.clientToday)
      : NutritionCompletion.normalizeCalendarDate(new Date());

    const recordCompletionDate = NutritionCompletion.normalizeCalendarDate(
      completion.completionDate,
    );

    if (clientTodayDate.getTime() !== recordCompletionDate.getTime()) {
      throw new ValidationError(
        "Only today's nutrition execution can be edited. Past and future days are read-only.",
      );
    }

    // -------------------------------------------------------------
    // Meal Completions & Deterministic Execution Processing
    // -------------------------------------------------------------
    let mealCompletions: MealCompletionRecord[] | undefined = undefined;
    if (dto.mealCompletions) {
      mealCompletions = this.buildMealCompletionRecords(dto.mealCompletions, completion);
    }

    // -------------------------------------------------------------
    // Actual Macro Calculation: Sum actual consumption from meals
    // -------------------------------------------------------------
    let macroSummary: DailyMacroSummary | null | undefined = undefined;
    if (dto.macroSummary !== undefined) {
      if (dto.macroSummary) {
        const macroResult = DailyMacroSummary.create(dto.macroSummary);
        if (macroResult.isFailure) {
          throw new ValidationError(macroResult.error || 'Invalid daily macro summary.');
        }
        macroSummary = macroResult.getValue();
      } else {
        macroSummary = null;
      }
    } else if (mealCompletions) {
      let totalCalories = 0;
      let protein = 0;
      let carbohydrates = 0;
      let fats = 0;

      for (const meal of mealCompletions) {
        if (meal.state !== MealCompletionStatus.SKIPPED) {
          if (meal.consumedCalories && meal.consumedCalories > 0) {
            totalCalories += meal.consumedCalories;
          }
          if (meal.consumedMacros) {
            protein += meal.consumedMacros.protein || 0;
            carbohydrates += meal.consumedMacros.carbohydrates || 0;
            fats += meal.consumedMacros.fats || 0;
          }
        }
      }

      const macroSummaryResult = DailyMacroSummary.create({
        totalCalories,
        protein,
        carbohydrates,
        fats,
      });
      if (macroSummaryResult.isFailure) {
        throw new ValidationError(
          macroSummaryResult.error || 'Failed to calculate daily macro summary.',
        );
      }
      macroSummary = macroSummaryResult.getValue();
    }

    let hydrationSummary: HydrationSummary | null | undefined = undefined;
    if (dto.hydrationSummary !== undefined) {
      if (dto.hydrationSummary) {
        const hydrationResult = HydrationSummary.create(dto.hydrationSummary);
        if (hydrationResult.isFailure) {
          throw new ValidationError(hydrationResult.error || 'Invalid hydration summary.');
        }
        hydrationSummary = hydrationResult.getValue();
      } else {
        hydrationSummary = null;
      }
    }

    let feedback: NutritionFeedback | null | undefined = undefined;
    if (dto.feedback !== undefined) {
      if (dto.feedback) {
        const feedbackResult = NutritionFeedback.create(dto.feedback);
        if (feedbackResult.isFailure) {
          throw new ValidationError(feedbackResult.error || 'Invalid feedback.');
        }
        feedback = feedbackResult.getValue();
      } else {
        feedback = null;
      }
    }

    const updateResult = completion.updateExecution({
      mealCompletions,
      macroSummary,
      hydrationSummary,
      feedback,
    });

    if (updateResult.isFailure) {
      throw new ValidationError(updateResult.error || 'Failed to update nutrition completion.');
    }

    await this.nutritionCompletionRepository.save(completion);
    return NutritionDtoMapper.toNutritionCompletionResponseDto(completion);
  }

  private buildMealCompletionRecords(
    dtos: MealCompletionRecordInputDto[],
    completion: NutritionCompletion,
  ): MealCompletionRecord[] {
    const prescribedMeals = completion.nutritionDaySnapshot.meals;

    // Single Meal Execution Invariant: Deduplicate by mealId
    const seen = new Set<string>();
    const dedupedDtos: MealCompletionRecordInputDto[] = [];
    for (const d of dtos) {
      if (!seen.has(d.mealId)) {
        seen.add(d.mealId);
        dedupedDtos.push(d);
      }
    }

    return dedupedDtos.map((dto) => {
      const prescribedMeal = prescribedMeals.find((pm) => pm.mealId === dto.mealId);
      if (!prescribedMeal) {
        throw new ValidationError(
          `Meal '${dto.mealId}' does not belong to the prescribed nutrition day snapshot.`,
        );
      }

      // Check if user explicitly marked this meal as SKIPPED
      if (dto.state === MealCompletionStatus.SKIPPED) {
        const recordResult = MealCompletionRecord.create({
          mealId: prescribedMeal.mealId,
          mealType: prescribedMeal.mealType,
          name: prescribedMeal.name,
          isCompleted: false,
          state: MealCompletionStatus.SKIPPED,
          consumedItems: [],
          consumedMacros: null,
          consumedCalories: null,
          timeConsumed: dto.timeConsumed ? new Date(dto.timeConsumed) : null,
          notes: dto.notes ?? null,
        });
        if (recordResult.isFailure) {
          throw new ValidationError(recordResult.error || 'Invalid meal completion record.');
        }
        return recordResult.getValue();
      }

      // Process consumed items with strict validation:
      // Exactly one execution outcome per prescribed food entry (PRESCRIBED or ALTERNATIVE)
      const consumedItems: ConsumedFoodItem[] = [];
      const executedPrescribedFoodIds = new Set<string>();

      for (const ci of dto.consumedItems || []) {
        const prescribedName = (ci.prescribedFoodName || (ci as any).name || '').trim();
        const consumedName = (ci.consumedFoodName || (ci as any).name || prescribedName).trim();

        // Find matching prescribed food entry
        const matchingPrescribedFood = prescribedMeal.foodEntries.find(
          (pfe) =>
            (ci.prescribedFoodId && pfe.id === ci.prescribedFoodId) ||
            (prescribedName.length > 0 &&
              pfe.name.trim().toLowerCase() === prescribedName.toLowerCase()),
        );

        if (!matchingPrescribedFood) {
          throw new ValidationError(
            `Prescribed food '${prescribedName || ci.prescribedFoodId}' does not exist in meal '${prescribedMeal.name}'.`,
          );
        }

        const foodKey =
          matchingPrescribedFood.id || matchingPrescribedFood.name.trim().toLowerCase();
        if (executedPrescribedFoodIds.has(foodKey)) {
          // Disallow duplicate execution outcomes for the same prescribed food
          continue;
        }
        executedPrescribedFoodIds.add(foodKey);

        if (ci.consumedType === ConsumedFoodType.ALTERNATIVE) {
          // Verify that this alternative was actually configured by the trainer for this FoodEntry
          const matchingAlternative = (matchingPrescribedFood.alternatives || []).find(
            (alt) =>
              (ci.consumedFoodId && alt.id === ci.consumedFoodId) ||
              (consumedName.length > 0 &&
                alt.name.trim().toLowerCase() === consumedName.toLowerCase()),
          );

          if (!matchingAlternative) {
            throw new ValidationError(
              `Alternative '${consumedName}' is not a prescribed alternative for '${matchingPrescribedFood.name}'.`,
            );
          }

          // Authoritative values from the prescribed alternative
          const qty = ci.quantity && ci.quantity > 0 ? ci.quantity : matchingAlternative.quantity;
          const ratio = matchingAlternative.quantity > 0 ? qty / matchingAlternative.quantity : 1;

          const itemResult = ConsumedFoodItem.create({
            prescribedFoodId: matchingPrescribedFood.id ?? null,
            prescribedFoodName: matchingPrescribedFood.name,
            consumedType: ConsumedFoodType.ALTERNATIVE,
            consumedFoodId: matchingAlternative.id ?? null,
            consumedFoodName: matchingAlternative.name,
            quantity: qty,
            unit: matchingAlternative.unit,
            calories:
              matchingAlternative.calories !== null && matchingAlternative.calories !== undefined
                ? Math.round(matchingAlternative.calories * ratio)
                : null,
            protein:
              matchingAlternative.protein !== null && matchingAlternative.protein !== undefined
                ? Math.round(matchingAlternative.protein * ratio)
                : null,
            carbohydrates:
              matchingAlternative.carbohydrates !== null &&
              matchingAlternative.carbohydrates !== undefined
                ? Math.round(matchingAlternative.carbohydrates * ratio)
                : null,
            fats:
              matchingAlternative.fats !== null && matchingAlternative.fats !== undefined
                ? Math.round(matchingAlternative.fats * ratio)
                : null,
          });

          if (itemResult.isFailure) {
            throw new ValidationError(itemResult.error || 'Invalid consumed alternative item.');
          }
          consumedItems.push(itemResult.getValue());
        } else {
          // Consumed as PRESCRIBED
          const qty =
            ci.quantity && ci.quantity > 0 ? ci.quantity : matchingPrescribedFood.quantity;
          const ratio =
            matchingPrescribedFood.quantity > 0 ? qty / matchingPrescribedFood.quantity : 1;

          const itemResult = ConsumedFoodItem.create({
            prescribedFoodId: matchingPrescribedFood.id ?? null,
            prescribedFoodName: matchingPrescribedFood.name,
            consumedType: ConsumedFoodType.PRESCRIBED,
            consumedFoodId: matchingPrescribedFood.id ?? null,
            consumedFoodName: matchingPrescribedFood.name,
            quantity: qty,
            unit: matchingPrescribedFood.unit,
            calories:
              matchingPrescribedFood.calories !== null &&
              matchingPrescribedFood.calories !== undefined
                ? Math.round(matchingPrescribedFood.calories * ratio)
                : null,
            protein:
              matchingPrescribedFood.protein !== null &&
              matchingPrescribedFood.protein !== undefined
                ? Math.round(matchingPrescribedFood.protein * ratio)
                : null,
            carbohydrates:
              matchingPrescribedFood.carbohydrates !== null &&
              matchingPrescribedFood.carbohydrates !== undefined
                ? Math.round(matchingPrescribedFood.carbohydrates * ratio)
                : null,
            fats:
              matchingPrescribedFood.fats !== null && matchingPrescribedFood.fats !== undefined
                ? Math.round(matchingPrescribedFood.fats * ratio)
                : null,
          });

          if (itemResult.isFailure) {
            throw new ValidationError(itemResult.error || 'Invalid consumed prescribed item.');
          }
          consumedItems.push(itemResult.getValue());
        }
      }

      // Backward compatibility: If legacy selectedAlternative is provided, resolve and add to consumedItems
      if ((dto as any).selectedAlternative) {
        const sa = (dto as any).selectedAlternative;
        const matchingPrescribedFood = prescribedMeal.foodEntries.find(
          (pfe) =>
            (sa.prescribedFoodId && pfe.id === sa.prescribedFoodId) ||
            pfe.name.trim().toLowerCase() === sa.prescribedFoodName?.trim().toLowerCase(),
        );

        if (matchingPrescribedFood) {
          const matchingAlternative = (matchingPrescribedFood.alternatives || []).find(
            (alt) =>
              (sa.alternativeId && alt.id === sa.alternativeId) ||
              alt.name.trim().toLowerCase() === sa.alternativeName?.trim().toLowerCase(),
          );

          if (matchingAlternative) {
            const foodKey =
              matchingPrescribedFood.id || matchingPrescribedFood.name.trim().toLowerCase();
            if (!executedPrescribedFoodIds.has(foodKey)) {
              executedPrescribedFoodIds.add(foodKey);

              const itemResult = ConsumedFoodItem.create({
                prescribedFoodId: matchingPrescribedFood.id ?? null,
                prescribedFoodName: matchingPrescribedFood.name,
                consumedType: ConsumedFoodType.ALTERNATIVE,
                consumedFoodId: matchingAlternative.id ?? null,
                consumedFoodName: matchingAlternative.name,
                quantity: sa.quantity || matchingAlternative.quantity,
                unit: sa.unit || matchingAlternative.unit,
                calories:
                  sa.calories !== undefined && sa.calories !== null
                    ? sa.calories
                    : matchingAlternative.calories,
                protein:
                  sa.protein !== undefined && sa.protein !== null
                    ? sa.protein
                    : matchingAlternative.protein,
                carbohydrates:
                  sa.carbohydrates !== undefined && sa.carbohydrates !== null
                    ? sa.carbohydrates
                    : matchingAlternative.carbohydrates,
                fats:
                  sa.fats !== undefined && sa.fats !== null ? sa.fats : matchingAlternative.fats,
              });

              if (itemResult.isSuccess) {
                consumedItems.push(itemResult.getValue());
              }
            }
          }
        }
      }

      // Deterministic Meal Status Derivation
      const totalPrescribed = prescribedMeal.foodEntries.length;
      const executedCount = consumedItems.length;

      let finalState: MealCompletionStatus;
      let isCompleted = false;

      if (dto.isCompleted || dto.state === MealCompletionStatus.COMPLETED) {
        finalState = MealCompletionStatus.COMPLETED;
        isCompleted = true;
      } else if (executedCount === 0) {
        finalState = MealCompletionStatus.NOT_TRACKED;
        isCompleted = false;
      } else if (executedCount >= totalPrescribed || totalPrescribed === 0) {
        finalState = MealCompletionStatus.COMPLETED;
        isCompleted = true;
      } else {
        finalState = MealCompletionStatus.PARTIALLY_COMPLETED;
        isCompleted = false;
      }

      // Calculate actual meal calories & macros from consumed items
      let mealCalories = 0;
      let mealProtein = 0;
      let mealCarbs = 0;
      let mealFats = 0;

      for (const ci of consumedItems) {
        mealCalories += ci.calories || 0;
        mealProtein += ci.protein || 0;
        mealCarbs += ci.carbohydrates || 0;
        mealFats += ci.fats || 0;
      }

      if (mealCalories === 0 && dto.consumedCalories && dto.consumedCalories > 0) {
        mealCalories = dto.consumedCalories;
      }

      let consumedMacros: MacroNutrients | null = null;
      if (mealCalories > 0 || mealProtein > 0 || mealCarbs > 0 || mealFats > 0) {
        const macroResult = MacroNutrients.create({
          calories: mealCalories,
          protein: mealProtein,
          carbohydrates: mealCarbs,
          fats: mealFats,
        });
        if (macroResult.isFailure) {
          throw new ValidationError(macroResult.error || 'Invalid consumed macros.');
        }
        consumedMacros = macroResult.getValue();
      }

      const recordResult = MealCompletionRecord.create({
        mealId: prescribedMeal.mealId,
        mealType: prescribedMeal.mealType,
        name: prescribedMeal.name,
        isCompleted,
        state: finalState,
        consumedItems,
        consumedMacros,
        consumedCalories: mealCalories > 0 ? mealCalories : null,
        timeConsumed: dto.timeConsumed ? new Date(dto.timeConsumed) : null,
        notes: dto.notes ?? null,
      });

      if (recordResult.isFailure) {
        throw new ValidationError(recordResult.error || 'Invalid meal completion record.');
      }
      return recordResult.getValue();
    });
  }
}
