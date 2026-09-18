import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { MarkConsultationNoShowCommandDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  ConsultationNotFoundException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class MarkConsultationNoShowUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: MarkConsultationNoShowCommandDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findById(dto.consultationId);
      if (!consultation) {
        throw new ConsultationNotFoundException(dto.consultationId);
      }

      if (dto.trainerId !== consultation.trainerId) {
        throw new UnauthorizedConsultationParticipantException(dto.trainerId, dto.consultationId);
      }

      consultation.markNoShow();
      await this.consultationRepo.save(consultation);

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while marking consultation no-show';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
