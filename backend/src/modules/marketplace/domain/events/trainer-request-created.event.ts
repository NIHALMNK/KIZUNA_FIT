import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class TrainerRequestCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly pipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly requestId: string;

  constructor(pipelineId: string, clientId: string, trainerId: string, requestId: string) {
    this.dateTimeOccurred = new Date();
    this.pipelineId = pipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.requestId = requestId;
  }

  public getAggregateId(): string {
    return this.pipelineId;
  }
}
