import { INutritionCompletionRepository } from '../../../domain/repositories/INutritionCompletionRepository';
import { INutritionCoachingGateway } from '../../ports/INutritionCoachingGateway';
import { NutritionCompletionResponseDto } from '../../dtos/nutrition-completion.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import { UnauthorizedNutritionActionException } from '../../../domain/exceptions/nutrition-domain.exceptions';
import { NotFoundError } from '../../../../../shared/exceptions/AppError';

export class ListNutritionCompletionsUseCase {
  constructor(
    private readonly nutritionCompletionRepository: INutritionCompletionRepository,
    private readonly nutritionCoachingGateway: INutritionCoachingGateway,
  ) {}

  async execute(
    coachingRelationshipId: string | undefined,
    requestingUserId: string,
    limit = 50,
    skip = 0,
  ): Promise<NutritionCompletionResponseDto[]> {
    let relationshipId = coachingRelationshipId;

    if (!relationshipId) {
      const activeRel =
        await this.nutritionCoachingGateway.getActiveRelationshipForClient(requestingUserId);
      if (!activeRel) {
        return [];
      }
      relationshipId = activeRel.relationshipId;
    }

    const coachingAccess =
      await this.nutritionCoachingGateway.getRelationshipAccess(relationshipId);
    if (!coachingAccess) {
      throw new NotFoundError(`Coaching relationship '${relationshipId}' not found.`);
    }

    if (
      coachingAccess.trainerId !== requestingUserId &&
      coachingAccess.clientId !== requestingUserId
    ) {
      throw new UnauthorizedNutritionActionException(
        'list-completions',
        'User is not authorized to view completion records for this relationship.',
      );
    }

    const completions = await this.nutritionCompletionRepository.findByRelationshipId(
      relationshipId,
      limit,
      skip,
    );
    return completions.map(NutritionDtoMapper.toNutritionCompletionResponseDto);
  }
}
