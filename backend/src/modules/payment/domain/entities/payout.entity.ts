import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { PayoutStatus } from '../enums/payout-status.enum';

export interface PayoutProps {
  trainerId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  eligibleAt?: Date | null;
  processedAt?: Date | null;
  gatewayPayoutId?: string | null;
  failureReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity managing the trainer escrow release and payout lifecycle.
 * Payout amount is strictly calculated from Payment state (never trainer-supplied).
 */
export class Payout extends Entity<PayoutProps> {
  private constructor(props: PayoutProps, id: string) {
    super(props, id);
  }

  get payoutId(): string {
    return this._id;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): PayoutStatus {
    return this.props.status;
  }

  get eligibleAt(): Date | null | undefined {
    return this.props.eligibleAt;
  }

  get processedAt(): Date | null | undefined {
    return this.props.processedAt;
  }

  get gatewayPayoutId(): string | null | undefined {
    return this.props.gatewayPayoutId;
  }

  get failureReason(): string | null | undefined {
    return this.props.failureReason;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public markEligible(eligibleAt: Date): void {
    if (this.props.status !== PayoutStatus.PENDING && this.props.status !== PayoutStatus.ON_HOLD) {
      throw new Error(`Cannot mark payout eligible from state '${this.props.status}'.`);
    }
    this.props.eligibleAt = eligibleAt;
    this.props.updatedAt = new Date();
  }

  public hold(reason?: string): void {
    if (this.props.status === PayoutStatus.PAID) {
      throw new Error('Cannot hold a completed payout.');
    }
    this.props.status = PayoutStatus.ON_HOLD;
    if (reason) this.props.failureReason = reason;
    this.props.updatedAt = new Date();
  }

  public releaseHold(): void {
    if (this.props.status === PayoutStatus.ON_HOLD) {
      this.props.status = PayoutStatus.PENDING;
      this.props.failureReason = null;
      this.props.updatedAt = new Date();
    }
  }

  public startProcessing(): void {
    if (this.props.status !== PayoutStatus.PENDING) {
      throw new Error(`Cannot start processing payout from state '${this.props.status}'.`);
    }
    this.props.status = PayoutStatus.PROCESSING;
    this.props.updatedAt = new Date();
  }

  public markPaid(gatewayPayoutId?: string): void {
    if (
      this.props.status !== PayoutStatus.PROCESSING &&
      this.props.status !== PayoutStatus.PENDING
    ) {
      throw new Error(`Cannot mark payout as paid from state '${this.props.status}'.`);
    }
    this.props.status = PayoutStatus.PAID;
    this.props.gatewayPayoutId = gatewayPayoutId || `payout_sim_${Date.now()}`;
    this.props.processedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public markFailed(reason: string): void {
    if (this.props.status !== PayoutStatus.PROCESSING) {
      throw new Error(`Cannot fail payout from state '${this.props.status}'.`);
    }
    this.props.status = PayoutStatus.FAILED;
    this.props.failureReason = reason;
    this.props.updatedAt = new Date();
  }

  public adjustAmount(newAmount: number): void {
    if (this.props.status === PayoutStatus.PAID || this.props.status === PayoutStatus.PROCESSING) {
      throw new Error(`Cannot adjust payout amount in state '${this.props.status}'.`);
    }
    if (newAmount < 0) {
      throw new Error('Payout amount cannot be negative.');
    }
    this.props.amount = newAmount;
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): PayoutProps & { payoutId: string } {
    return {
      payoutId: this._id,
      trainerId: this.props.trainerId,
      amount: this.props.amount,
      currency: this.props.currency,
      status: this.props.status,
      eligibleAt: this.props.eligibleAt,
      processedAt: this.props.processedAt,
      gatewayPayoutId: this.props.gatewayPayoutId,
      failureReason: this.props.failureReason,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  public static create(
    props: {
      trainerId: string;
      amount: number;
      currency?: string;
      status?: PayoutStatus;
      eligibleAt?: Date | null;
      processedAt?: Date | null;
      gatewayPayoutId?: string | null;
      failureReason?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Payout> {
    if (!props.trainerId || props.trainerId.trim().length === 0) {
      return Result.fail<Payout>('Trainer ID is required for payout');
    }

    if (typeof props.amount !== 'number' || isNaN(props.amount) || props.amount < 0) {
      return Result.fail<Payout>('Payout amount must be a non-negative number');
    }

    const payoutId = id || `po_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<Payout>(
      new Payout(
        {
          trainerId: props.trainerId.trim(),
          amount: props.amount,
          currency: cleanCurrency,
          status: props.status || PayoutStatus.PENDING,
          eligibleAt: props.eligibleAt || null,
          processedAt: props.processedAt || null,
          gatewayPayoutId: props.gatewayPayoutId || null,
          failureReason: props.failureReason || null,
          createdAt: props.createdAt || new Date(),
          updatedAt: props.updatedAt || new Date(),
        },
        payoutId,
      ),
    );
  }
}
