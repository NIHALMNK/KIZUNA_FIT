import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface CoachingTimelineProps {
  activatedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  refundedAt: Date | null;
  disputedAt: Date | null;
  expiredAt: Date | null;
}

/**
 * Embedded Value Object representing the immutable historical lifecycle timestamps
 * of a CoachingRelationship. Once written, timestamps cannot be mutated or erased.
 */
export class CoachingTimeline extends ValueObject<CoachingTimelineProps> {
  private constructor(props: CoachingTimelineProps) {
    super(props);
  }

  get activatedAt(): Date | null {
    return this.props.activatedAt;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get cancelledAt(): Date | null {
    return this.props.cancelledAt;
  }

  get refundedAt(): Date | null {
    return this.props.refundedAt;
  }

  get disputedAt(): Date | null {
    return this.props.disputedAt;
  }

  get expiredAt(): Date | null {
    return this.props.expiredAt;
  }

  public toPrimitives(): CoachingTimelineProps {
    return {
      activatedAt: this.props.activatedAt,
      completedAt: this.props.completedAt,
      cancelledAt: this.props.cancelledAt,
      refundedAt: this.props.refundedAt,
      disputedAt: this.props.disputedAt,
      expiredAt: this.props.expiredAt,
    };
  }

  public withActivatedAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      activatedAt: this.props.activatedAt ?? date,
    });
  }

  public withCompletedAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      completedAt: this.props.completedAt ?? date,
    });
  }

  public withCancelledAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      cancelledAt: this.props.cancelledAt ?? date,
    });
  }

  public withRefundedAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      refundedAt: this.props.refundedAt ?? date,
    });
  }

  public withDisputedAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      disputedAt: this.props.disputedAt ?? date,
    });
  }

  public withExpiredAt(date: Date = new Date()): CoachingTimeline {
    return new CoachingTimeline({
      ...this.props,
      expiredAt: this.props.expiredAt ?? date,
    });
  }

  public static create(props?: Partial<CoachingTimelineProps>): Result<CoachingTimeline> {
    return Result.ok<CoachingTimeline>(
      new CoachingTimeline({
        activatedAt: props?.activatedAt ?? null,
        completedAt: props?.completedAt ?? null,
        cancelledAt: props?.cancelledAt ?? null,
        refundedAt: props?.refundedAt ?? null,
        disputedAt: props?.disputedAt ?? null,
        expiredAt: props?.expiredAt ?? null,
      }),
    );
  }

  public static createActive(activatedAt: Date = new Date()): Result<CoachingTimeline> {
    return Result.ok<CoachingTimeline>(
      new CoachingTimeline({
        activatedAt,
        completedAt: null,
        cancelledAt: null,
        refundedAt: null,
        disputedAt: null,
        expiredAt: null,
      }),
    );
  }
}
