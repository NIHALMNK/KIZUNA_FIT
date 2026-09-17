import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class RejectNutritionPlanDeletionUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingClientId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'reject-deletion',
        'Client is not the recipient of this nutrition plan.',
      );
    }

    const rejectResult = plan.rejectDeletion();
    if (rejectResult.isFailure) {
      throw new ValidationError(rejectResult.error || 'Failed to decline plan retirement.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
