import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class CoachingRelationshipCompletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly relationshipId: string,
    public readonly paymentId: string,
    public readonly subscriptionId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly completedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.relationshipId;
  }
}
