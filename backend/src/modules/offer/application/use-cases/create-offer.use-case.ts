import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { ICoachingOfferRepository } from '../../domain/repositories/coaching-offer.repository';
import { IConsultationRepository } from '../../../consultation/domain/repositories/consultation.repository';
import { ConsultationStatus } from '../../../consultation/domain/enums/consultation-status.enum';
import { CoachingOffer } from '../../domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../../domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../domain/value-objects/scope-snapshot.value-object';
import { getPlatformPlan } from '../../domain/enums/coaching-plan-type.enum';
import { CreateOfferCommandDTO } from '../dtos/offer-command.dto';
import { CoachingOfferResponseDTO } from '../dtos/offer-response.dto';
import { OfferDTOMapper } from '../mappers/offer-dto.mapper';
import {
  ConsultationNotCompletedException,
  DuplicateOfferException,
  UnauthorizedOfferAccessException,
  OfferNotFoundException,
} from '../../domain/exceptions/offer-domain.exceptions';

export class CreateOfferUseCase {
  constructor(
    private readonly offerRepo: ICoachingOfferRepository,
    private readonly consultationRepo: IConsultationRepository,
  ) {}

  public async execute(dto: CreateOfferCommandDTO): Promise<Result<CoachingOfferResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findById(dto.consultationId);
      if (!consultation) {
        throw new OfferNotFoundException(`Consultation with ID '${dto.consultationId}'`);
      }

      if (consultation.trainerId !== dto.trainerId) {
        throw new UnauthorizedOfferAccessException(dto.trainerId, dto.consultationId);
      }

      if (consultation.status !== ConsultationStatus.COMPLETED) {
        throw new ConsultationNotCompletedException(
          consultation.consultationId,
          consultation.status,
        );
      }

      const existingOffer = await this.offerRepo.findByConsultationId(consultation.consultationId);
      if (existingOffer) {
        throw new DuplicateOfferException('consultation', consultation.consultationId);
      }

      // Server-side authoritative plan lookup (BASIC 10%, PRO 15%, PREMIUM 20%)
      const platformPlan = getPlatformPlan(dto.planType);

      // Server-side derived commission and pricing
      const pricingResult = PricingSnapshot.calculate(
        dto.trainerFee,
        platformPlan.commissionRate,
        dto.currency,
      );

      if (pricingResult.isFailure) {
        return Result.fail<CoachingOfferResponseDTO>(pricingResult.error);
      }

      // Server-side derived scope (30 days, canonical plan features)
      const scopeResult = ScopeSnapshot.createForPlan(platformPlan.planType, dto.trainerNotes);

      if (scopeResult.isFailure) {
        return Result.fail<CoachingOfferResponseDTO>(scopeResult.error);
      }

      const initialStatus = dto.sendImmediately
        ? CoachingOfferStatus.SENT
        : CoachingOfferStatus.DRAFT;

      const offerResult = CoachingOffer.create({
        acquisitionPipelineId: consultation.acquisitionPipelineId,
        consultationId: consultation.consultationId,
        clientId: consultation.clientId,
        trainerId: consultation.trainerId,
        pricingSnapshot: pricingResult.getValue(),
        scopeSnapshot: scopeResult.getValue(),
        status: initialStatus,
      });

      if (offerResult.isFailure) {
        return Result.fail<CoachingOfferResponseDTO>(offerResult.error);
      }

      const offer = offerResult.getValue();
      await this.offerRepo.save(offer);

      return Result.ok<CoachingOfferResponseDTO>(OfferDTOMapper.toDTO(offer));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<CoachingOfferResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating coaching offer';
      return Result.fail<CoachingOfferResponseDTO>(message);
    }
  }
}
