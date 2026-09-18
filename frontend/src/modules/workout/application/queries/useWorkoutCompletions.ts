import { useQuery } from '@tanstack/react-query';
import { workoutRepository } from '../../infrastructure/repositories/WorkoutRepositoryImpl';
import { WorkoutCompletionFilterParams } from '../../domain/repositories/IWorkoutRepository';
import { WORKOUT_QUERY_KEYS } from '../queryKeys';

export const useWorkoutCompletions = (params?: WorkoutCompletionFilterParams) => {
  return useQuery({
    queryKey: WORKOUT_QUERY_KEYS.completionList(params as Record<string, unknown>),
    queryFn: () => workoutRepository.listCompletions(params),
  });
};

export const useWorkoutCompletion = (completionId?: string) => {
  return useQuery({
    queryKey: completionId
      ? WORKOUT_QUERY_KEYS.completionDetail(completionId)
      : ['workout', 'completion', 'none'],
    queryFn: () =>
      completionId ? workoutRepository.getCompletion(completionId) : Promise.reject('No ID'),
    enabled: !!completionId,
  });
};

export const useWorkoutHistory = (clientId?: string, limit?: number) => {
  return useQuery({
    queryKey: WORKOUT_QUERY_KEYS.workoutHistory(clientId),
    queryFn: () => workoutRepository.getWorkoutHistory(clientId, limit),
  });
};
