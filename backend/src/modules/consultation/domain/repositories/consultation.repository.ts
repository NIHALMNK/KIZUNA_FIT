import { Consultation } from '../aggregates/consultation.aggregate';
import { ConsultationStatus } from '../enums/consultation-status.enum';

export interface FindConsultationsOptions {
  status?: ConsultationStatus;
  sort?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

export interface PaginatedConsultationsResult {
  consultations: Consultation[];
  total: number;
}

export interface IConsultationRepository {
  save(consultation: Consultation): Promise<void>;
  findById(id: string): Promise<Consultation | null>;
  findByAcquisitionPipelineId(acquisitionPipelineId: string): Promise<Consultation | null>;
  findByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findUpcomingByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findUpcomingByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findHistoryByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findHistoryByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult>;
  findByRoomId(roomId: string): Promise<Consultation | null>;
}
