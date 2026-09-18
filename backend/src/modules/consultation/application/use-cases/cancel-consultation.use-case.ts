import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { CancellationActor } from '../../domain/enums/cancellation-actor.enum';
import { CancelConsultationCommandDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  ConsultationNotFoundException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class CancelConsultationUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: CancelConsultationCommandDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findById(dto.consultationId);
      if (!consultation) {
        throw new ConsultationNotFoundException(dto.consultationId);
      }

      const isParticipant =
        dto.userId === consultation.clientId ||
        dto.userId === consultation.trainerId ||
        dto.cancelledBy === CancellationActor.ADMIN ||
        dto.cancelledBy === CancellationActor.SYSTEM;

      if (!isParticipant) {
        throw new UnauthorizedConsultationParticipantException(dto.userId, dto.consultationId);
      }

      consultation.cancel(dto.cancelledBy, dto.reason);
      await this.consultationRepo.save(consultation);

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while cancelling consultation';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
