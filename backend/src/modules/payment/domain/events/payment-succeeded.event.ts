import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class PaymentSucceededEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly paymentId: string,
    public readonly offerId: string,
    public readonly acquisitionPipelineId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly totalAmount: number,
    public readonly trainerFee: number,
    public readonly platformFee: number,
    public readonly currency: string,
    public readonly subscriptionId: string,
    public readonly invoiceNumber: string,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.paymentId;
  }
}
