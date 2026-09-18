import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { ProgressAnalytics, ProgressQueryParams } from '../../domain/types/progress.types';

export const progressApi = {
  getMyProgress: async (params?: ProgressQueryParams): Promise<ProgressAnalytics> => {
    return httpClient.get<ProgressAnalytics>('/progress/my', { params });
  },

  getRelationshipProgress: async (
    relationshipId: string,
    params?: ProgressQueryParams,
  ): Promise<ProgressAnalytics> => {
    return httpClient.get<ProgressAnalytics>(`/progress/relationship/${relationshipId}`, {
      params,
    });
  },
};
