import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { UserId } from '../value-objects/UserId';
import { VerificationToken } from '../value-objects/VerificationToken';
import { EmailAddress } from '../value-objects/EmailAddress';

export class PasswordResetRequestedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public user: { id: UserId; email: EmailAddress };
  public token: VerificationToken;

  constructor(user: { id: UserId; email: EmailAddress }, token: VerificationToken) {
    this.dateTimeOccurred = new Date();
    this.user = user;
    this.token = token;
  }

  public getAggregateId(): string {
    return this.user.id.value;
  }
}
