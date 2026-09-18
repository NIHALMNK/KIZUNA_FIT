import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { ConsultationSlot } from '../../domain/value-objects/consultation-slot.vo';
import { MeetingDetails } from '../../domain/value-objects/meeting-details.vo';
import { ScheduleConsultationCommandDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  ConsultationNotFoundException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class ScheduleConsultationUseCase {
  constructor(private readonly consultationRepo: IConsultationRepository) {}

  public async execute(
    dto: ScheduleConsultationCommandDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      const consultation = await this.consultationRepo.findById(dto.consultationId);
      if (!consultation) {
        throw new ConsultationNotFoundException(dto.consultationId);
      }

      const isParticipant =
        dto.userId === consultation.clientId || dto.userId === consultation.trainerId;
      if (!isParticipant) {
        throw new UnauthorizedConsultationParticipantException(dto.userId, dto.consultationId);
      }

      const slotResult = ConsultationSlot.create({
        scheduledStartAt: dto.scheduledStartAt,
        scheduledEndAt: dto.scheduledEndAt,
        timezone: dto.timezone,
      });

      if (slotResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(slotResult.error);
      }

      let meetingDetails: MeetingDetails | undefined = undefined;
      if (dto.meetingDetails) {
        const detailsResult = MeetingDetails.create({
          platform: dto.meetingDetails.platform,
          roomId: dto.meetingDetails.roomId,
          meetingUrl: dto.meetingDetails.meetingUrl,
          joinCode: dto.meetingDetails.joinCode,
          instructions: dto.meetingDetails.instructions,
        });

        if (detailsResult.isFailure) {
          return Result.fail<ConsultationResponseDTO>(detailsResult.error);
        }
        meetingDetails = detailsResult.getValue();
      }

      consultation.schedule(slotResult.getValue(), dto.platform, meetingDetails);
      await this.consultationRepo.save(consultation);

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while scheduling consultation';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
