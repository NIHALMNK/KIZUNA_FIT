import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { SendOfferCommandDTO } from '../dtos/offer-command.dto';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import {
  OfferNotFoundException,
  UnauthorizedOfferAccessException,
} from '../../domain/exceptions/offer-domain.exceptions';

export class SendOfferUseCase {
  constructor(private readonly offerRepo: ICoachingOfferRepository) {}

  public async execute(dto: SendOfferCommandDTO): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const offer = await this.offerRepo.findById(dto.offerId);
      if (!offer) {
        throw new OfferNotFoundException(dto.offerId);
      }

      if (offer.trainerId !== dto.trainerId) {
        throw new UnauthorizedOfferAccessException(dto.trainerId, dto.offerId);
      }

      offer.send();
      await this.offerRepo.save(offer);

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while sending coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
