import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { RefreshTokenId } from '../value-objects/RefreshTokenId';
import { TokenFamily } from '../value-objects/TokenFamily';
import { UserId } from '../value-objects/UserId';

export class RefreshTokenFamilyCompromisedEvent implements IDomainEvent {
  public dateTimeOccurred: Date;
  public session: { id: RefreshTokenId; family: TokenFamily; userId: UserId };

  constructor(session: { id: RefreshTokenId; family: TokenFamily; userId: UserId }) {
    this.dateTimeOccurred = new Date();
    this.session = session;
  }

  public getAggregateId(): string {
    return this.session.id.value;
  }
}
