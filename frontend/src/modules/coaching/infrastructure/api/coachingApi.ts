import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  CoachingRelationship,
  PaginatedCoachingResponse,
  CoachingQueryParams,
  CancelCoachingRequest,
} from '../../domain/types/coaching.types';

export const coachingApi = {
  list: async (params?: CoachingQueryParams): Promise<PaginatedCoachingResponse> => {
    return httpClient.get<PaginatedCoachingResponse>('/coaching-relationships', { params });
  },

  getActive: async (): Promise<{ relationships: CoachingRelationship[] }> => {
    return httpClient.get<{ relationships: CoachingRelationship[] }>(
      '/coaching-relationships/active',
    );
  },

  getHistory: async (params?: CoachingQueryParams): Promise<PaginatedCoachingResponse> => {
    return httpClient.get<PaginatedCoachingResponse>('/coaching-relationships/history', {
      params,
    });
  },

  getById: async (relationshipId: string): Promise<CoachingRelationship> => {
    return httpClient.get<CoachingRelationship>(`/coaching-relationships/${relationshipId}`);
  },

  activate: async (relationshipId: string): Promise<CoachingRelationship> => {
    return httpClient.post<CoachingRelationship>(
      `/coaching-relationships/${relationshipId}/activate`,
    );
  },

  complete: async (relationshipId: string): Promise<CoachingRelationship> => {
    return httpClient.post<CoachingRelationship>(
      `/coaching-relationships/${relationshipId}/complete`,
    );
  },

  cancel: async (
    relationshipId: string,
    payload: CancelCoachingRequest,
  ): Promise<CoachingRelationship> => {
    return httpClient.post<CoachingRelationship>(
      `/coaching-relationships/${relationshipId}/cancel`,
      payload,
    );
  },
};
