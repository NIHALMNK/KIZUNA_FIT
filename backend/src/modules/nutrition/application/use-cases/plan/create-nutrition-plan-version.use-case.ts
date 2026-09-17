import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import {
  CreateNutritionPlanVersionDto,
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
  NutritionConcurrencyConflictException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class CreateNutritionPlanVersionUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(
    dto: CreateNutritionPlanVersionDto,
    requestingTrainerId: string,
  ): Promise<NutritionPlanResponseDto> {
    const existingPlan = await this.nutritionPlanRepository.findById(dto.planId);
    if (!existingPlan) {
      throw new NutritionPlanNotFoundException(dto.planId);
    }

    if (existingPlan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'create-version',
        'Trainer does not own this nutrition plan.',
      );
    }

    let nutritionDaysOverride: NutritionDay[] | undefined = undefined;
    if (dto.nutritionDays) {
      nutritionDaysOverride = this.buildNutritionDays(dto.nutritionDays);
    }

    const MAX_RETRIES = 3;
    let attempt = 0;

    while (attempt < MAX_RETRIES) {
      attempt++;
      const highestVersion = await this.nutritionPlanRepository.findHighestVersionNumber(
        existingPlan.coachingRelationshipId,
      );
      const nextVersion = Math.max(highestVersion, existingPlan.version) + 1;

      const newVersionPlan = existingPlan.createNewVersion({
        versionOverride: nextVersion,
        title: dto.title,
        description: dto.description,
        durationWeeks: dto.durationWeeks,
        nutritionDays: nutritionDaysOverride,
      });

      try {
        await this.nutritionPlanRepository.save(newVersionPlan);
        return NutritionDtoMapper.toNutritionPlanResponseDto(newVersionPlan);
      } catch (error: any) {
        // Detect version-allocation collision: check AppError code first (most reliable),
        // then fall back to Mongo duplicate-key signals. ONLY these collision errors are
        // retryable — all other domain / business errors must propagate immediately.
        const isVersionCollision =
          error?.code === 'NUTRITION_PLAN_VERSION_ALREADY_EXISTS' ||
          error?.code === 11000 ||
          error?.codeName === 'DuplicateKey' ||
          (typeof error?.message === 'string' &&
            (error.message.includes('E11000') ||
              error.message.includes('duplicate key') ||
              error.message.includes('coachingRelationshipId_1_version_1')));

        if (isVersionCollision) {
          if (attempt < MAX_RETRIES) {
            // Re-read highest version on next iteration and try again
            continue;
          }
          // All retries exhausted — this is a genuine concurrency conflict
          throw new NutritionConcurrencyConflictException(existingPlan.coachingRelationshipId);
        }

        // Non-collision errors (domain exceptions, validation, etc.) propagate immediately
        throw error;
      }
    }

    // Should be unreachable; safety net
    throw new NutritionConcurrencyConflictException(existingPlan.coachingRelationshipId);
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
