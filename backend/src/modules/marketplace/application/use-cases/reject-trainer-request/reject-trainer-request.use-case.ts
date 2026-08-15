import { Result } from '../../../../../shared/result/Result';
import { IAcquisitionPipelineRepository } from '../../../domain/repositories/acquisition-pipeline.repository';
import { PipelineOwnershipSpecification } from '../../../domain/specifications/pipeline-ownership.specification';
import { RejectTrainerRequestCommandDTO } from '../../dto/reject-trainer-request.dto';
import { TrainerRequestResponseDTO } from '../../dto/trainer-request-response.dto';
import { AcquisitionPipelineMapper } from '../../mappers/acquisition-pipeline.mapper';
import {
  TrainerRequestNotFoundException,
  UnauthorizedParticipantException,
} from '../../exceptions/application-exceptions';
import { AppError } from '../../../../../shared/exceptions/AppError';

export class RejectTrainerRequestUseCase {
  private readonly ownershipSpec = new PipelineOwnershipSpecification();

  constructor(private readonly pipelineRepo: IAcquisitionPipelineRepository) {}

  public async execute(
    dto: RejectTrainerRequestCommandDTO,
  ): Promise<Result<TrainerRequestResponseDTO>> {
    try {
      let pipeline = await this.pipelineRepo.findByRequestId(dto.requestId);
      if (!pipeline) {
        pipeline = await this.pipelineRepo.findById(dto.requestId);
      }

      if (!pipeline) {
        throw new TrainerRequestNotFoundException(dto.requestId);
      }

      const isTrainer = this.ownershipSpec.isTrainer(
        { clientId: pipeline.clientId, trainerId: pipeline.trainerId },
        dto.trainerId,
      );

      if (!isTrainer) {
        throw new UnauthorizedParticipantException(dto.trainerId, dto.requestId);
      }

      // Execute Aggregate Root state transition method
      pipeline.reject(dto.reason);

      // Persist updated aggregate
      await this.pipelineRepo.save(pipeline);

      return Result.ok<TrainerRequestResponseDTO>(AcquisitionPipelineMapper.toDTO(pipeline));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<TrainerRequestResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while rejecting trainer request';
      return Result.fail<TrainerRequestResponseDTO>(message);
    }
  }
}
