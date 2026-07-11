import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';

export class ExternalAuthenticationSucceededEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly data: {
    userId: string;
    provider: AuthProvider;
    providerUserId: string;
    occurredAt: Date;
  };

  constructor(userId: string, provider: AuthProvider, providerUserId: string) {
    this.dateTimeOccurred = new Date();
    this.data = {
      userId,
      provider,
      providerUserId,
      occurredAt: this.dateTimeOccurred,
    };
  }

  public getAggregateId(): string {
    return this.data.userId;
  }
}
