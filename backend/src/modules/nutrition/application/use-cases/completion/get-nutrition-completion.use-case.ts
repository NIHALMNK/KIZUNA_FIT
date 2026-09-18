import { INutritionCompletionRepository } from '../../../domain/repositories/INutritionCompletionRepository';
import { NutritionCompletionResponseDto } from '../../dtos/nutrition-completion.dto';
import { NutritionDtoMapper } from '../../mappers/nutrition-dto.mapper';
import {
  NutritionCompletionNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../domain/exceptions/nutrition-domain.exceptions';

export class GetNutritionCompletionUseCase {
  constructor(private readonly nutritionCompletionRepository: INutritionCompletionRepository) {}

  async execute(
    completionId: string,
    requestingUserId: string,
  ): Promise<NutritionCompletionResponseDto> {
    const completion = await this.nutritionCompletionRepository.findById(completionId);
    if (!completion) {
      throw new NutritionCompletionNotFoundException(completionId);
    }

    if (completion.clientId !== requestingUserId && completion.trainerId !== requestingUserId) {
      throw new UnauthorizedNutritionActionException(
        'get-completion',
        'User is not authorized to access this nutrition completion record.',
      );
    }

    return NutritionDtoMapper.toNutritionCompletionResponseDto(completion);
  }
}
