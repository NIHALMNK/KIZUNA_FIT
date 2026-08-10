import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  CreateTrainerRequestPayload,
  RejectTrainerRequestPayload,
  TrainerRequestResponseDTO,
  PaginatedTrainerRequestsDTO,
  TrainerRequestsQueryParams,
} from '../../domain/types';

export const marketplaceApi = {
  createRequest: (payload: CreateTrainerRequestPayload): Promise<TrainerRequestResponseDTO> => {
    return httpClient.post<TrainerRequestResponseDTO>('/trainer-requests', payload);
  },

  listRequests: (params?: TrainerRequestsQueryParams): Promise<PaginatedTrainerRequestsDTO> => {
    return httpClient.get<PaginatedTrainerRequestsDTO>('/trainer-requests', { params });
  },

  getPendingRequests: (
    params?: TrainerRequestsQueryParams,
  ): Promise<PaginatedTrainerRequestsDTO> => {
    return httpClient.get<PaginatedTrainerRequestsDTO>('/trainer-requests/pending', { params });
  },

  getRequestHistory: (
    params?: TrainerRequestsQueryParams,
  ): Promise<PaginatedTrainerRequestsDTO> => {
    return httpClient.get<PaginatedTrainerRequestsDTO>('/trainer-requests/history', { params });
  },

  getRequestById: (requestId: string): Promise<TrainerRequestResponseDTO> => {
    return httpClient.get<TrainerRequestResponseDTO>(`/trainer-requests/${requestId}`);
  },

  acceptRequest: (requestId: string): Promise<TrainerRequestResponseDTO> => {
    return httpClient.post<TrainerRequestResponseDTO>(`/trainer-requests/${requestId}/accept`);
  },

  rejectRequest: (
    requestId: string,
    payload?: RejectTrainerRequestPayload,
  ): Promise<TrainerRequestResponseDTO> => {
    return httpClient.post<TrainerRequestResponseDTO>(
      `/trainer-requests/${requestId}/reject`,
      payload || {},
    );
  },

  withdrawRequest: (requestId: string): Promise<TrainerRequestResponseDTO> => {
    return httpClient.post<TrainerRequestResponseDTO>(`/trainer-requests/${requestId}/withdraw`);
  },
};
