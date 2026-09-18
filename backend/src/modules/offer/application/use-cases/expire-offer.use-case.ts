import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { ExpireOfferCommandDTO } from '../dtos/offer-command.dto';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import { OfferNotFoundException } from '../../domain/exceptions/offer-domain.exceptions';

export class ExpireOfferUseCase {
  constructor(private readonly offerRepo: ICoachingOfferRepository) {}

  public async execute(dto: ExpireOfferCommandDTO): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const offer = await this.offerRepo.findById(dto.offerId);
      if (!offer) {
        throw new OfferNotFoundException(dto.offerId);
      }

      offer.expire();
      await this.offerRepo.save(offer);

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while expiring coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
