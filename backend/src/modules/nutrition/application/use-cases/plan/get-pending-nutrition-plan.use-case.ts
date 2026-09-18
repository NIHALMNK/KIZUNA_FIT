import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionCoachingGateway } from '../../ports/INutritionCoachingGateway';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import { UnauthorizedNutritionActionException } from '../../../domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError } from '../../../../../shared/exceptions/AppError';

export class GetPendingNutritionPlanUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionCoachingGateway: INutritionCoachingGateway,
  ) {}

  async execute(
    requestingUserId: string,
    coachingRelationshipId?: string,
  ): Promise<NutritionPlanResponseDto | null> {
    if (coachingRelationshipId) {
      const coachingAccess =
        await this.nutritionCoachingGateway.getRelationshipAccess(coachingRelationshipId);
      if (!coachingAccess) {
        throw new NotFoundError(`Coaching relationship '${coachingRelationshipId}' not found.`);
      }

      if (
        coachingAccess.trainerId !== requestingUserId &&
        coachingAccess.clientId !== requestingUserId
      ) {
        throw new UnauthorizedNutritionActionException(
          'get-pending-plan',
          'User does not belong to this coaching relationship.',
        );
      }

      const plan =
        await this.nutritionPlanRepository.findPendingByRelationshipId(coachingRelationshipId);

      return plan ? NutritionDtoMapper.toNutritionPlanResponseDto(plan) : null;
    }

    // Client-scoped query (no relationship ID passed)
    const activeRelationship =
      await this.nutritionCoachingGateway.getActiveRelationshipForClient(requestingUserId);

    if (activeRelationship) {
      const plan = await this.nutritionPlanRepository.findPendingByRelationshipId(
        activeRelationship.relationshipId,
      );
      if (plan) {
        return NutritionDtoMapper.toNutritionPlanResponseDto(plan);
      }
    }

    // Direct client lookup fallback
    const directPlan = await this.nutritionPlanRepository.findPendingByClientId(requestingUserId);
    return directPlan ? NutritionDtoMapper.toNutritionPlanResponseDto(directPlan) : null;
  }
}
