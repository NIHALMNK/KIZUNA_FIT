import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  PendingNutritionPlanAlreadyExistsException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class SubmitNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingTrainerId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'submit-plan',
        'Trainer does not own this nutrition plan.',
      );
    }

    // Check if there is already a pending plan for this relationship
    const existingPending = await this.nutritionPlanRepository.findPendingByRelationshipId(
      plan.coachingRelationshipId,
    );
    if (existingPending && existingPending.id !== plan.id) {
      throw new PendingNutritionPlanAlreadyExistsException(
        plan.coachingRelationshipId,
        existingPending.id,
      );
    }

    const submitResult = plan.submit();
    if (submitResult.isFailure) {
      throw new ValidationError(submitResult.error || 'Failed to submit nutrition plan.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
