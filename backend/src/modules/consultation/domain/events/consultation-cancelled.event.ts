import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { CancellationActor } from '../enums/cancellation-actor.enum';

export class ConsultationCancelledEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;
  public readonly consultationId: string;
  public readonly clientId: string;
  public readonly trainerId: string;
  public readonly cancelledBy: CancellationActor;
  public readonly reason: string | null;

  constructor(
    consultationId: string,
    clientId: string,
    trainerId: string,
    cancelledBy: CancellationActor,
    reason?: string | null,
  ) {
    this.dateTimeOccurred = new Date();
    this.consultationId = consultationId;
    this.clientId = clientId;
    this.trainerId = trainerId;
    this.cancelledBy = cancelledBy;
    this.reason = reason || null;
  }

  public getAggregateId(): string {
    return this.consultationId;
  }
}
