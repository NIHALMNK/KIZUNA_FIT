import { Result } from '../../../../../shared/result/Result';
import { IAcquisitionPipelineRepository } from '../../../domain/repositories/acquisition-pipeline.repository';
import { GetTrainerRequestsQueryDTO } from '../../dto/get-trainer-requests.dto';
import { PaginatedTrainerRequestsResponseDTO } from '../../dto/trainer-request-response.dto';
import { AcquisitionPipelineMapper } from '../../mappers/acquisition-pipeline.mapper';
import { AppError } from '../../../../../shared/exceptions/AppError';

export class GetTrainerRequestHistoryUseCase {
  constructor(private readonly pipelineRepo: IAcquisitionPipelineRepository) {}

  public async execute(
    dto: GetTrainerRequestsQueryDTO,
  ): Promise<Result<PaginatedTrainerRequestsResponseDTO>> {
    try {
      const page = dto.page || 1;
      const limit = dto.limit || 10;
      const offset = (page - 1) * limit;

      const options = {
        status: dto.status,
        limit,
        offset,
        sort: dto.sort || 'newest',
      };

      const result = await this.pipelineRepo.findHistory(dto.userId, dto.isTrainer, options);

      return Result.ok<PaginatedTrainerRequestsResponseDTO>(
        AcquisitionPipelineMapper.toPaginatedDTO(result.pipelines, result.total, page, limit),
      );
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<PaginatedTrainerRequestsResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while fetching trainer request history';
      return Result.fail<PaginatedTrainerRequestsResponseDTO>(message);
    }
  }
}
