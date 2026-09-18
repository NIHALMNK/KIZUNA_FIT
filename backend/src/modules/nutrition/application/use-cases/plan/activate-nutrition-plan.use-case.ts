import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionUnitOfWork } from '../../ports/INutritionUnitOfWork';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';

export class ActivateNutritionPlanUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionUnitOfWork: INutritionUnitOfWork,
  ) {}

  async execute(planId: string, requestingTrainerId: string): Promise<NutritionPlanResponseDto> {
    const targetPlan = await this.nutritionPlanRepository.findById(planId);
    if (!targetPlan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (targetPlan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'activate-plan',
        'Trainer does not own this nutrition plan.',
      );
    }

    // Authoritative Business Rule: Direct trainer activation is prohibited for all versions (V1 and V2+).
    // All nutrition plans must be submitted for client approval (DRAFT -> PENDING_APPROVAL)
    // and explicitly accepted by the client before becoming ACTIVE.
    throw new UnauthorizedNutritionActionException(
      'activate-plan',
      'Direct trainer activation is prohibited. Nutrition plans must be submitted for client approval and accepted by the client.',
    );
  }
}
