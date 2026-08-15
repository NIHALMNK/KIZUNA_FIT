import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationCompletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly acquisitionPipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly completedAt: Date;

  constructor(
    consultationId: string,
    acquisitionPipelineId: string,
    clientId: string,
    trainerId: string,
    completedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.completedAt = completedAt;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
