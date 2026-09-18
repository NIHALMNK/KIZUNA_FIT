import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { WorkoutProgram } from '../../domain/types/workout.types';
import { WorkoutProgramFilterParams } from '../../domain/repositories/IWorkoutRepository';

export const workoutProgramApi = {
  list: async (
    params?: WorkoutProgramFilterParams,
  ): Promise<{ programs: WorkoutProgram[]; total: number }> => {
    const res = await httpClient.get<any>('/workout-programs', { params });
    const programs: WorkoutProgram[] = Array.isArray(res) ? res : res?.programs || res?.data || [];
    const total: number = Array.isArray(res)
      ? res.length
      : res?.total || res?.meta?.total || programs.length;
    return {
      programs,
      total,
    };
  },

  getById: async (programId: string): Promise<WorkoutProgram> => {
    const res = await httpClient.get<any>(`/workout-programs/${programId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  getAssigned: async (coachingRelationshipId?: string): Promise<WorkoutProgram | null> => {
    const res = await httpClient.get<any>('/workout-programs/assigned', {
      params: coachingRelationshipId ? { coachingRelationshipId } : undefined,
    });
    const data = res && res.data && !res.id ? res.data : res;
    return data || null;
  },

  create: async (payload: any): Promise<WorkoutProgram> => {
    const res = await httpClient.post<any>('/workout-programs', payload);
    return res && res.data && !res.id ? res.data : res;
  },

  updateDraft: async (programId: string, payload: any): Promise<WorkoutProgram> => {
    const res = await httpClient.patch<any>(`/workout-programs/${programId}`, payload);
    return res && res.data && !res.id ? res.data : res;
  },

  activate: async (programId: string): Promise<WorkoutProgram> => {
    const res = await httpClient.post<any>(`/workout-programs/${programId}/publish`);
    return res && res.data && !res.id ? res.data : res;
  },

  duplicate: async (programId: string, title?: string): Promise<WorkoutProgram> => {
    const res = await httpClient.post<any>(`/workout-programs/${programId}/duplicate`, { title });
    return res && res.data && !res.id ? res.data : res;
  },

  getOrCreateDraft: async (coachingRelationshipId: string): Promise<WorkoutProgram> => {
    const res = await httpClient.post<any>(
      `/workout-programs/relationship/${coachingRelationshipId}/edit-draft`,
    );
    return res && res.data && !res.id ? res.data : res;
  },
};
