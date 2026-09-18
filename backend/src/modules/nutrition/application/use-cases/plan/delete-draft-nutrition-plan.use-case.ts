import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanStatus } from '../../../domain/enums';
import {
  ActiveNutritionPlanImmutableException,
  CompletedNutritionPlanImmutableException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';

export class DeleteDraftNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingTrainerId: string): Promise<void> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingTrainerId) {
      throw new UnauthorizedNutritionActionException(
        'delete-draft',
        'Trainer does not own this nutrition plan.',
      );
    }

    if (plan.status === NutritionPlanStatus.ACTIVE) {
      throw new ActiveNutritionPlanImmutableException(planId);
    }

    if (plan.status === NutritionPlanStatus.COMPLETED) {
      throw new CompletedNutritionPlanImmutableException(planId);
    }

    await this.nutritionPlanRepository.delete(planId);
  }
}
