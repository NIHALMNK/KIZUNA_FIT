import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { CoachingRelationshipStatus } from '../enums/coaching-relationship-status.enum';

export class CoachingRelationshipCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly relationshipId: string,
    public readonly acquisitionPipelineId: string,
    public readonly paymentId: string,
    public readonly subscriptionId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly status: CoachingRelationshipStatus,
    public readonly activatedAt: Date | null,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.relationshipId;
  }
}
