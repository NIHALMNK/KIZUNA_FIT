export interface WorkoutRecordSummary {
  id: string;
  clientId: string;
  coachingRelationshipId: string;
  recordDate: Date;
  status: string;
  completedSetsCount: number;
  totalVolumeKg: number;
  energyLevel: number | null;
}

export interface IProgressWorkoutGateway {
  getWorkoutRecordsForClient(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<WorkoutRecordSummary[]>;
  getWorkoutRecordsForRelationship(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<WorkoutRecordSummary[]>;
}
