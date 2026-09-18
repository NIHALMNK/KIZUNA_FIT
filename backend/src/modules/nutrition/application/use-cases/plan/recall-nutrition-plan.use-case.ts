import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class RecallNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingTrainerId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'recall-plan',
        'Trainer does not own this nutrition plan.',
      );
    }

    const recallResult = plan.recall();
    if (recallResult.isFailure) {
      throw new ValidationError(recallResult.error || 'Failed to recall nutrition plan.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
