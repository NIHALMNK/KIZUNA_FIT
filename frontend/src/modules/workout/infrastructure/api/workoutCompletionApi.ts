import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { WorkoutCompletion, WorkoutHistoryStats } from '../../domain/types/workout.types';
import { WorkoutCompletionFilterParams } from '../../domain/repositories/IWorkoutRepository';

export const workoutCompletionApi = {
  list: async (
    params?: WorkoutCompletionFilterParams,
  ): Promise<{ completions: WorkoutCompletion[]; total: number }> => {
    const res = await httpClient.get<any>('/workout-completions', { params });
    const completions: WorkoutCompletion[] = Array.isArray(res)
      ? res
      : res?.completions || res?.data || [];
    const total: number = Array.isArray(res)
      ? res.length
      : res?.total || res?.meta?.total || completions.length;
    return {
      completions,
      total,
    };
  },

  getById: async (completionId: string): Promise<WorkoutCompletion> => {
    const res = await httpClient.get<any>(`/workout-completions/${completionId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  getHistory: async (clientId?: string, limit?: number): Promise<WorkoutHistoryStats> => {
    const res = await httpClient.get<any>('/workout-completions/history', {
      params: { clientId, limit },
    });
    return res && res.data && !res.stats ? res.data : res;
  },

  start: async (payload: {
    coachingRelationshipId: string;
    workoutProgramId: string;
    workoutDay: number;
  }): Promise<WorkoutCompletion> => {
    const res = await httpClient.post<any>('/workout-completions', payload);
    return res && res.data && !res.id ? res.data : res;
  },

  updateExecution: async (completionId: string, payload: any): Promise<WorkoutCompletion> => {
    const res = await httpClient.patch<any>(`/workout-completions/${completionId}`, payload);
    return res && res.data && !res.id ? res.data : res;
  },

  complete: async (completionId: string, payload: any): Promise<WorkoutCompletion> => {
    const res = await httpClient.post<any>(
      `/workout-completions/${completionId}/complete`,
      payload,
    );
    return res && res.data && !res.id ? res.data : res;
  },
};
