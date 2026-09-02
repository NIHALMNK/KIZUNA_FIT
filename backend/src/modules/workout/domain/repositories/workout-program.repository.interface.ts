import { WorkoutProgram } from '../aggregates/workout-program.aggregate';
import { WorkoutProgramStatus } from '../enums';

export interface WorkoutProgramFilterOptions {
  coachingRelationshipId?: string;
  trainerId?: string;
  clientId?: string;
  status?: WorkoutProgramStatus;
  limit?: number;
  skip?: number;
}

export interface IWorkoutProgramRepository {
  findById(id: string): Promise<WorkoutProgram | null>;
  findActiveByRelationshipId(coachingRelationshipId: string): Promise<WorkoutProgram | null>;
  findDraftByRelationshipId(coachingRelationshipId: string): Promise<WorkoutProgram | null>;
  findHighestVersionNumber(coachingRelationshipId: string): Promise<number>;
  findActiveByClientId(clientId: string): Promise<WorkoutProgram | null>;
  findByRelationshipAndVersion(
    coachingRelationshipId: string,
    version: number,
  ): Promise<WorkoutProgram | null>;
  findMany(options?: WorkoutProgramFilterOptions): Promise<WorkoutProgram[]>;
  count(options?: WorkoutProgramFilterOptions): Promise<number>;
  save(program: WorkoutProgram): Promise<void>;
  deleteDraft(id: string): Promise<void>;
}
