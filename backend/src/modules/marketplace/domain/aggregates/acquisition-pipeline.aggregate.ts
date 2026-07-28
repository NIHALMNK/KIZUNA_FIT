import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { AcquisitionPipelineStatus } from '../enums/acquisition-pipeline-status.enum';
import { TrainerRequest } from '../entities/trainer-request.entity';
import { TrainerSnapshot } from '../value-objects/trainer-snapshot.value-object';
import { TrainerRequestCreatedEvent } from '../events/trainer-request-created.event';
import { TrainerRequestAcceptedEvent } from '../events/trainer-request-accepted.event';
import { TrainerRequestRejectedEvent } from '../events/trainer-request-rejected.event';
import { TrainerRequestWithdrawnEvent } from '../events/trainer-request-withdrawn.event';
import { AcquisitionPipelineClosedEvent } from '../events/acquisition-pipeline-closed.event';
import { InvalidPipelineTransitionException } from '../exceptions/invalid-pipeline-state-transition.exception';
import { RequestNotAcceptedException } from '../exceptions/request-not-accepted.exception';
import { PipelineAlreadyClosedException } from '../exceptions/pipeline-already-closed.exception';
import { ClientCannotRequestSelfException } from '../exceptions/client-cannot-request-self.exception';

export interface AcquisitionPipelineProps {
  clientId: string;
  trainerId: string;
  trainerRequest: TrainerRequest;
  trainerSnapshot: TrainerSnapshot;
  status: AcquisitionPipelineStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregate Root for the Marketplace Domain.
 * Sole consistency boundary managing the AcquisitionPipeline lifecycle, invariant enforcement,
 * and domain event registration.
 */
export class AcquisitionPipeline extends AggregateRoot<AcquisitionPipelineProps> {
  private constructor(props: AcquisitionPipelineProps, id: string) {
    super(props, id);
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get trainerRequest(): TrainerRequest {
    return this.props.trainerRequest;
  }

  get trainerSnapshot(): TrainerSnapshot {
    return this.props.trainerSnapshot;
  }

  get status(): AcquisitionPipelineStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --- State Guard & Predicate Methods ---

  public canAccept(): boolean {
    return this.props.status === AcquisitionPipelineStatus.REQUESTED;
  }

  public canReject(): boolean {
    return this.props.status === AcquisitionPipelineStatus.REQUESTED;
  }

  public canWithdraw(): boolean {
    return this.props.status === AcquisitionPipelineStatus.REQUESTED;
  }

  public canClose(): boolean {
    return this.props.status === AcquisitionPipelineStatus.ACCEPTED;
  }

  public isOpen(): boolean {
    const terminalStates = [
      AcquisitionPipelineStatus.REJECTED,
      AcquisitionPipelineStatus.WITHDRAWN,
      AcquisitionPipelineStatus.OFFER_DECLINED,
      AcquisitionPipelineStatus.CONVERTED,
      AcquisitionPipelineStatus.CLOSED,
    ];
    return !terminalStates.includes(this.props.status);
  }

  public isConverted(): boolean {
    return this.props.status === AcquisitionPipelineStatus.CONVERTED;
  }

  public canScheduleConsultation(): boolean {
    return this.props.status === AcquisitionPipelineStatus.ACCEPTED;
  }

  public canSendOffer(): boolean {
    return this.props.status === AcquisitionPipelineStatus.CONSULTATION_COMPLETED;
  }

  // --- Business Behavior & State Transition Methods ---

  /**
   * Trainer accepts the pending trainer request.
   * Throws Domain Exception on invalid transition.
   */
  public accept(): void {
    if (!this.canAccept()) {
      throw new InvalidPipelineTransitionException(this.props.status, 'accept');
    }

    this.props.trainerRequest.markAccepted();
    this.props.status = AcquisitionPipelineStatus.ACCEPTED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TrainerRequestAcceptedEvent(this._id, this.props.clientId, this.props.trainerId),
    );
  }

  /**
   * Trainer rejects the pending trainer request.
   * Throws Domain Exception on invalid transition.
   */
  public reject(reason?: string): void {
    if (!this.canReject()) {
      throw new InvalidPipelineTransitionException(this.props.status, 'reject');
    }

    this.props.trainerRequest.markRejected(reason);
    this.props.status = AcquisitionPipelineStatus.REJECTED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TrainerRequestRejectedEvent(this._id, this.props.clientId, this.props.trainerId, reason),
    );
  }

  /**
   * Client withdraws their pending trainer request before trainer response.
   * Throws Domain Exception on invalid transition.
   */
  public withdraw(): void {
    if (!this.canWithdraw()) {
      throw new InvalidPipelineTransitionException(this.props.status, 'withdraw');
    }

    this.props.trainerRequest.markWithdrawn();
    this.props.status = AcquisitionPipelineStatus.WITHDRAWN;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new TrainerRequestWithdrawnEvent(this._id, this.props.clientId, this.props.trainerId),
    );
  }

  /**
   * Trainer closes an accepted acquisition pipeline.
   * Throws Domain Exception on invalid transition.
   */
  public close(): void {
    if (this.props.status === AcquisitionPipelineStatus.CLOSED) {
      throw new PipelineAlreadyClosedException(this._id);
    }

    if (!this.canClose()) {
      throw new RequestNotAcceptedException(this._id, this.props.status);
    }

    this.props.status = AcquisitionPipelineStatus.CLOSED;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new AcquisitionPipelineClosedEvent(this._id, this.props.clientId, this.props.trainerId),
    );
  }

  // --- Downstream Workflow Transition Handlers ---

  public scheduleConsultation(): void {
    if (this.props.status !== AcquisitionPipelineStatus.ACCEPTED) {
      throw new InvalidPipelineTransitionException(this.props.status, 'scheduleConsultation');
    }
    this.props.status = AcquisitionPipelineStatus.CONSULTATION_SCHEDULED;
    this.props.updatedAt = new Date();
  }

  public completeConsultation(): void {
    if (this.props.status !== AcquisitionPipelineStatus.CONSULTATION_SCHEDULED) {
      throw new InvalidPipelineTransitionException(this.props.status, 'completeConsultation');
    }
    this.props.status = AcquisitionPipelineStatus.CONSULTATION_COMPLETED;
    this.props.updatedAt = new Date();
  }

  public sendOffer(): void {
    if (this.props.status !== AcquisitionPipelineStatus.CONSULTATION_COMPLETED) {
      throw new InvalidPipelineTransitionException(this.props.status, 'sendOffer');
    }
    this.props.status = AcquisitionPipelineStatus.OFFER_SENT;
    this.props.updatedAt = new Date();
  }

  public acceptOffer(): void {
    if (this.props.status !== AcquisitionPipelineStatus.OFFER_SENT) {
      throw new InvalidPipelineTransitionException(this.props.status, 'acceptOffer');
    }
    this.props.status = AcquisitionPipelineStatus.OFFER_ACCEPTED;
    this.props.updatedAt = new Date();
  }

  public declineOffer(): void {
    if (this.props.status !== AcquisitionPipelineStatus.OFFER_SENT) {
      throw new InvalidPipelineTransitionException(this.props.status, 'declineOffer');
    }
    this.props.status = AcquisitionPipelineStatus.OFFER_DECLINED;
    this.props.updatedAt = new Date();
  }

  public markPaymentCompleted(): void {
    if (this.props.status !== AcquisitionPipelineStatus.OFFER_ACCEPTED) {
      throw new InvalidPipelineTransitionException(this.props.status, 'markPaymentCompleted');
    }
    this.props.status = AcquisitionPipelineStatus.PAYMENT_COMPLETED;
    this.props.updatedAt = new Date();
  }

  public convert(): void {
    if (this.props.status !== AcquisitionPipelineStatus.PAYMENT_COMPLETED) {
      throw new InvalidPipelineTransitionException(this.props.status, 'convert');
    }
    this.props.status = AcquisitionPipelineStatus.CONVERTED;
    this.props.updatedAt = new Date();
  }

  // --- Factory / Creation Method ---

  public static create(
    props: {
      clientId: string;
      trainerId: string;
      trainerRequest: TrainerRequest;
      trainerSnapshot: TrainerSnapshot;
      status?: AcquisitionPipelineStatus;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<AcquisitionPipeline> {
    if (!props.clientId || props.clientId.trim() === '') {
      return Result.fail<AcquisitionPipeline>('AcquisitionPipeline requires a valid clientId');
    }

    if (!props.trainerId || props.trainerId.trim() === '') {
      return Result.fail<AcquisitionPipeline>('AcquisitionPipeline requires a valid trainerId');
    }

    if (props.clientId.trim() === props.trainerId.trim()) {
      throw new ClientCannotRequestSelfException(props.clientId.trim());
    }

    if (!props.trainerRequest) {
      return Result.fail<AcquisitionPipeline>(
        'AcquisitionPipeline requires a valid TrainerRequest entity',
      );
    }

    if (!props.trainerSnapshot) {
      return Result.fail<AcquisitionPipeline>(
        'AcquisitionPipeline requires a valid TrainerSnapshot value object',
      );
    }

    const pipelineId = id || `pipe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const isNew = !id;

    const pipelineProps: AcquisitionPipelineProps = {
      clientId: props.clientId.trim(),
      trainerId: props.trainerId.trim(),
      trainerRequest: props.trainerRequest,
      trainerSnapshot: props.trainerSnapshot,
      status: props.status || AcquisitionPipelineStatus.REQUESTED,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    const pipeline = new AcquisitionPipeline(pipelineProps, pipelineId);

    if (isNew) {
      pipeline.addDomainEvent(
        new TrainerRequestCreatedEvent(
          pipeline.id,
          pipeline.clientId,
          pipeline.trainerId,
          pipeline.trainerRequest.requestId,
        ),
      );
    }

    return Result.ok<AcquisitionPipeline>(pipeline);
  }
}
