import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  CreateTrainerRequestPayload,
  RejectTrainerRequestPayload,
  TrainerRequestResponseDTO,
  PaginatedTrainerRequestsDTO,
  TrainerRequestsQueryParams,
} from '../../domain/types';

export const marketplaceApi = {
  createRequest: async (
    payload: CreateTrainerRequestPayload,
  ): Promise<TrainerRequestResponseDTO> => {
    const res = await httpClient.post<{ success: boolean; data: TrainerRequestResponseDTO }>(
      '/trainer-requests',
      payload,
    );
    return res.data;
  },

  listRequests: async (
    params?: TrainerRequestsQueryParams,
  ): Promise<PaginatedTrainerRequestsDTO> => {
    const res = await httpClient.get<{ success: boolean; data: PaginatedTrainerRequestsDTO }>(
      '/trainer-requests',
      { params },
    );
    return res.data;
  },

  getPendingRequests: async (
    params?: TrainerRequestsQueryParams,
  ): Promise<PaginatedTrainerRequestsDTO> => {
    const res = await httpClient.get<{ success: boolean; data: PaginatedTrainerRequestsDTO }>(
      '/trainer-requests/pending',
      { params },
    );
    return res.data;
  },

  getRequestHistory: async (
    params?: TrainerRequestsQueryParams,
  ): Promise<PaginatedTrainerRequestsDTO> => {
    const res = await httpClient.get<{ success: boolean; data: PaginatedTrainerRequestsDTO }>(
      '/trainer-requests/history',
      { params },
    );
    return res.data;
  },

  getRequestById: async (requestId: string): Promise<TrainerRequestResponseDTO> => {
    const res = await httpClient.get<{ success: boolean; data: TrainerRequestResponseDTO }>(
      `/trainer-requests/${requestId}`,
    );
    return res.data;
  },

  acceptRequest: async (requestId: string): Promise<TrainerRequestResponseDTO> => {
    const res = await httpClient.post<{ success: boolean; data: TrainerRequestResponseDTO }>(
      `/trainer-requests/${requestId}/accept`,
    );
    return res.data;
  },

  rejectRequest: async (
    requestId: string,
    payload?: RejectTrainerRequestPayload,
  ): Promise<TrainerRequestResponseDTO> => {
    const res = await httpClient.post<{ success: boolean; data: TrainerRequestResponseDTO }>(
      `/trainer-requests/${requestId}/reject`,
      payload || {},
    );
    return res.data;
  },

  withdrawRequest: async (requestId: string): Promise<TrainerRequestResponseDTO> => {
    const res = await httpClient.post<{ success: boolean; data: TrainerRequestResponseDTO }>(
      `/trainer-requests/${requestId}/withdraw`,
    );
    return res.data;
  },
};
