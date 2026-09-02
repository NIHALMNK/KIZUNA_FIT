import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { Exercise } from '../../domain/types/workout.types';
import { ExerciseFilterParams } from '../../domain/repositories/IWorkoutRepository';

export const exerciseApi = {
  list: async (
    params?: ExerciseFilterParams,
  ): Promise<{ exercises: Exercise[]; total: number }> => {
    const res = await httpClient.get<any>('/exercises', { params });
    const exercises: Exercise[] = Array.isArray(res) ? res : res?.exercises || res?.data || [];
    const total: number = Array.isArray(res)
      ? res.length
      : res?.total || res?.meta?.total || exercises.length;
    return {
      exercises,
      total,
    };
  },

  getById: async (exerciseId: string): Promise<Exercise> => {
    const res = await httpClient.get<any>(`/exercises/${exerciseId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  create: async (payload: Partial<Exercise>): Promise<Exercise> => {
    const res = await httpClient.post<any>('/exercises', payload);
    return res && res.data && !res.id ? res.data : res;
  },

  update: async (exerciseId: string, payload: Partial<Exercise>): Promise<Exercise> => {
    const res = await httpClient.patch<any>(`/exercises/${exerciseId}`, payload);
    return res && res.data && !res.id ? res.data : res;
  },

  deprecate: async (exerciseId: string): Promise<Exercise> => {
    const res = await httpClient.delete<any>(`/exercises/${exerciseId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  report: async (
    exerciseId: string,
    payload: { reason: string; details?: string },
  ): Promise<{ reportId: string; message: string }> => {
    const res = await httpClient.post<any>(`/exercises/${exerciseId}/report`, payload);
    return res && res.data && !res.reportId ? res.data : res;
  },

  uploadMedia: async (
    file: File,
  ): Promise<{
    url: string;
    resourceType: 'image' | 'video';
    mimeType: string;
    sizeBytes: number;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await httpClient.post<any>('/exercises/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res && res.data && !res.url ? res.data : res;
  },

  deleteMedia: async (fileUrl: string): Promise<void> => {
    await httpClient.delete<any>('/exercises/media', { data: { fileUrl } });
  },
};
