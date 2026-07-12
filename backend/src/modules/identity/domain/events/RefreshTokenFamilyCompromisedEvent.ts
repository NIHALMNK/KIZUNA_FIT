import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { UserId } from '../value-objects/UserId';

export class RefreshTokenFamilyCompromisedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public data: { sessionId: string; userId: UserId };

  constructor(data: { sessionId: string; userId: UserId }) {
    this.dateTimeOccurred = new Date();
    this.data = data;
  }

  public getAggregateId(): string {
    return this.data.sessionId;
  }
}
