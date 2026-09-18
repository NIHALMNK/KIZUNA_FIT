export enum TrainerRequestStatus {
  REQUEST_PENDING = 'REQUEST_PENDING',
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  REQUEST_REJECTED = 'REQUEST_REJECTED',
  REQUEST_CANCELLED = 'REQUEST_CANCELLED',
  // Legacy / fallback strings if any
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum AcquisitionPipelineStatus {
  REQUEST_PENDING = 'REQUEST_PENDING',
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  CONSULTATION_PENDING = 'CONSULTATION_PENDING',
  CONSULTATION_BOOKED = 'CONSULTATION_BOOKED',
  CONSULTATION_COMPLETED = 'CONSULTATION_COMPLETED',
  OFFER_SENT = 'OFFER_SENT',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  SUBSCRIPTION_ACTIVE = 'SUBSCRIPTION_ACTIVE',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SUBSCRIPTION_COMPLETED = 'SUBSCRIPTION_COMPLETED',
  // Legacy / fallback strings
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  WITHDRAWN = 'WITHDRAWN',
  CLOSED = 'CLOSED',
}

export interface TrainerSnapshot {
  fullName: string;
  headline?: string;
  profileImage?: string;
  yearsOfExperience?: number;
  averageRating?: number;
  totalReviews?: number;
  specializations?: string[];
}

export interface TrainerRequestResponseDTO {
  requestId: string;
  pipelineId: string;
  clientId: string;
  trainerId: string;
  goal: string;
  message?: string;
  status: string;
  requestStatus: string;
  trainerSnapshot: TrainerSnapshot;
  submittedAt: string;
  respondedAt?: string;
  responseReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTrainerRequestsDTO {
  requests: TrainerRequestResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTrainerRequestPayload {
  trainerId: string;
  goal: string;
  message?: string;
}

export interface RejectTrainerRequestPayload {
  reason?: string;
}

export interface TrainerRequestsQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}
