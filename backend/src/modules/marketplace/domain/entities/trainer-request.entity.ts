import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { TrainerRequestStatus } from '../enums/trainer-request-status.enum';

export interface TrainerRequestProps {
  clientGoal: string;
  clientMessage?: string;
  status: TrainerRequestStatus;
  submittedAt: Date;
  respondedAt?: Date | null;
  responseReason?: string | null;
}

/**
 * Embedded Child Entity representing the client's initial coaching request.
 * Managed exclusively by the AcquisitionPipeline Aggregate Root.
 */
export class TrainerRequest extends Entity<TrainerRequestProps> {
  private constructor(props: TrainerRequestProps, id: string) {
    super(props, id);
  }

  get requestId(): string {
    return this._id;
  }

  get clientGoal(): string {
    return this.props.clientGoal;
  }

  get clientMessage(): string | undefined {
    return this.props.clientMessage;
  }

  get status(): TrainerRequestStatus {
    return this.props.status;
  }

  get submittedAt(): Date {
    return this.props.submittedAt;
  }

  get respondedAt(): Date | null | undefined {
    return this.props.respondedAt;
  }

  get responseReason(): string | null | undefined {
    return this.props.responseReason;
  }

  /**
   * Internal state transition managed by AcquisitionPipeline Aggregate Root.
   */
  public markAccepted(): void {
    this.props.status = TrainerRequestStatus.ACCEPTED;
    this.props.respondedAt = new Date();
  }

  /**
   * Internal state transition managed by AcquisitionPipeline Aggregate Root.
   */
  public markRejected(reason?: string): void {
    this.props.status = TrainerRequestStatus.REJECTED;
    this.props.respondedAt = new Date();
    this.props.responseReason = reason ? reason.trim() : null;
  }

  /**
   * Internal state transition managed by AcquisitionPipeline Aggregate Root.
   */
  public markWithdrawn(): void {
    this.props.status = TrainerRequestStatus.WITHDRAWN;
  }

  public static create(
    props: {
      clientGoal: string;
      clientMessage?: string;
      status?: TrainerRequestStatus;
      submittedAt?: Date;
      respondedAt?: Date | null;
      responseReason?: string | null;
    },
    id?: string,
  ): Result<TrainerRequest> {
    if (!props.clientGoal || props.clientGoal.trim().length < 3) {
      return Result.fail<TrainerRequest>('clientGoal must be at least 3 characters long');
    }

    if (props.clientGoal.trim().length > 100) {
      return Result.fail<TrainerRequest>('clientGoal cannot exceed 100 characters');
    }

    if (props.clientMessage && props.clientMessage.trim().length > 1000) {
      return Result.fail<TrainerRequest>('clientMessage cannot exceed 1000 characters');
    }

    const requestId = id || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const requestProps: TrainerRequestProps = {
      clientGoal: props.clientGoal.trim(),
      clientMessage: props.clientMessage ? props.clientMessage.trim() : undefined,
      status: props.status || TrainerRequestStatus.PENDING,
      submittedAt: props.submittedAt || new Date(),
      respondedAt: props.respondedAt || null,
      responseReason: props.responseReason || null,
    };

    return Result.ok<TrainerRequest>(new TrainerRequest(requestProps, requestId));
  }
}
