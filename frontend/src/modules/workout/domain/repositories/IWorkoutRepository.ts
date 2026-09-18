import {
  Exercise,
  ExerciseStatus,
  DifficultyLevel,
  EquipmentType,
  PrimaryMuscleGroup,
  WorkoutProgram,
  WorkoutProgramStatus,
  WorkoutCompletion,
  WorkoutCompletionStatus,
  WorkoutHistoryStats,
} from '../types/workout.types';

export interface ExerciseFilterParams {
  category?: string;
  primaryMuscleGroup?: PrimaryMuscleGroup;
  equipment?: EquipmentType;
  difficulty?: DifficultyLevel;
  status?: ExerciseStatus;
  query?: string;
  search?: string;
  mine?: boolean;
  limit?: number;
  skip?: number;
}

export interface WorkoutProgramFilterParams {
  coachingRelationshipId?: string;
  trainerId?: string;
  clientId?: string;
  status?: WorkoutProgramStatus;
  limit?: number;
  skip?: number;
}

export interface WorkoutCompletionFilterParams {
  coachingRelationshipId?: string;
  workoutProgramId?: string;
  clientId?: string;
  trainerId?: string;
  workoutDay?: number;
  status?: WorkoutCompletionStatus;
  limit?: number;
  skip?: number;
}

export interface IWorkoutRepository {
  // Exercise operations
  listExercises(params?: ExerciseFilterParams): Promise<{ exercises: Exercise[]; total: number }>;
  getExercise(exerciseId: string): Promise<Exercise>;
  createExercise(data: Partial<Exercise>): Promise<Exercise>;
  updateExercise(exerciseId: string, data: Partial<Exercise>): Promise<Exercise>;
  deprecateExercise(exerciseId: string): Promise<Exercise>;
  reportExercise(
    exerciseId: string,
    data: { reason: string; details?: string },
  ): Promise<{ reportId: string; message: string }>;
  uploadExerciseMedia(
    file: File,
  ): Promise<{ url: string; resourceType: 'image' | 'video'; mimeType: string; sizeBytes: number }>;
  deleteExerciseMedia(fileUrl: string): Promise<void>;

  // Workout Program operations
  listPrograms(
    params?: WorkoutProgramFilterParams,
  ): Promise<{ programs: WorkoutProgram[]; total: number }>;
  getProgram(programId: string): Promise<WorkoutProgram>;
  getAssignedProgram(coachingRelationshipId?: string): Promise<WorkoutProgram | null>;
  createProgram(data: any): Promise<WorkoutProgram>;
  updateDraftProgram(programId: string, data: any): Promise<WorkoutProgram>;
  activateProgram(programId: string): Promise<WorkoutProgram>;
  duplicateProgram(programId: string, title?: string): Promise<WorkoutProgram>;
  getOrCreateDraftProgram(coachingRelationshipId: string): Promise<WorkoutProgram>;

  // Workout Completion operations
  listCompletions(
    params?: WorkoutCompletionFilterParams,
  ): Promise<{ completions: WorkoutCompletion[]; total: number }>;
  getCompletion(completionId: string): Promise<WorkoutCompletion>;
  getWorkoutHistory(clientId?: string, limit?: number): Promise<WorkoutHistoryStats>;
  startCompletion(data: {
    coachingRelationshipId: string;
    workoutProgramId: string;
    workoutDay: number;
  }): Promise<WorkoutCompletion>;
  updateExecution(completionId: string, data: any): Promise<WorkoutCompletion>;
  completeWorkout(completionId: string, data: any): Promise<WorkoutCompletion>;
}
