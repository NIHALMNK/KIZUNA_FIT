import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { RejectNutritionPlanDto, NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export interface RejectNutritionPlanCommand {
  planId: string;
  reason?: string;
}

export class RejectNutritionPlanUseCase {
  constructor(private readonly nutritionPlanRepository: INutritionPlanRepository) {}

  async execute(
    command: RejectNutritionPlanCommand,
    requestingClientId: string,
  ): Promise<NutritionPlanResponseDto> {
    const plan = await this.nutritionPlanRepository.findById(command.planId);
    if (!plan) {
      throw new NutritionPlanNotFoundException(command.planId);
    }

    if (plan.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'reject-plan',
        'Client is not the recipient of this nutrition plan.',
      );
    }

    const rejectResult = plan.reject(command.reason);
    if (rejectResult.isFailure) {
      throw new ValidationError(rejectResult.error || 'Failed to reject nutrition plan.');
    }

    await this.nutritionPlanRepository.save(plan);
    return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
  }
}
