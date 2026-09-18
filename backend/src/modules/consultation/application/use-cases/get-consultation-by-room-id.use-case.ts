import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { GetConsultationByRoomIdQueryDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  ConsultationNotFoundException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class GetConsultationByRoomIdUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: GetConsultationByRoomIdQueryDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findByRoomId(dto.roomId);
      if (!consultation) {
        throw new ConsultationNotFoundException(dto.roomId);
      }

      const isParticipant =
        dto.userId === consultation.clientId || dto.userId === consultation.trainerId;
      if (!isParticipant) {
        throw new UnauthorizedConsultationParticipantException(
          dto.userId,
          consultation.consultationId,
        );
      }

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching consultation by roomId';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
