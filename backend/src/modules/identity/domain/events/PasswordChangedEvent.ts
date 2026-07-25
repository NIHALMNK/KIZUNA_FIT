import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { UserId } from '../value-objects/UserId';

export class PasswordChangedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: { id: UserId };

  constructor(user: { id: UserId }) {
    this.dateTimeOccurred = new Date();
    this.user = user;
  }

  public getAggregateId(): string {
    return this.user.id.value;
  }
}
