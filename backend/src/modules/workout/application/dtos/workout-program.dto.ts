import { ExerciseType, WorkoutGoal, WorkoutProgramStatus } from '../../domain/enums';
import { ExerciseSnapshotProps } from '../../domain/value-objects/exercise-snapshot.value-object';

export interface ExercisePrescriptionInputDto {
  order: number;
  exerciseId: string;
  type: ExerciseType;
  sets: number;
  reps: string;
  durationSeconds?: number | null;
  restSeconds: number;
  tempo?: string | null;
  notes?: string | null;
}

export interface WorkoutDayInputDto {
  id?: string;
  dayNumber: number;
  title: string;
  exercises: ExercisePrescriptionInputDto[];
}

export interface WorkoutWeekInputDto {
  id?: string;
  weekNumber: number;
  title: string;
  days: WorkoutDayInputDto[];
}

export interface CreateWorkoutProgramDto {
  coachingRelationshipId: string;
  title: string;
  description?: string | null;
  goal: WorkoutGoal;
  schedule: {
    weeks: number;
    sessionsPerWeek: number;
  };
  weeks?: WorkoutWeekInputDto[];
}

export interface UpdateDraftWorkoutProgramDto {
  title?: string;
  description?: string | null;
  goal?: WorkoutGoal;
  schedule?: {
    weeks: number;
    sessionsPerWeek: number;
  };
  weeks?: WorkoutWeekInputDto[];
}

export interface ExercisePrescriptionResponseDto {
  order: number;
  exercise: ExerciseSnapshotProps;
  type: ExerciseType;
  sets: number;
  reps: string;
  durationSeconds?: number | null;
  restSeconds: number;
  tempo?: string | null;
  notes?: string | null;
}

export interface WorkoutDayResponseDto {
  id: string;
  dayNumber: number;
  title: string;
  exercises: ExercisePrescriptionResponseDto[];
}

export interface WorkoutWeekResponseDto {
  id: string;
  weekNumber: number;
  title: string;
  days: WorkoutDayResponseDto[];
}

export interface WorkoutProgramResponseDto {
  id: string;
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  goal: WorkoutGoal;
  schedule: {
    weeks: number;
    sessionsPerWeek: number;
  };
  weeks: WorkoutWeekResponseDto[];
  status: WorkoutProgramStatus;
  activatedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
