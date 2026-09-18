import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly acquisitionPipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;

  constructor(
    consultationId: string,
    acquisitionPipelineId: string,
    clientId: string,
    trainerId: string,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
