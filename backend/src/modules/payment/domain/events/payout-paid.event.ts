import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class PayoutPaidEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly paymentId: string,
    public readonly payoutId: string,
    public readonly trainerId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly gatewayPayoutId: string,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.paymentId;
  }
}
