import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class PaymentProcessingEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly paymentId: string,
    public readonly providerOrderId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.paymentId;
  }
}
