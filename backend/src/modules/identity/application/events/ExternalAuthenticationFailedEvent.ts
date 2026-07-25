import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';

export class ExternalAuthenticationFailedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly data: {
    email: string;
    provider: AuthProvider;
    providerUserId: string;
    reason: string;
    occurredAt: Date;
  };

  constructor(email: string, provider: AuthProvider, providerUserId: string, reason: string) {
    this.dateTimeOccurred = new Date();
    this.data = {
      email,
      provider,
      providerUserId,
      reason,
      occurredAt: this.dateTimeOccurred,
    };
  }

  public getAggregateId(): string {
    return this.data.providerUserId;
  }
}
