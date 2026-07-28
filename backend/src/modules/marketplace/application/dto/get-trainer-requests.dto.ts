import { AcquisitionPipelineStatus } from '../../domain/enums/acquisition-pipeline-status.enum';

export interface GetTrainerRequestsQueryDTO {
  userId: string;
  isTrainer: boolean;
  status?: AcquisitionPipelineStatus;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}
