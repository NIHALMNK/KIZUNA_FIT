import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { IAcquisitionPipelineRepository } from '../../../marketplace/domain/repositories/acquisition-pipeline.repository';
import { AcquisitionPipelineStatus } from '../../../marketplace/domain/enums/acquisition-pipeline-status.enum';
import { Consultation } from '../../domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../domain/value-objects/consultation-slot.vo';
import { ConsultationPlatform } from '../../domain/enums/consultation-platform.enum';
import { CreateConsultationCommandDTO } from '../dtos/consultation-command.dto';
import { ConsultationResponseDTO } from '../dtos/consultation-response.dto';
import { ConsultationDTOMapper } from '../mappers/consultation-dto.mapper';
import {
  PipelineNotFoundException,
  PipelineNotAcceptedException,
  ConsultationAlreadyExistsException,
  UnauthorizedConsultationParticipantException,
} from '../exceptions/application-exceptions';

export class CreateConsultationUseCase {
  constructor(
    private readonly consultationRepo: IConsultationRepository,
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
  ) {}

  public async execute(
    dto: CreateConsultationCommandDTO,
  ): Promise<Result<ConsultationResponseDTO>> {
    try {
      // 1. Resolve trainerRequestId ONLY through findByRequestId
      const pipeline = await this.pipelineRepo.findByRequestId(dto.trainerRequestId);
      if (!pipeline) {
        return Result.fail<ConsultationResponseDTO>(
          `Trainer request not found with ID: ${dto.trainerRequestId}`,
        );
      }

      // 2. Verify pipeline is in ACCEPTED status
      if (pipeline.status !== AcquisitionPipelineStatus.ACCEPTED) {
        throw new PipelineNotAcceptedException(pipeline.id, pipeline.status);
      }

      // 3. Verify participant authorization
      const isParticipant = dto.userId === pipeline.clientId || dto.userId === pipeline.trainerId;
      if (!isParticipant) {
        throw new UnauthorizedConsultationParticipantException(dto.userId, pipeline.id);
      }

      // 4. Verify no consultation already exists for this pipeline
      const existingConsultation = await this.consultationRepo.findByAcquisitionPipelineId(
        pipeline.id,
      );
      if (existingConsultation) {
        throw new ConsultationAlreadyExistsException(pipeline.id);
      }

      // 5. Convert scheduledAt + duration to start and end dates
      const scheduledStartAt = new Date(dto.scheduledAt);
      if (isNaN(scheduledStartAt.getTime())) {
        return Result.fail<ConsultationResponseDTO>('Invalid scheduledAt date format');
      }

      if (scheduledStartAt.getTime() <= Date.now()) {
        return Result.fail<ConsultationResponseDTO>('scheduledAt must be a future date and time');
      }

      const scheduledEndAt = new Date(scheduledStartAt.getTime() + dto.duration * 60 * 1000);

      // 6. Map meetingMode to ConsultationPlatform
      let platform: ConsultationPlatform;
      if (dto.meetingMode === 'VIDEO_CALL') {
        platform = ConsultationPlatform.WEBRTC;
      } else if (dto.meetingMode === 'PHONE_CALL') {
        return Result.fail<ConsultationResponseDTO>(
          'PHONE_CALL is not currently supported by the video consultation system. Please select VIDEO_CALL.',
        );
      } else {
        return Result.fail<ConsultationResponseDTO>(`Unsupported meetingMode: ${dto.meetingMode}`);
      }

      // 7. Derive timezone from scheduling context or system environment
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

      // 8. Create ConsultationSlot value object
      const slotResult = ConsultationSlot.create({
        scheduledStartAt,
        scheduledEndAt,
        timezone,
      });

      if (slotResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(slotResult.error);
      }

      // 9. Create Consultation aggregate
      const consultationResult = Consultation.create({
        acquisitionPipelineId: pipeline.id,
        clientId: pipeline.clientId,
        trainerId: pipeline.trainerId,
        slot: slotResult.getValue(),
        platform,
      });

      if (consultationResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(consultationResult.error);
      }

      const consultation = consultationResult.getValue();
      await this.consultationRepo.save(consultation);

      // 10. Transition AcquisitionPipeline to CONSULTATION_SCHEDULED
      pipeline.scheduleConsultation();
      await this.pipelineRepo.save(pipeline);

      return Result.ok<ConsultationResponseDTO>(ConsultationDTOMapper.toDTO(consultation));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<ConsultationResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating consultation';
      return Result.fail<ConsultationResponseDTO>(message);
    }
  }
}
