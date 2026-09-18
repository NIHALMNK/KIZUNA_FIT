import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { AcceptOfferCommandDTO } from '../dtos/offer-command.dto';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import {
  OfferNotFoundException,
  UnauthorizedOfferAccessException,
} from '../../domain/exceptions/offer-domain.exceptions';

export class AcceptOfferUseCase {
  constructor(private readonly offerRepo: ICoachingOfferRepository) {}

  public async execute(dto: AcceptOfferCommandDTO): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const offer = await this.offerRepo.findById(dto.offerId);
      if (!offer) {
        throw new OfferNotFoundException(dto.offerId);
      }

      if (offer.clientId !== dto.clientId) {
        throw new UnauthorizedOfferAccessException(dto.clientId, dto.offerId);
      }

      offer.accept();
      await this.offerRepo.save(offer);

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while accepting coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
