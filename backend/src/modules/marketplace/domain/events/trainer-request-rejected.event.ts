import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class TrainerRequestRejectedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly pipelineId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly reason?: string;

  constructor(pipelineId: string, clientId: string, trainerId: string, reason?: string) {
    this.dateTimeOccurred = new Date();
    this.pipelineId = pipelineId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.reason = reason;
  }

  public getAggregateId(): string {
    return this.pipelineId;
  }
}
