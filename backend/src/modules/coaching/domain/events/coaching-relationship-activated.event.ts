import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class CoachingRelationshipActivatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly relationshipId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly activatedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.relationshipId;
  }
}
