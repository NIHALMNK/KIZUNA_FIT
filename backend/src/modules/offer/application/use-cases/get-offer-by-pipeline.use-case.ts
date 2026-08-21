import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import {
  OfferNotFoundException,
  UnauthorizedOfferAccessException,
} from '../../domain/exceptions/offer-domain.exceptions';

export class GetOfferByPipelineUseCase {
  constructor(private readonly offerRepo: ICoachingOfferRepository) {}

  public async execute(
    pipelineId: string,
    userId: string,
    userRole: string,
  ): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const offer = await this.offerRepo.findByAcquisitionPipelineId(pipelineId);
      if (!offer) {
        throw new OfferNotFoundException(`Offer for pipeline '${pipelineId}'`);
      }

      if (userRole !== 'ADMIN' && offer.clientId !== userId && offer.trainerId !== userId) {
        throw new UnauthorizedOfferAccessException(userId, offer.offerId);
      }

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while retrieving coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
