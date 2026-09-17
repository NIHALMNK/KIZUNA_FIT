import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  NutritionCompletion,
  NutritionCompletionFilterParams,
  StartNutritionCompletionDTO,
  UpdateNutritionCompletionDTO,
  CompleteNutritionCompletionDTO,
} from '../../domain/types/nutrition.types';

export const nutritionCompletionApi = {
  list: async (
    params?: NutritionCompletionFilterParams,
  ): Promise<{ completions: NutritionCompletion[]; total: number }> => {
    const res = await httpClient.get<any>('/nutrition-completions', { params });
    const completions: NutritionCompletion[] = Array.isArray(res)
      ? res
      : res?.completions || res?.data || [];
    const total: number = Array.isArray(res)
      ? res.length
      : res?.total || res?.meta?.total || completions.length;
    return { completions, total };
  },

  getById: async (completionId: string): Promise<NutritionCompletion> => {
    const res = await httpClient.get<any>(`/nutrition-completions/${completionId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  start: async (payload: StartNutritionCompletionDTO): Promise<NutritionCompletion> => {
    const res = await httpClient.post<any>('/nutrition-completions', payload);
    return res && res.data && !res.id ? res.data : res;
  },

  updateExecution: async (
    completionId: string,
    payload: UpdateNutritionCompletionDTO,
  ): Promise<NutritionCompletion> => {
    const res = await httpClient.patch<any>(`/nutrition-completions/${completionId}`, payload);
    return res && res.data && !res.id ? res.data : res;
  },

  complete: async (
    completionId: string,
    payload?: CompleteNutritionCompletionDTO,
  ): Promise<NutritionCompletion> => {
    const res = await httpClient.post<any>(
      `/nutrition-completions/${completionId}/complete`,
      payload || {},
    );
    return res && res.data && !res.id ? res.data : res;
  },
};
