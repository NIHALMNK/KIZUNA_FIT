import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ConsultationNoShowEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly clientId: string;
  public readonly trainerId: string;

  constructor(consultationId: string, clientId: string, trainerId: string) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.clientId = clientId;
    this.trainerId = trainerId;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
