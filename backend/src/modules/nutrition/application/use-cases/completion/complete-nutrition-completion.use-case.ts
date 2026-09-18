import { INutritionCompletionRepository } from '../../../domain/repositories/INutritionCompletionRepository';
import {
  CompleteNutritionCompletionDto,
  MealCompletionRecordInputDto,
  NutritionCompletionResponseDto,
} from '../../dtos/nutrition-completion.dto';
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
import { MealCompletionStatus } from '../../../domain/enums';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionCompletionNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class CompleteNutritionCompletionUseCase {
  constructor(private readonly nutritionCompletionRepository: INutritionCompletionRepository) {}

  async execute(
    completionId: string,
    requestingClientId: string,
    dto?: CompleteNutritionCompletionDto,
  ): Promise<NutritionCompletionResponseDto> {
    const completion = await this.nutritionCompletionRepository.findById(completionId);
    if (!completion) {
      throw new NutritionCompletionNotFoundException(completionId);
    }

    if (completion.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'complete-completion',
        'Client does not own this nutrition completion record.',
      );
    }

    let mealCompletions: MealCompletionRecord[] | undefined = undefined;
    if (dto?.mealCompletions) {
      mealCompletions = this.buildMealCompletionRecords(dto.mealCompletions);
    }

    let macroSummary: DailyMacroSummary | null | undefined = undefined;
    if (dto?.macroSummary !== undefined) {
      if (dto.macroSummary) {
        const macroResult = DailyMacroSummary.create(dto.macroSummary);
        if (macroResult.isFailure) {
          throw new ValidationError(macroResult.error || 'Invalid daily macro summary.');
        }
        macroSummary = macroResult.getValue();
      } else {
        macroSummary = null;
      }
    }

    let hydrationSummary: HydrationSummary | null | undefined = undefined;
    if (dto?.hydrationSummary !== undefined) {
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
    if (dto?.feedback !== undefined) {
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

    const completeResult = completion.complete(new Date(), {
      mealCompletions,
      macroSummary,
      hydrationSummary,
      feedback,
    });

    if (completeResult.isFailure) {
      throw new ValidationError(completeResult.error || 'Failed to complete daily nutrition log.');
    }

    await this.nutritionCompletionRepository.save(completion);
    return NutritionDtoMapper.toNutritionCompletionResponseDto(completion);
  }

  private buildMealCompletionRecords(dtos: MealCompletionRecordInputDto[]): MealCompletionRecord[] {
    return dtos.map((dto) => {
      const consumedItems: ConsumedFoodItem[] = (dto.consumedItems || []).map((ci) => {
        const itemResult = ConsumedFoodItem.create({
          prescribedFoodId: ci.prescribedFoodId ?? null,
          prescribedFoodName: ci.prescribedFoodName,
          consumedType: (ci.consumedType as ConsumedFoodType) || ConsumedFoodType.PRESCRIBED,
          consumedFoodId: ci.consumedFoodId ?? null,
          consumedFoodName: ci.consumedFoodName,
          quantity: ci.quantity,
          unit: ci.unit,
          calories: ci.calories ?? null,
          protein: ci.protein ?? null,
          carbohydrates: ci.carbohydrates ?? null,
          fats: ci.fats ?? null,
        });
        if (itemResult.isFailure) {
          throw new ValidationError(itemResult.error || 'Invalid consumed food item.');
        }
        return itemResult.getValue();
      });

      let consumedMacros: MacroNutrients | null = null;
      if (dto.consumedMacros) {
        const macroResult = MacroNutrients.create(dto.consumedMacros);
        if (macroResult.isFailure) {
          throw new ValidationError(macroResult.error || 'Invalid consumed macros.');
        }
        consumedMacros = macroResult.getValue();
      }

      const recordResult = MealCompletionRecord.create({
        mealId: dto.mealId,
        mealType: dto.mealType,
        name: dto.name,
        isCompleted: dto.isCompleted ?? dto.state === MealCompletionStatus.COMPLETED,
        state: dto.state || MealCompletionStatus.NOT_TRACKED,
        consumedItems,
        consumedMacros,
        consumedCalories: dto.consumedCalories ?? null,
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
