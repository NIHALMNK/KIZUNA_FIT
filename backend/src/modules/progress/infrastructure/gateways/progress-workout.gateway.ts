import {
  IProgressWorkoutGateway,
  WorkoutRecordSummary,
} from '../../application/ports/IProgressWorkoutGateway';
import { IWorkoutCompletionRepository } from '../../../workout/domain/repositories/workout-completion.repository.interface';
import { WorkoutCompletion } from '../../../workout/domain/aggregates/workout-completion.aggregate';

export class ProgressWorkoutGateway implements IProgressWorkoutGateway {
  constructor(private readonly workoutCompletionRepository: IWorkoutCompletionRepository) {}

  async getWorkoutRecordsForClient(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<WorkoutRecordSummary[]> {
    const records = await this.workoutCompletionRepository.findMany({
      clientId,
      fromDate,
      toDate,
      limit: 1000,
    });

    return records.map((r) => this.mapToSummary(r));
  }

  async getWorkoutRecordsForRelationship(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<WorkoutRecordSummary[]> {
    const records = await this.workoutCompletionRepository.findMany({
      coachingRelationshipId: relationshipId,
      fromDate,
      toDate,
      limit: 1000,
    });

    return records.map((r) => this.mapToSummary(r));
  }

  private mapToSummary(r: WorkoutCompletion): WorkoutRecordSummary {
    let completedSetsCount = 0;
    let totalVolumeKg = 0;

    for (const ex of r.completedExercises) {
      for (const s of ex.completedSets) {
        if (s.completed) {
          completedSetsCount++;
          const reps = s.completedReps || 0;
          const wt = s.weight || 0;
          totalVolumeKg += reps * wt;
        }
      }
    }

    const recordDate = r.completedAt || r.startedAt || r.createdAt;

    return {
      id: r.id,
      clientId: r.clientId,
      coachingRelationshipId: r.coachingRelationshipId,
      recordDate,
      status: r.status,
      completedSetsCount,
      totalVolumeKg,
      energyLevel: r.feedback?.energyLevel ?? null,
    };
  }
}
