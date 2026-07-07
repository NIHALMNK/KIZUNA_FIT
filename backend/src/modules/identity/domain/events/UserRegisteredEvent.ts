import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { UserId } from '../value-objects/UserId';
import { EmailAddress } from '../value-objects/EmailAddress';

export class UserRegisteredEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: { id: UserId; email: EmailAddress };

  constructor(user: { id: UserId; email: EmailAddress }) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  public getAggregateId(): string {
    return this.user.id.value;
  }
}
