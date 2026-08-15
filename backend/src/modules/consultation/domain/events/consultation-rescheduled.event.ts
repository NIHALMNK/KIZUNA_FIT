import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationRescheduledEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly acquisitionPipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly scheduledStartAt: Date;
  public readonly scheduledEndAt: Date;
  public readonly timezone: string;

  constructor(
    consultationId: string,
    acquisitionPipelineId: string,
    clientId: string,
    trainerId: string,
    scheduledStartAt: Date,
    scheduledEndAt: Date,
    timezone: string,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.scheduledStartAt = scheduledStartAt;
    this.scheduledEndAt = scheduledEndAt;
    this.timezone = timezone;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
