import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { CoachingRelationshipStatus } from '../enums/coaching-relationship-status.enum';
import { CoachingTimeline } from '../value-objects/coaching-timeline.value-object';
import {
  CoachingRelationshipCreatedEvent,
  CoachingRelationshipActivatedEvent,
  CoachingRelationshipCompletedEvent,
  CoachingRelationshipCancelledEvent,
  CoachingRelationshipDisputedEvent,
  CoachingRelationshipRefundedEvent,
} from '../events';
import {
  InvalidCoachingTransitionException,
  UnauthorizedCoachingActionException,
  CoachingRelationshipImmutableException,
} from '../exceptions/coaching-domain.exceptions';

export interface CoachingRelationshipProps {
  acquisitionPipelineId: string;
  paymentId: string;
  subscriptionId: string;
  clientId: string;
  trainerId: string;
  status: CoachingRelationshipStatus;
  timeline: CoachingTimeline;
  cancellationReason?: string | null;
  version?: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Aggregate Root for the Coaching Domain.
 * Governs active and historical coaching contracts between trainers and clients (SM-07).
 */
export class CoachingRelationship extends AggregateRoot<CoachingRelationshipProps> {
  private constructor(props: CoachingRelationshipProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get acquisitionPipelineId(): string {
    return this.props.acquisitionPipelineId;
  }

  get paymentId(): string {
    return this.props.paymentId;
  }

  get subscriptionId(): string {
    return this.props.subscriptionId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get status(): CoachingRelationshipStatus {
    return this.props.status;
  }

  get timeline(): CoachingTimeline {
    return this.props.timeline;
  }

  get cancellationReason(): string | null {
    return this.props.cancellationReason ?? null;
  }

  get version(): number {
    return this.props.version ?? 0;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public isActive(): boolean {
    return this.props.status === CoachingRelationshipStatus.ACTIVE;
  }

  public isTerminal(): boolean {
    return (
      this.props.status === CoachingRelationshipStatus.COMPLETED ||
      this.props.status === CoachingRelationshipStatus.CANCELLED ||
      this.props.status === CoachingRelationshipStatus.REFUNDED ||
      this.props.status === CoachingRelationshipStatus.EXPIRED
    );
  }

  private ensureNotTerminal(action: string): void {
    if (this.isTerminal()) {
      throw new CoachingRelationshipImmutableException(this.id, this.props.status);
    }
  }

  /**
   * Activates a PENDING relationship (Admin/System fallback).
   */
  public activate(): Result<void> {
    this.ensureNotTerminal('activate');

    if (this.props.status !== CoachingRelationshipStatus.PENDING) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.ACTIVE,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.ACTIVE;
    this.props.timeline = this.props.timeline.withActivatedAt(now);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CoachingRelationshipActivatedEvent(
        this.id,
        this.props.clientId,
        this.props.trainerId,
        now,
      ),
    );

    return Result.ok<void>();
  }

  /**
   * Marks relationship as COMPLETED by assigned trainer upon program completion.
   */
  public complete(actorId: string): Result<void> {
    this.ensureNotTerminal('complete');

    if (actorId !== this.props.trainerId) {
      throw new UnauthorizedCoachingActionException(
        'complete',
        `User '${actorId}' is not the assigned trainer '${this.props.trainerId}' for this coaching relationship.`,
      );
    }

    if (this.props.status !== CoachingRelationshipStatus.ACTIVE) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.COMPLETED,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.COMPLETED;
    this.props.timeline = this.props.timeline.withCompletedAt(now);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CoachingRelationshipCompletedEvent(
        this.id,
        this.props.paymentId,
        this.props.subscriptionId,
        this.props.clientId,
        this.props.trainerId,
        now,
      ),
    );

    return Result.ok<void>();
  }

  /**
   * Prematurely terminates relationship by assigned trainer or admin.
   */
  public cancel(actorId: string, reason: string, isAdmin: boolean = false): Result<void> {
    this.ensureNotTerminal('cancel');

    if (!isAdmin && actorId !== this.props.trainerId) {
      throw new UnauthorizedCoachingActionException(
        'cancel',
        `User '${actorId}' is neither the assigned trainer nor an administrator.`,
      );
    }

    if (!reason || reason.trim().length === 0) {
      throw new UnauthorizedCoachingActionException(
        'cancel',
        'A valid cancellation reason must be provided.',
      );
    }

    if (this.props.status !== CoachingRelationshipStatus.ACTIVE) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.CANCELLED,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.CANCELLED;
    this.props.timeline = this.props.timeline.withCancelledAt(now);
    this.props.cancellationReason = reason.trim();
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CoachingRelationshipCancelledEvent(
        this.id,
        this.props.paymentId,
        this.props.clientId,
        this.props.trainerId,
        actorId,
        reason.trim(),
        now,
      ),
    );

    return Result.ok<void>();
  }

  /**
   * Freezes active relationship due to a payment/coaching dispute.
   */
  public freezeForDispute(disputeId: string): Result<void> {
    this.ensureNotTerminal('freezeForDispute');

    if (this.props.status !== CoachingRelationshipStatus.ACTIVE) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.DISPUTED,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.DISPUTED;
    this.props.timeline = this.props.timeline.withDisputedAt(now);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CoachingRelationshipDisputedEvent(
        this.id,
        this.props.paymentId,
        this.props.clientId,
        this.props.trainerId,
        disputeId,
        now,
      ),
    );

    return Result.ok<void>();
  }

  /**
   * Resolves an open dispute and resumes active coaching.
   */
  public resolveDispute(): Result<void> {
    if (this.props.status !== CoachingRelationshipStatus.DISPUTED) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.ACTIVE,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.ACTIVE;
    this.props.updatedAt = now;

    return Result.ok<void>();
  }

  /**
   * Terminates relationship upon approved exceptional service failure refund.
   */
  public markRefunded(refundId: string): Result<void> {
    if (
      this.props.status !== CoachingRelationshipStatus.ACTIVE &&
      this.props.status !== CoachingRelationshipStatus.DISPUTED
    ) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.REFUNDED,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.REFUNDED;
    this.props.timeline = this.props.timeline.withRefundedAt(now);
    this.props.updatedAt = now;

    this.addDomainEvent(
      new CoachingRelationshipRefundedEvent(
        this.id,
        this.props.paymentId,
        this.props.clientId,
        this.props.trainerId,
        refundId,
        now,
      ),
    );

    return Result.ok<void>();
  }

  /**
   * Expires relationship after duration elapsed without completion.
   */
  public expire(): Result<void> {
    this.ensureNotTerminal('expire');

    if (this.props.status !== CoachingRelationshipStatus.ACTIVE) {
      throw new InvalidCoachingTransitionException(
        this.props.status,
        CoachingRelationshipStatus.EXPIRED,
      );
    }

    const now = new Date();
    this.props.status = CoachingRelationshipStatus.EXPIRED;
    this.props.timeline = this.props.timeline.withExpiredAt(now);
    this.props.updatedAt = now;

    return Result.ok<void>();
  }

  /**
   * Factory: Direct creation in ACTIVE state upon PaymentSucceededEvent.
   */
  public static createDirectActive(
    props: {
      acquisitionPipelineId: string;
      paymentId: string;
      subscriptionId: string;
      clientId: string;
      trainerId: string;
    },
    id?: string,
  ): Result<CoachingRelationship> {
    if (!props.acquisitionPipelineId) {
      return Result.fail<CoachingRelationship>('acquisitionPipelineId is required.');
    }
    if (!props.paymentId) {
      return Result.fail<CoachingRelationship>('paymentId is required.');
    }
    if (!props.subscriptionId) {
      return Result.fail<CoachingRelationship>('subscriptionId is required.');
    }
    if (!props.clientId) {
      return Result.fail<CoachingRelationship>('clientId is required.');
    }
    if (!props.trainerId) {
      return Result.fail<CoachingRelationship>('trainerId is required.');
    }

    const now = new Date();
    const timeline = CoachingTimeline.createActive(now).getValue();
    const relationshipId = id || `rel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const relationship = new CoachingRelationship(
      {
        acquisitionPipelineId: props.acquisitionPipelineId,
        paymentId: props.paymentId,
        subscriptionId: props.subscriptionId,
        clientId: props.clientId,
        trainerId: props.trainerId,
        status: CoachingRelationshipStatus.ACTIVE,
        timeline,
        cancellationReason: null,
        version: 0,
        createdAt: now,
        updatedAt: now,
      },
      relationshipId,
    );

    relationship.addDomainEvent(
      new CoachingRelationshipCreatedEvent(
        relationship.id,
        relationship.acquisitionPipelineId,
        relationship.paymentId,
        relationship.subscriptionId,
        relationship.clientId,
        relationship.trainerId,
        CoachingRelationshipStatus.ACTIVE,
        now,
      ),
    );

    return Result.ok<CoachingRelationship>(relationship);
  }

  /**
   * Factory: Explicit creation in PENDING state (fallback/manual).
   */
  public static createPending(
    props: {
      acquisitionPipelineId: string;
      paymentId: string;
      subscriptionId: string;
      clientId: string;
      trainerId: string;
    },
    id?: string,
  ): Result<CoachingRelationship> {
    if (!props.acquisitionPipelineId) {
      return Result.fail<CoachingRelationship>('acquisitionPipelineId is required.');
    }
    if (!props.paymentId) {
      return Result.fail<CoachingRelationship>('paymentId is required.');
    }
    if (!props.subscriptionId) {
      return Result.fail<CoachingRelationship>('subscriptionId is required.');
    }
    if (!props.clientId) {
      return Result.fail<CoachingRelationship>('clientId is required.');
    }
    if (!props.trainerId) {
      return Result.fail<CoachingRelationship>('trainerId is required.');
    }

    const now = new Date();
    const timeline = CoachingTimeline.create().getValue();
    const relationshipId = id || `rel_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const relationship = new CoachingRelationship(
      {
        acquisitionPipelineId: props.acquisitionPipelineId,
        paymentId: props.paymentId,
        subscriptionId: props.subscriptionId,
        clientId: props.clientId,
        trainerId: props.trainerId,
        status: CoachingRelationshipStatus.PENDING,
        timeline,
        cancellationReason: null,
        version: 0,
        createdAt: now,
        updatedAt: now,
      },
      relationshipId,
    );

    relationship.addDomainEvent(
      new CoachingRelationshipCreatedEvent(
        relationship.id,
        relationship.acquisitionPipelineId,
        relationship.paymentId,
        relationship.subscriptionId,
        relationship.clientId,
        relationship.trainerId,
        CoachingRelationshipStatus.PENDING,
        null,
      ),
    );

    return Result.ok<CoachingRelationship>(relationship);
  }

  /**
   * Reconstitute aggregate from persistence.
   */
  public static reconstitute(props: CoachingRelationshipProps, id: string): CoachingRelationship {
    return new CoachingRelationship(props, id);
  }
}
