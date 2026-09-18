import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { RefundStatus } from '../enums/refund-status.enum';
import { RefundType } from '../enums/refund-type.enum';

export interface RefundProps {
  amount: number;
  currency: string;
  reason: string;
  type: RefundType;
  status: RefundStatus;
  adminNotes?: string | null;
  adminId?: string | null;
  gatewayRefundId?: string | null;
  createdAt: Date;
  reviewedAt?: Date | null;
  processedAt?: Date | null;
}

/**
 * Entity representing an Admin-governed Refund request and lifecycle.
 */
export class Refund extends Entity<RefundProps> {
  private constructor(props: RefundProps, id: string) {
    super(props, id);
  }

  get refundId(): string {
    return this._id;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get reason(): string {
    return this.props.reason;
  }

  get type(): RefundType {
    return this.props.type;
  }

  get status(): RefundStatus {
    return this.props.status;
  }

  get adminNotes(): string | null | undefined {
    return this.props.adminNotes;
  }

  get adminId(): string | null | undefined {
    return this.props.adminId;
  }

  get gatewayRefundId(): string | null | undefined {
    return this.props.gatewayRefundId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get reviewedAt(): Date | null | undefined {
    return this.props.reviewedAt;
  }

  get processedAt(): Date | null | undefined {
    return this.props.processedAt;
  }

  public putUnderReview(adminId: string, notes?: string): void {
    if (this.props.status !== RefundStatus.PENDING) {
      throw new Error(`Cannot place refund under review from state '${this.props.status}'.`);
    }
    this.props.status = RefundStatus.UNDER_REVIEW;
    this.props.adminId = adminId;
    if (notes) this.props.adminNotes = notes;
    this.props.reviewedAt = new Date();
  }

  public approve(adminId: string, notes?: string): void {
    if (
      this.props.status !== RefundStatus.UNDER_REVIEW &&
      this.props.status !== RefundStatus.PENDING
    ) {
      throw new Error(`Cannot approve refund in state '${this.props.status}'.`);
    }
    this.props.status = RefundStatus.APPROVED;
    this.props.adminId = adminId;
    if (notes) this.props.adminNotes = notes;
    this.props.reviewedAt = new Date();
  }

  public reject(adminId: string, notes: string): void {
    if (
      this.props.status !== RefundStatus.UNDER_REVIEW &&
      this.props.status !== RefundStatus.PENDING
    ) {
      throw new Error(`Cannot reject refund in state '${this.props.status}'.`);
    }
    this.props.status = RefundStatus.REJECTED;
    this.props.adminId = adminId;
    this.props.adminNotes = notes;
    this.props.reviewedAt = new Date();
  }

  public cancel(): void {
    if (
      this.props.status === RefundStatus.PROCESSED ||
      this.props.status === RefundStatus.REJECTED
    ) {
      throw new Error(`Cannot cancel refund in terminal state '${this.props.status}'.`);
    }
    this.props.status = RefundStatus.CANCELLED;
  }

  public markProcessed(gatewayRefundId: string): void {
    if (this.props.status !== RefundStatus.APPROVED) {
      throw new Error(
        `Cannot process refund from state '${this.props.status}'. Must be approved first.`,
      );
    }
    this.props.status = RefundStatus.PROCESSED;
    this.props.gatewayRefundId = gatewayRefundId;
    this.props.processedAt = new Date();
  }

  public toPrimitives(): RefundProps & { refundId: string } {
    return {
      refundId: this._id,
      amount: this.props.amount,
      currency: this.props.currency,
      reason: this.props.reason,
      type: this.props.type,
      status: this.props.status,
      adminNotes: this.props.adminNotes,
      adminId: this.props.adminId,
      gatewayRefundId: this.props.gatewayRefundId,
      createdAt: this.props.createdAt,
      reviewedAt: this.props.reviewedAt,
      processedAt: this.props.processedAt,
    };
  }

  public static create(
    props: {
      amount: number;
      currency?: string;
      reason: string;
      type?: RefundType;
      status?: RefundStatus;
      adminNotes?: string | null;
      adminId?: string | null;
      gatewayRefundId?: string | null;
      createdAt?: Date;
      reviewedAt?: Date | null;
      processedAt?: Date | null;
    },
    id?: string,
  ): Result<Refund> {
    if (typeof props.amount !== 'number' || isNaN(props.amount) || props.amount <= 0) {
      return Result.fail<Refund>('Refund amount must be a positive number');
    }

    if (!props.reason || props.reason.trim().length === 0) {
      return Result.fail<Refund>('Refund reason is required');
    }

    const refundId = id || `ref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<Refund>(
      new Refund(
        {
          amount: props.amount,
          currency: cleanCurrency,
          reason: props.reason.trim(),
          type: props.type || RefundType.FULL_TRAINER_FEE_REFUND,
          status: props.status || RefundStatus.PENDING,
          adminNotes: props.adminNotes || null,
          adminId: props.adminId || null,
          gatewayRefundId: props.gatewayRefundId || null,
          createdAt: props.createdAt || new Date(),
          reviewedAt: props.reviewedAt || null,
          processedAt: props.processedAt || null,
        },
        refundId,
      ),
    );
  }
}
