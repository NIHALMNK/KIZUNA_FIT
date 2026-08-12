import { Result } from '../../../../shared/result/Result';
import { AppError } from '../../../../shared/exceptions/AppError';
import { IConsultationRepository } from '../../domain/repositories/consultation.repository';
import { IAcquisitionPipelineRepository } from '../../../marketplace/domain/repositories/acquisition-pipeline.repository';
import { AcquisitionPipelineStatus } from '../../../marketplace/domain/enums/acquisition-pipeline-status.enum';
import { Consultation } from '../../domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../domain/value-objects/consultation-slot.vo';
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
      const pipeline = await this.pipelineRepo.findById(dto.acquisitionPipelineId);
      if (!pipeline) {
        throw new PipelineNotFoundException(dto.acquisitionPipelineId);
      }

      if (pipeline.status !== AcquisitionPipelineStatus.ACCEPTED) {
        throw new PipelineNotAcceptedException(dto.acquisitionPipelineId, pipeline.status);
      }

      const isParticipant = dto.userId === pipeline.clientId || dto.userId === pipeline.trainerId;
      if (!isParticipant) {
        throw new UnauthorizedConsultationParticipantException(
          dto.userId,
          dto.acquisitionPipelineId,
        );
      }

      const existingConsultation = await this.consultationRepo.findByAcquisitionPipelineId(
        dto.acquisitionPipelineId,
      );
      if (existingConsultation) {
        throw new ConsultationAlreadyExistsException(dto.acquisitionPipelineId);
      }

      const slotResult = ConsultationSlot.create({
        scheduledStartAt: dto.scheduledStartAt,
        scheduledEndAt: dto.scheduledEndAt,
        timezone: dto.timezone,
      });

      if (slotResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(slotResult.error);
      }

      const consultationResult = Consultation.create({
        acquisitionPipelineId: pipeline.id,
        clientId: pipeline.clientId,
        trainerId: pipeline.trainerId,
        slot: slotResult.getValue(),
        platform: dto.platform,
      });

      if (consultationResult.isFailure) {
        return Result.fail<ConsultationResponseDTO>(consultationResult.error);
      }

      const consultation = consultationResult.getValue();
      await this.consultationRepo.save(consultation);

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
