import { AcquisitionPipeline } from '../../domain/aggregates/acquisition-pipeline.aggregate';
import {
  TrainerRequestResponseDTO,
  PaginatedTrainerRequestsResponseDTO,
} from '../dto/trainer-request-response.dto';

export class AcquisitionPipelineMapper {
  public static toDTO(pipeline: AcquisitionPipeline): TrainerRequestResponseDTO {
    const request = pipeline.trainerRequest;
    const snapshot = pipeline.trainerSnapshot;

    return {
      requestId: request.requestId,
      pipelineId: pipeline.id,
      clientId: pipeline.clientId,
      trainerId: pipeline.trainerId,
      goal: request.clientGoal,
      message: request.clientMessage,
      status: pipeline.status,
      requestStatus: request.status,
      trainerSnapshot: snapshot.toPrimitives(),
      submittedAt: request.submittedAt,
      respondedAt: request.respondedAt,
      responseReason: request.responseReason,
      createdAt: pipeline.createdAt,
      updatedAt: pipeline.updatedAt,
    };
  }

  public static toPaginatedDTO(
    pipelines: AcquisitionPipeline[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedTrainerRequestsResponseDTO {
    return {
      requests: pipelines.map((p) => AcquisitionPipelineMapper.toDTO(p)),
      total,
      page,
      limit,
    };
  }
}
