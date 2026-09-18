import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationSlotBookedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly scheduledStartAt: Date;
  public readonly scheduledEndAt: Date;

  constructor(
    consultationId: string,
    clientId: string,
    trainerId: string,
    scheduledStartAt: Date,
    scheduledEndAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.scheduledStartAt = scheduledStartAt;
    this.scheduledEndAt = scheduledEndAt;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
