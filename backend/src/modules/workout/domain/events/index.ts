import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { WorkoutProgramStatus } from '../enums';

export class WorkoutProgramCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly programId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly status: WorkoutProgramStatus,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.programId;
  }
}

export class WorkoutProgramActivatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly programId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly activatedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.programId;
  }
}

export class WorkoutCompletionStartedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly completionId: string,
    public readonly coachingRelationshipId: string,
    public readonly workoutProgramId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly workoutDay: number,
    public readonly startedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.completionId;
  }
}

export class WorkoutCompletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly completionId: string,
    public readonly coachingRelationshipId: string,
    public readonly workoutProgramId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly workoutDay: number,
    public readonly completedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.completionId;
  }
}
