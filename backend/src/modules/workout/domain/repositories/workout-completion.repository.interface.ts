import { WorkoutCompletion } from '../aggregates/workout-completion.aggregate';
import { WorkoutCompletionStatus } from '../enums';

export interface WorkoutCompletionFilterOptions {
  coachingRelationshipId?: string;
  workoutProgramId?: string;
  clientId?: string;
  trainerId?: string;
  workoutDay?: number;
  status?: WorkoutCompletionStatus;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  skip?: number;
}

export interface IWorkoutCompletionRepository {
  findById(id: string): Promise<WorkoutCompletion | null>;
  findLatestByProgramAndDay(
    workoutProgramId: string,
    workoutDay: number,
  ): Promise<WorkoutCompletion | null>;
  findActiveSession(
    clientId: string,
    workoutProgramId: string,
    workoutDay: number,
  ): Promise<WorkoutCompletion | null>;
  findMany(options?: WorkoutCompletionFilterOptions): Promise<WorkoutCompletion[]>;
  count(options?: WorkoutCompletionFilterOptions): Promise<number>;
  save(completion: WorkoutCompletion): Promise<void>;
}
