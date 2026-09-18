import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';

export class GetNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(planId: string, requestingUserId: string): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (plan.trainerId !== requestingUserId && plan.clientId !== requestingUserId) {
      throw new UnauthorizedNutritionActionException(
        'get-plan',
        'User is not authorized to access this nutrition plan.',
      );
    }

    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
