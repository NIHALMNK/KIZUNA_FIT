import { Result } from '../../../../../shared/result/Result';
import { IAcquisitionPipelineRepository } from '../../../domain/repositories/acquisition-pipeline.repository';
import { PipelineOwnershipSpecification } from '../../../domain/specifications/pipeline-ownership.specification';
import { GetTrainerRequestQueryDTO } from '../../dto/get-trainer-request.dto';
import { TrainerRequestResponseDTO } from '../../dto/trainer-request-response.dto';
import { AcquisitionPipelineMapper } from '../../mappers/acquisition-pipeline.mapper';
import {
  TrainerRequestNotFoundException,
  UnauthorizedParticipantException,
} from '../../exceptions/application-exceptions';
import { AppError } from '../../../../../shared/exceptions/AppError';

export class GetTrainerRequestUseCase {
  private readonly ownershipSpec = new PipelineOwnershipSpecification();

  constructor(private readonly pipelineRepo: IAcquisitionPipelineRepository) {}

  public async execute(dto: GetTrainerRequestQueryDTO): Promise<Result<TrainerRequestResponseDTO>> {
    try {
      const pipeline = await this.pipelineRepo.findById(dto.requestId);

      if (!pipeline) {
        throw new TrainerRequestNotFoundException(dto.requestId);
      }

      const isParticipant = this.ownershipSpec.isSatisfiedBy(
        { clientId: pipeline.clientId, trainerId: pipeline.trainerId },
        dto.userId,
      );

      if (!isParticipant) {
        throw new UnauthorizedParticipantException(dto.userId, dto.requestId);
      }

      return Result.ok<TrainerRequestResponseDTO>(AcquisitionPipelineMapper.toDTO(pipeline));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<TrainerRequestResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching trainer request';
      return Result.fail<TrainerRequestResponseDTO>(message);
    }
  }
}
