import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationScheduledEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly acquisitionPipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly scheduledStartAt: Date;
  public readonly scheduledEndAt: Date;
  public readonly roomId: string;

  constructor(
    consultationId: string,
    acquisitionPipelineId: string,
    clientId: string,
    trainerId: string,
    scheduledStartAt: Date,
    scheduledEndAt: Date,
    roomId: string,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.acquisitionPipelineId = acquisitionPipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.scheduledStartAt = scheduledStartAt;
    this.scheduledEndAt = scheduledEndAt;
    this.roomId = roomId;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
