import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionCoachingGateway } from '../../ports/INutritionCoachingGateway';
import {
  CreateNutritionPlanDto,
  NutritionDayInputDto,
  NutritionPlanResponseDto,
} from '../../dtos/nutrition-plan.dto';
import { NutritionPlan } from '../../../domain/aggregates/nutrition-plan.aggregate';
import { NutritionDay } from '../../../domain/entities/nutrition-day.entity';
import { Meal } from '../../../domain/entities/meal.entity';
import { FoodEntry } from '../../../domain/value-objects/food-entry.value-object';
import { MacroNutrients } from '../../../domain/value-objects/macro-nutrients.value-object';
import { HydrationGoal } from '../../../domain/value-objects/hydration.value-object';
import { NutritionPlanStatus } from '../../../domain/enums';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  InitialNutritionPlanAlreadyExistsException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError, ValidationError } from '../../../../../shared/exceptions/AppError';

export class CreateNutritionPlanUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionCoachingGateway: INutritionCoachingGateway,
  ) {}

  async execute(
    dto: CreateNutritionPlanDto,
    requestingTrainerId: string,
  ): Promise<NutritionPlanResponseDto> {
    const coachingAccess = await this.nutritionCoachingGateway.getRelationshipAccess(
      dto.coachingRelationshipId,
    );
    if (!coachingAccess) {
      throw new NotFoundError(`Coaching relationship '${dto.coachingRelationshipId}' not found.`);
    }

    if (coachingAccess.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'create-plan',
        'Trainer does not own this coaching relationship.',
      );
    }

    const existingPlans = await this.nutritionPlanRepository.findByRelationshipId(
      dto.coachingRelationshipId,
    );
    if (existingPlans && existingPlans.length > 0) {
      throw new InitialNutritionPlanAlreadyExistsException(dto.coachingRelationshipId);
    }

    const nutritionDays = this.buildNutritionDays(dto.nutritionDays || []);

    const planResult = NutritionPlan.create({
      coachingRelationshipId: dto.coachingRelationshipId,
      trainerId: coachingAccess.trainerId,
      clientId: coachingAccess.clientId,
      version: 1,
      title: dto.title,
      description: dto.description ?? null,
      durationWeeks: dto.durationWeeks,
      nutritionDays,
      status: NutritionPlanStatus.DRAFT,
    });

    if (planResult.isFailure) {
      throw new ValidationError(planResult.error || 'Failed to create nutrition plan.');
    }

    const plan = planResult.getValue();
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
