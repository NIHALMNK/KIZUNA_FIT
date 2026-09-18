import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionUnitOfWork } from '../../ports/INutritionUnitOfWork';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class AcceptNutritionPlanUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionUnitOfWork: INutritionUnitOfWork,
  ) {}

  async execute(planId: string, requestingClientId: string): Promise<NutritionPlanResponseDto> {
    const targetPlan = await this.nutritionPlanRepository.findById(planId);
    if (!targetPlan) {
      throw new NutritionPlanNotFoundException(planId);
    }

    if (targetPlan.clientId !== requestingClientId) {
      throw new UnauthorizedNutritionActionException(
        'accept-plan',
        'Client is not the recipient of this nutrition plan.',
      );
    }

    return await this.nutritionUnitOfWork.withTransaction(async ({ planRepo }) => {
      // Find current active plan for relationship
      const existingActive = await planRepo.findActiveByRelationshipId(
        targetPlan.coachingRelationshipId,
      );

      if (existingActive && existingActive.id !== targetPlan.id) {
        existingActive.complete();
        await planRepo.save(existingActive);
      }

      const acceptResult = targetPlan.accept(new Date(), existingActive?.id ?? null);
      if (acceptResult.isFailure) {
        throw new ValidationError(acceptResult.error || 'Failed to accept nutrition plan.');
      }

      await planRepo.save(targetPlan);

      return NutritionDtoMapper.toNutritionPlanResponseDto(targetPlan);
    });
  }
}
