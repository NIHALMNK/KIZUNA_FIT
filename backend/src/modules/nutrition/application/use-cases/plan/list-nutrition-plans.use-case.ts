import { INutritionPlanRepository } from '../../../domain/repositories/INutritionPlanRepository';
import { INutritionCoachingGateway } from '../../ports/INutritionCoachingGateway';
import { NutritionPlanResponseDto } from '../../dtos/nutrition-plan.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import { UnauthorizedNutritionActionException } from '../../../domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError } from '../../../../../shared/exceptions/AppError';

export class ListNutritionPlansUseCase {
  constructor(
    private readonly nutritionPlanRepository: INutritionPlanRepository,
    private readonly nutritionCoachingGateway: INutritionCoachingGateway,
  ) {}

  async execute(
    coachingRelationshipId: string,
    requestingUserId: string,
  ): Promise<NutritionPlanResponseDto[]> {
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
        'list-plans',
        'User is not authorized to view plans for this coaching relationship.',
      );
    }

    const plans = await this.nutritionPlanRepository.findByRelationshipId(coachingRelationshipId);
    return plans.map(NutritionDtoMapper.toNutritionPlanResponseDto);
  }
}
