import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class RequestNutritionPlanDeletionUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingTrainerId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'request-deletion',
        'Trainer does not own this nutrition plan.',
      );
    }

    const requestResult = plan.requestDeletion();
    if (requestResult.isFailure) {
      throw new ValidationError(requestResult.error || 'Failed to request plan retirement.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
