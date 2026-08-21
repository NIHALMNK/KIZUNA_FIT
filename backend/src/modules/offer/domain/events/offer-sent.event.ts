import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class OfferSentEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly offerId: string;
  public readonly acquisitionPipelineId: string;
  public readonly consultationId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly expiresAt: Date;

  constructor(
    offerId: string,
    acquisitionPipelineId: string,
    consultationId: string,
    clientId: string,
    trainerId: string,
    expiresAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
    this.offerId = offerId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.consultationId = consultationId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.expiresAt = expiresAt;
  }

  public getAggregateId(): string {
    return this.offerId;
  }
}
