import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class CoachingRelationshipRefundedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly relationshipId: string,
    public readonly paymentId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly refundId: string,
    public readonly refundedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.relationshipId;
  }
}
