import { useQuery } from '@tanstack/react-query';
import { workoutRepository } from '../../infrastructure/repositories/WorkoutRepositoryImpl';
import { ExerciseFilterParams } from '../../domain/repositories/IWorkoutRepository';
import { WORKOUT_QUERY_KEYS } from '../queryKeys';

export const useExercises = (params?: ExerciseFilterParams) => {
  return useQuery({
    queryKey: WORKOUT_QUERY_KEYS.exerciseList(params as Record<string, unknown>),
    queryFn: () => workoutRepository.listExercises(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useExercise = (exerciseId?: string) => {
  return useQuery({
    queryKey: exerciseId
      ? WORKOUT_QUERY_KEYS.exerciseDetail(exerciseId)
      : ['workout', 'exercise', 'none'],
    queryFn: () =>
      exerciseId ? workoutRepository.getExercise(exerciseId) : Promise.reject('No ID'),
    enabled: !!exerciseId,
  });
};
