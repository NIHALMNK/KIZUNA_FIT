import { CompletionSource, WorkoutCompletionStatus, WorkoutDifficulty } from '../../domain/enums';
import { WorkoutDaySnapshotProps } from '../../domain/value-objects/workout-day-snapshot.value-object';
import { CompletedSetProps } from '../../domain/value-objects/completed-set.value-object';
import { WorkoutFeedbackProps } from '../../domain/value-objects/workout-feedback.value-object';

export interface CompletedSetInputDto {
  setNumber: number;
  plannedReps: string;
  completedReps: number;
  weight: number;
  completed: boolean;
  notes?: string | null;
}

export interface CompletedExerciseInputDto {
  id?: string;
  exerciseId: string;
  exerciseName: string;
  completedSets: CompletedSetInputDto[];
  notes?: string | null;
}

export interface WorkoutFeedbackInputDto {
  difficulty: WorkoutDifficulty;
  energyLevel: number;
  notes?: string | null;
}

export interface StartWorkoutCompletionDto {
  coachingRelationshipId: string;
  workoutProgramId: string;
  workoutDay: number;
}

export interface UpdateWorkoutExecutionDto {
  completedExercises: CompletedExerciseInputDto[];
  feedback?: WorkoutFeedbackInputDto | null;
}

export interface CompleteWorkoutDto {
  completedExercises: CompletedExerciseInputDto[];
  feedback?: WorkoutFeedbackInputDto | null;
  completedAt?: Date;
}

export interface CompletedExerciseResponseDto {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedSets: CompletedSetProps[];
  notes?: string | null;
}

export interface WorkoutCompletionResponseDto {
  id: string;
  coachingRelationshipId: string;
  workoutProgramId: string;
  clientId: string;
  trainerId: string;
  workoutDay: number;
  workoutDaySnapshot: WorkoutDaySnapshotProps;
  completedExercises: CompletedExerciseResponseDto[];
  feedback?: WorkoutFeedbackProps | null;
  status: WorkoutCompletionStatus;
  startedAt: string;
  completedAt?: string | null;
  completedBy: CompletionSource;
  createdAt: string;
  updatedAt: string;
}
