import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutRepository } from '../../infrastructure/repositories/WorkoutRepositoryImpl';
import { WORKOUT_QUERY_KEYS } from '../queryKeys';
import { Exercise } from '../../domain/types/workout.types';

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Exercise>) => workoutRepository.createExercise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.exercises() });
    },
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ exerciseId, data }: { exerciseId: string; data: Partial<Exercise> }) =>
      workoutRepository.updateExercise(exerciseId, data),
    onSuccess: (exercise) => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.exercises() });
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.exerciseDetail(exercise.id) });
    },
  });
};

export const useUploadExerciseMedia = () => {
  return useMutation({
    mutationFn: (file: File) => workoutRepository.uploadExerciseMedia(file),
  });
};

export const useDeleteExerciseMedia = () => {
  return useMutation({
    mutationFn: (fileUrl: string) => workoutRepository.deleteExerciseMedia(fileUrl),
  });
};

export const useReportExercise = () => {
  return useMutation({
    mutationFn: ({
      exerciseId,
      data,
    }: {
      exerciseId: string;
      data: { reason: string; details?: string };
    }) => workoutRepository.reportExercise(exerciseId, data),
  });
};

export const useGetOrCreateDraftProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coachingRelationshipId: string) =>
      workoutRepository.getOrCreateDraftProgram(coachingRelationshipId),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programs() });
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programDetail(program.id) });
    },
  });
};

export const useCreateWorkoutProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => workoutRepository.createProgram(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programs() });
    },
  });
};

export const useUpdateDraftWorkoutProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ programId, data }: { programId: string; data: any }) =>
      workoutRepository.updateDraftProgram(programId, data),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programs() });
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programDetail(program.id) });
    },
  });
};

export const useActivateWorkoutProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (programId: string) => workoutRepository.activateProgram(programId),
    onSuccess: (program) => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programs() });
      queryClient.invalidateQueries({
        queryKey: WORKOUT_QUERY_KEYS.assignedProgram(program.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programDetail(program.id) });
    },
  });
};

export const useDuplicateWorkoutProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ programId, title }: { programId: string; title?: string }) =>
      workoutRepository.duplicateProgram(programId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.programs() });
    },
  });
};

export const useStartWorkoutCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      coachingRelationshipId: string;
      workoutProgramId: string;
      workoutDay: number;
    }) => workoutRepository.startCompletion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.completions() });
    },
  });
};

export const useUpdateWorkoutExecution = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ completionId, data }: { completionId: string; data: any }) =>
      workoutRepository.updateExecution(completionId, data),
    onSuccess: (completion) => {
      queryClient.invalidateQueries({
        queryKey: WORKOUT_QUERY_KEYS.completionDetail(completion.id),
      });
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.completions() });
    },
  });
};

export const useCompleteWorkout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ completionId, data }: { completionId: string; data: any }) =>
      workoutRepository.completeWorkout(completionId, data),
    onSuccess: (completion) => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.completions() });
      queryClient.invalidateQueries({
        queryKey: WORKOUT_QUERY_KEYS.completionDetail(completion.id),
      });
      queryClient.invalidateQueries({
        queryKey: WORKOUT_QUERY_KEYS.workoutHistory(completion.clientId),
      });
    },
  });
};
