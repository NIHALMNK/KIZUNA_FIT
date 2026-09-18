import { AcquisitionPipelineStatus } from '../../domain/enums/acquisition-pipeline-status.enum';
import { TrainerRequestStatus } from '../../domain/enums/trainer-request-status.enum';
import { TrainerSnapshotProps } from '../../domain/value-objects/trainer-snapshot.value-object';

export interface TrainerRequestResponseDTO {
  requestId: string;
  pipelineId: string;
  clientId: string;
  trainerId: string;
  goal: string;
  message?: string;
  status: AcquisitionPipelineStatus;
  requestStatus: TrainerRequestStatus;
  trainerSnapshot: TrainerSnapshotProps;
  submittedAt: Date;
  respondedAt?: Date | null;
  responseReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTrainerRequestsResponseDTO {
  requests: TrainerRequestResponseDTO[];
  total: number;
  page: number;
  limit: number;
}
