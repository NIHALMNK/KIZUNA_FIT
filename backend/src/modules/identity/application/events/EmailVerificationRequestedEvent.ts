import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

// Note: This acts as an Application Event / Integration Event, not a Domain Event.
// It carries the rawToken required by the Email Dispatcher to send the email.
export class EmailVerificationRequestedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly rawToken: string
  ) {
    this.dateTimeOccurred = new Date();
  }

  public getAggregateId(): string {
    return this.userId;
  }
}
