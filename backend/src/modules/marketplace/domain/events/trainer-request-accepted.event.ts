import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class TrainerRequestAcceptedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly pipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;

  constructor(pipelineId: string, clientId: string, trainerId: string) {
    this.dateTimeOccurred = new Date();
    this.pipelineId = pipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
  }

  public getAggregateId(): string {
    return this.pipelineId;
  }
}
