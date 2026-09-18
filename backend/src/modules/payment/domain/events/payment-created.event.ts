import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class PaymentCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly paymentId: string,
    public readonly offerId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly totalAmount: number,
    public readonly currency: string,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.paymentId;
  }
}
