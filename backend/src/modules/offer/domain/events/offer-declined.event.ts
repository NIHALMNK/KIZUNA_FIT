import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class OfferDeclinedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly offerId: string;
  public readonly acquisitionPipelineId: string;
  public readonly consultationId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly declinedAt: Date;
  public readonly reason?: string;

  constructor(
    offerId: string,
    acquisitionPipelineId: string,
    consultationId: string,
    clientId: string,
    trainerId: string,
    declinedAt: Date,
    reason?: string,
  ) {
    this.dateTimeOccurred = new Date();
    this.offerId = offerId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.consultationId = consultationId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.declinedAt = declinedAt;
    this.reason = reason;
  }

  public getAggregateId(): string {
    return this.offerId;
  }
}
