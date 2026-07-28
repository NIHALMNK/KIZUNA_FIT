import { AcquisitionPipeline } from '../aggregates/acquisition-pipeline.aggregate';
import { AcquisitionPipelineStatus } from '../enums/acquisition-pipeline-status.enum';

export interface FindPipelinesOptions {
  status?: AcquisitionPipelineStatus;
  limit?: number;
  offset?: number;
  sort?: 'newest' | 'oldest';
}

export interface PaginatedPipelinesResult {
  pipelines: AcquisitionPipeline[];
  total: number;
}

/**
 * Domain Repository Interface for the AcquisitionPipeline Aggregate Root.
 * Zero dependency on Mongoose, MongoDB, or infrastructure details.
 */
export interface IAcquisitionPipelineRepository {
  save(pipeline: AcquisitionPipeline): Promise<void>;
  findById(id: string): Promise<AcquisitionPipeline | null>;
  findActivePipeline(clientId: string): Promise<AcquisitionPipeline | null>;
  findActivePipelineBetween(
    clientId: string,
    trainerId: string,
  ): Promise<AcquisitionPipeline | null>;
  findByClientId(
    clientId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult>;
  findByTrainerId(
    trainerId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult>;
  findPendingByTrainer(
    trainerId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult>;
  findHistory(
    userId: string,
    isTrainer: boolean,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult>;
}
