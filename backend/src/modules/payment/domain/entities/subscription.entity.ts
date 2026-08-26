import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export interface SubscriptionProps {
  status: SubscriptionStatus;
  coachingRelationshipId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  sessionsIncluded: number;
  sessionsRemaining: number;
  activatedAt?: Date | null;
  completedAt?: Date | null;
}

/**
 * Entity representing the coaching service authorization and access lifecycle
 * tied to a verified successful payment.
 */
export class Subscription extends Entity<SubscriptionProps> {
  private constructor(props: SubscriptionProps, id: string) {
    super(props, id);
  }

  get subscriptionId(): string {
    return this._id;
  }

  get status(): SubscriptionStatus {
    return this.props.status;
  }

  get coachingRelationshipId(): string | null | undefined {
    return this.props.coachingRelationshipId;
  }

  get startDate(): Date | null | undefined {
    return this.props.startDate;
  }

  get endDate(): Date | null | undefined {
    return this.props.endDate;
  }

  get sessionsIncluded(): number {
    return this.props.sessionsIncluded;
  }

  get sessionsRemaining(): number {
    return this.props.sessionsRemaining;
  }

  get activatedAt(): Date | null | undefined {
    return this.props.activatedAt;
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  public activate(startDate: Date, endDate: Date, coachingRelationshipId?: string): void {
    if (this.props.status !== SubscriptionStatus.PENDING) {
      throw new Error(
        `Cannot activate subscription from state '${this.props.status}'. Must be in 'PENDING'.`,
      );
    }
    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.startDate = startDate;
    this.props.endDate = endDate;
    this.props.activatedAt = new Date();
    if (coachingRelationshipId) {
      this.props.coachingRelationshipId = coachingRelationshipId;
    }
  }

  public complete(): void {
    if (this.props.status !== SubscriptionStatus.ACTIVE) {
      throw new Error(
        `Cannot complete subscription from state '${this.props.status}'. Must be in 'ACTIVE'.`,
      );
    }
    this.props.status = SubscriptionStatus.COMPLETED;
    this.props.sessionsRemaining = 0;
    this.props.completedAt = new Date();
  }

  public cancel(): void {
    if (
      this.props.status !== SubscriptionStatus.ACTIVE &&
      this.props.status !== SubscriptionStatus.PENDING
    ) {
      throw new Error(`Cannot cancel subscription in state '${this.props.status}'.`);
    }
    this.props.status = SubscriptionStatus.CANCELLED;
  }

  public markRefunded(): void {
    this.props.status = SubscriptionStatus.REFUNDED;
  }

  public markExpired(): void {
    if (this.props.status === SubscriptionStatus.ACTIVE) {
      this.props.status = SubscriptionStatus.EXPIRED;
    }
  }

  public decrementSession(): void {
    if (this.props.sessionsRemaining > 0) {
      this.props.sessionsRemaining -= 1;
    }
  }

  public setCoachingRelationshipId(relationshipId: string): void {
    this.props.coachingRelationshipId = relationshipId;
  }

  public toPrimitives(): SubscriptionProps & { subscriptionId: string } {
    return {
      subscriptionId: this._id,
      status: this.props.status,
      coachingRelationshipId: this.props.coachingRelationshipId,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      sessionsIncluded: this.props.sessionsIncluded,
      sessionsRemaining: this.props.sessionsRemaining,
      activatedAt: this.props.activatedAt,
      completedAt: this.props.completedAt,
    };
  }

  public static create(
    props: {
      status?: SubscriptionStatus;
      coachingRelationshipId?: string | null;
      startDate?: Date | null;
      endDate?: Date | null;
      sessionsIncluded?: number;
      sessionsRemaining?: number;
      activatedAt?: Date | null;
      completedAt?: Date | null;
    },
    id?: string,
  ): Result<Subscription> {
    const sessions =
      typeof props.sessionsIncluded === 'number' && props.sessionsIncluded >= 0
        ? props.sessionsIncluded
        : 1;

    const remaining =
      typeof props.sessionsRemaining === 'number' && props.sessionsRemaining >= 0
        ? props.sessionsRemaining
        : sessions;

    const subId = id || `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return Result.ok<Subscription>(
      new Subscription(
        {
          status: props.status || SubscriptionStatus.PENDING,
          coachingRelationshipId: props.coachingRelationshipId || null,
          startDate: props.startDate || null,
          endDate: props.endDate || null,
          sessionsIncluded: sessions,
          sessionsRemaining: remaining,
          activatedAt: props.activatedAt || null,
          completedAt: props.completedAt || null,
        },
        subId,
      ),
    );
  }
}
