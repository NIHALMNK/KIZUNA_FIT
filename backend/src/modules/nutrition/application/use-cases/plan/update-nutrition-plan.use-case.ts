import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionCoachingGateway } from '../../ports/INutritionCoachingGateway';
import {
  UpdateNutritionPlanDto,
  NutritionDayInputDto,
  NutritionPlanResponseDto,
} from '../../dtos/nutrition-plan.dto';
import { NutritionDay } from '../../../domain/entities/nutrition-day.entity';
import { Meal } from '../../../domain/entities/meal.entity';
import { FoodEntry } from '../../../domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../domain/value-objects/macro-nutrients.value-object';
import { HydrationGoal } from '../../../domain/value-objects/hydration.value-object';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError, ValidationError } from '../../../../../shared/exceptions/AppError';

export interface UpdateNutritionPlanCommand extends UpdateNutritionPlanDto {
  planId: string;
}

export class UpdateNutritionPlanUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionCoachingGateway: INutritionCoachingGateway,
  ) {}

  async execute(
    command: UpdateNutritionPlanCommand,
    requestingTrainerId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(command.planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(command.planId);
    }

    const coachingAccess = await this.nutritionCoachingGateway.getRelationshipAccess(
      plan.coachingRelationshipId,
    );
    if (!coachingAccess) {
      throw new NotFoundError(`Coaching relationship '${plan.coachingRelationshipId}' not found.`);
    }

    if (coachingAccess.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'update-plan',
        'Trainer does not own this coaching relationship.',
      );
    }

    let nutritionDays: NutritionDay[] | undefined;
    if (command.nutritionDays) {
      nutritionDays = this.buildNutritionDays(command.nutritionDays);
    }

    const updateResult = plan.updateDraft({
      title: command.title,
      description: command.description,
      durationWeeks: command.durationWeeks,
      nutritionDays,
    });

    if (updateResult.isFailure) {
      throw new ValidationError(updateResult.error || 'Failed to update nutrition plan.');
    }

    await this.nutritionPlanRepository.save(plan);

    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }

  private buildNutritionDays(dayDtos: NutritionDayInputDto[]): NutritionDay[] {
    return dayDtos.map((dayDto) => {
      const meals: Meal[] = (dayDto.meals || []).map((mealDto) => {
        const foodEntries: FoodEntry[] = (mealDto.foodEntries || []).map((feDto) => {
          const feResult = FoodEntry.create({
            id: feDto.id ?? null,
            name: feDto.name,
            quantity: feDto.quantity,
            unit: feDto.unit,
            calories: feDto.calories ?? null,
            protein: feDto.protein ?? null,
            carbohydrates: feDto.carbohydrates ?? null,
            fats: feDto.fats ?? null,
            notes: feDto.notes ?? null,
            alternatives: feDto.alternatives || [],
          });
          if (feResult.isFailure) {
            throw new ValidationError(feResult.error || 'Invalid food entry.');
          }
          return feResult.getValue();
        });

        let targetMacros: MacroNutrients | null = null;
        if (mealDto.targetMacros) {
          const macroResult = MacroNutrients.create(mealDto.targetMacros);
          if (macroResult.isFailure) {
            throw new ValidationError(macroResult.error || 'Invalid meal macro targets.');
          }
          targetMacros = macroResult.getValue();
        }

        const mealResult = Meal.create({
          mealType: mealDto.mealType,
          name: mealDto.name,
          timeOfDay: mealDto.timeOfDay ?? null,
          targetCalories: mealDto.targetCalories ?? null,
          targetMacros,
          foodEntries,
          notes: mealDto.notes ?? null,
        });

        if (mealResult.isFailure) {
          throw new ValidationError(mealResult.error || 'Invalid meal.');
        }
        return mealResult.getValue();
      });

      let dailyMacroTargets: MacroNutrients | null = null;
      if (dayDto.dailyMacroTargets) {
        const macroResult = MacroNutrients.create(dayDto.dailyMacroTargets);
        if (macroResult.isFailure) {
          throw new ValidationError(macroResult.error || 'Invalid daily macro targets.');
        }
        dailyMacroTargets = macroResult.getValue();
      }

      let hydrationGoal: HydrationGoal | null = null;
      if (dayDto.hydrationGoal) {
        const hydrationResult = HydrationGoal.create(dayDto.hydrationGoal);
        if (hydrationResult.isFailure) {
          throw new ValidationError(hydrationResult.error || 'Invalid hydration goal.');
        }
        hydrationGoal = hydrationResult.getValue();
      }

      const dayResult = NutritionDay.create({
        weekday: dayDto.weekday,
        dayNumber: dayDto.dayNumber,
        name: dayDto.name ?? null,
        targetCalories: dayDto.targetCalories ?? null,
        dailyMacroTargets,
        hydrationGoal,
        meals,
        notes: dayDto.notes ?? null,
      });

      if (dayResult.isFailure) {
        throw new ValidationError(dayResult.error || 'Invalid nutrition day.');
      }
      return dayResult.getValue();
    });
  }
}
