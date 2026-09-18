import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { IAcquisitionPipelineRepository } from '../../../marketplace/domain/repositories/acquisition-pipeline.repository';
import { DeclineOfferCommandDTO } from '../dtos/offer-command.dto';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import {
  OfferNotFoundException,
  UnauthorizedOfferAccessException,
} from '../../domain/exceptions/offer-domain.exceptions';

export class DeclineOfferUseCase {
  constructor(
    private readonly offerRepo: ICoachingOfferRepository,
    private readonly pipelineRepo?: IAcquisitionPipelineRepository,
  ) {}

  public async execute(dto: DeclineOfferCommandDTO): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const offer = await this.offerRepo.findById(dto.offerId);
      if (!offer) {
        throw new OfferNotFoundException(dto.offerId);
      }

      if (offer.clientId !== dto.clientId) {
        throw new UnauthorizedOfferAccessException(dto.clientId, dto.offerId);
      }

      offer.decline(dto.reason);
      await this.offerRepo.save(offer);

      // Close corresponding AcquisitionPipeline synchronously if pipelineRepo is injected
      if (this.pipelineRepo) {
        try {
          let pipeline = await this.pipelineRepo.findById(offer.acquisitionPipelineId);
          if (!pipeline) {
            pipeline = await this.pipelineRepo.findActivePipelineBetween(
              offer.clientId,
              offer.trainerId,
            );
          }
          if (pipeline && pipeline.isOpen()) {
            pipeline.declineOffer();
            await this.pipelineRepo.save(pipeline);
          }
        } catch {
          // Logged / decoupled via domain events if repo save throws
        }
      }

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while declining coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
