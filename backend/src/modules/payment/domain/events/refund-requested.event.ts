import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class RefundRequestedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly paymentId: string,
    public readonly refundId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly amount: number,
    public readonly reason: string,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.paymentId;
  }
}
