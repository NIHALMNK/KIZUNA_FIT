import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

interface EventData {
  userId: string;
  provider: string;
  providerUserId: string;
}

export class ExternalIdentityLinkedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public data: EventData;

  constructor(data: EventData) {
    this.dateTimeOccurred = new Date();
    this.data = data;
  }

  public getAggregateId(): string {
    return this.data.userId;
  }
}
