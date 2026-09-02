import { useQuery } from '@tanstack/react-query';
import { workoutRepository } from '../../infrastructure/repositories/WorkoutRepositoryImpl';
import { WorkoutProgramFilterParams } from '../../domain/repositories/IWorkoutRepository';
import { WORKOUT_QUERY_KEYS } from '../queryKeys';

export const useWorkoutPrograms = (params?: WorkoutProgramFilterParams) => {
  return useQuery({
    queryKey: WORKOUT_QUERY_KEYS.programList(params as Record<string, unknown>),
    queryFn: () => workoutRepository.listPrograms(params),
  });
};

export const useWorkoutProgram = (programId?: string) => {
  return useQuery({
    queryKey: programId
      ? WORKOUT_QUERY_KEYS.programDetail(programId)
      : ['workout', 'program', 'none'],
    queryFn: () => (programId ? workoutRepository.getProgram(programId) : Promise.reject('No ID')),
    enabled: !!programId,
  });
};

export const useActiveWorkoutProgram = (coachingRelationshipId?: string) => {
  return useQuery({
    queryKey: WORKOUT_QUERY_KEYS.assignedProgram(coachingRelationshipId),
    queryFn: () => workoutRepository.getAssignedProgram(coachingRelationshipId),
  });
};
