import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { ConsultationSlot } from '../../domain/value-objects/consultation-slot.vo';
import { BookConsultationSlotCommandDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  ConsultationNotFoundException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class BookConsultationSlotUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: BookConsultationSlotCommandDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findById(dto.consultationId);
      if (!consultation) {
        throw new ConsultationNotFoundException(dto.consultationId);
      }

      if (consultation.clientId !== dto.clientId) {
        throw new UnauthorizedConsultationParticipantException(dto.clientId, dto.consultationId);
      }

      const slotResult = ConsultationSlot.create({
        scheduledStartAt: dto.scheduledStartAt,
        scheduledEndAt: dto.scheduledEndAt,
        timezone: dto.timezone,
      });

      if (slotResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(slotResult.error);
      }

      consultation.bookSlot(slotResult.getValue());
      await this.consultationRepo.save(consultation);

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while booking consultation slot';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
