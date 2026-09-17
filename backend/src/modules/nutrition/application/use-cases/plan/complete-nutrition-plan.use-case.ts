import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class CompleteNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingTrainerId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'complete-plan',
        'Trainer does not own this nutrition plan.',
      );
    }

    const completeResult = plan.complete();
    if (completeResult.isFailure) {
      throw new ValidationError(completeResult.error || 'Failed to complete nutrition plan.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
