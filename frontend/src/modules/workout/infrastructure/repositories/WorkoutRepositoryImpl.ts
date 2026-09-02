import {
  IWorkoutRepository,
  ExerciseFilterParams,
  WorkoutProgramFilterParams,
  WorkoutCompletionFilterParams,
} from '../../domain/repositories/IWorkoutRepository';
import {
  Exercise,
  WorkoutProgram,
  WorkoutCompletion,
  WorkoutHistoryStats,
} from '../../domain/types/workout.types';
import { exerciseApi } from '../api/exerciseApi';
import { workoutProgramApi } from '../api/workoutProgramApi';
import { workoutCompletionApi } from '../api/workoutCompletionApi';

export class WorkoutRepositoryImpl implements IWorkoutRepository {
  // Exercise
  async listExercises(
    params?: ExerciseFilterParams,
  ): Promise<{ exercises: Exercise[]; total: number }> {
    return exerciseApi.list(params);
  }

  async getExercise(exerciseId: string): Promise<Exercise> {
    return exerciseApi.getById(exerciseId);
  }

  async createExercise(data: Partial<Exercise>): Promise<Exercise> {
    return exerciseApi.create(data);
  }

  async updateExercise(exerciseId: string, data: Partial<Exercise>): Promise<Exercise> {
    return exerciseApi.update(exerciseId, data);
  }

  async deprecateExercise(exerciseId: string): Promise<Exercise> {
    return exerciseApi.deprecate(exerciseId);
  }

  async reportExercise(
    exerciseId: string,
    data: { reason: string; details?: string },
  ): Promise<{ reportId: string; message: string }> {
    return exerciseApi.report(exerciseId, data);
  }

  async uploadExerciseMedia(file: File): Promise<{
    url: string;
    resourceType: 'image' | 'video';
    mimeType: string;
    sizeBytes: number;
  }> {
    return exerciseApi.uploadMedia(file);
  }

  async deleteExerciseMedia(fileUrl: string): Promise<void> {
    return exerciseApi.deleteMedia(fileUrl);
  }

  // Program
  async listPrograms(
    params?: WorkoutProgramFilterParams,
  ): Promise<{ programs: WorkoutProgram[]; total: number }> {
    return workoutProgramApi.list(params);
  }

  async getProgram(programId: string): Promise<WorkoutProgram> {
    return workoutProgramApi.getById(programId);
  }

  async getAssignedProgram(coachingRelationshipId?: string): Promise<WorkoutProgram | null> {
    return workoutProgramApi.getAssigned(coachingRelationshipId);
  }

  async createProgram(data: any): Promise<WorkoutProgram> {
    return workoutProgramApi.create(data);
  }

  async updateDraftProgram(programId: string, data: any): Promise<WorkoutProgram> {
    return workoutProgramApi.updateDraft(programId, data);
  }

  async activateProgram(programId: string): Promise<WorkoutProgram> {
    return workoutProgramApi.activate(programId);
  }

  async duplicateProgram(programId: string, title?: string): Promise<WorkoutProgram> {
    return workoutProgramApi.duplicate(programId, title);
  }

  async getOrCreateDraftProgram(coachingRelationshipId: string): Promise<WorkoutProgram> {
    return workoutProgramApi.getOrCreateDraft(coachingRelationshipId);
  }

  // Completion
  async listCompletions(
    params?: WorkoutCompletionFilterParams,
  ): Promise<{ completions: WorkoutCompletion[]; total: number }> {
    return workoutCompletionApi.list(params);
  }

  async getCompletion(completionId: string): Promise<WorkoutCompletion> {
    return workoutCompletionApi.getById(completionId);
  }

  async getWorkoutHistory(clientId?: string, limit?: number): Promise<WorkoutHistoryStats> {
    return workoutCompletionApi.getHistory(clientId, limit);
  }

  async startCompletion(data: {
    coachingRelationshipId: string;
    workoutProgramId: string;
    workoutDay: number;
  }): Promise<WorkoutCompletion> {
    return workoutCompletionApi.start(data);
  }

  async updateExecution(completionId: string, data: any): Promise<WorkoutCompletion> {
    return workoutCompletionApi.updateExecution(completionId, data);
  }

  async completeWorkout(completionId: string, data: any): Promise<WorkoutCompletion> {
    return workoutCompletionApi.complete(completionId, data);
  }
}

export const workoutRepository = new WorkoutRepositoryImpl();
