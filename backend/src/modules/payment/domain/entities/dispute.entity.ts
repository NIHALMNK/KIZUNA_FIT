import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { DisputeStatus } from '../enums/dispute-status.enum';

export interface DisputeProps {
  reason: string;
  status: DisputeStatus;
  raisedBy: string;
  evidence?: string | null;
  resolutionNotes?: string | null;
  resolvedAt?: Date | null;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity representing a financial or service dispute.
 * An active dispute ('OPEN', 'UNDER_INVESTIGATION') freezes payout releases and refunds.
 */
export class Dispute extends Entity<DisputeProps> {
  private constructor(props: DisputeProps, id: string) {
    super(props, id);
  }

  get disputeId(): string {
    return this._id;
  }

  get reason(): string {
    return this.props.reason;
  }

  get status(): DisputeStatus {
    return this.props.status;
  }

  get raisedBy(): string {
    return this.props.raisedBy;
  }

  get evidence(): string | null | undefined {
    return this.props.evidence;
  }

  get resolutionNotes(): string | null | undefined {
    return this.props.resolutionNotes;
  }

  get resolvedAt(): Date | null | undefined {
    return this.props.resolvedAt;
  }

  get closedAt(): Date | null | undefined {
    return this.props.closedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public isActive(): boolean {
    return (
      this.props.status === DisputeStatus.OPEN ||
      this.props.status === DisputeStatus.UNDER_INVESTIGATION
    );
  }

  public investigate(): void {
    if (this.props.status !== DisputeStatus.OPEN) {
      throw new Error(
        `Cannot investigate dispute from state '${this.props.status}'. Must be 'OPEN'.`,
      );
    }
    this.props.status = DisputeStatus.UNDER_INVESTIGATION;
    this.props.updatedAt = new Date();
  }

  public resolve(notes: string): void {
    if (
      this.props.status !== DisputeStatus.OPEN &&
      this.props.status !== DisputeStatus.UNDER_INVESTIGATION
    ) {
      throw new Error(`Cannot resolve dispute in state '${this.props.status}'.`);
    }
    this.props.status = DisputeStatus.RESOLVED;
    this.props.resolutionNotes = notes;
    this.props.resolvedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public close(): void {
    if (this.props.status !== DisputeStatus.RESOLVED) {
      throw new Error(
        `Cannot close dispute from state '${this.props.status}'. Must be resolved first.`,
      );
    }
    this.props.status = DisputeStatus.CLOSED;
    this.props.closedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public toPrimitives(): DisputeProps & { disputeId: string } {
    return {
      disputeId: this._id,
      reason: this.props.reason,
      status: this.props.status,
      raisedBy: this.props.raisedBy,
      evidence: this.props.evidence,
      resolutionNotes: this.props.resolutionNotes,
      resolvedAt: this.props.resolvedAt,
      closedAt: this.props.closedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }

  public static create(
    props: {
      reason: string;
      status?: DisputeStatus;
      raisedBy: string;
      evidence?: string | null;
      resolutionNotes?: string | null;
      resolvedAt?: Date | null;
      closedAt?: Date | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Dispute> {
    if (!props.reason || props.reason.trim().length === 0) {
      return Result.fail<Dispute>('Dispute reason is required');
    }

    if (!props.raisedBy || props.raisedBy.trim().length === 0) {
      return Result.fail<Dispute>('Dispute raisedBy user ID is required');
    }

    const disputeId = id || `dsp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return Result.ok<Dispute>(
      new Dispute(
        {
          reason: props.reason.trim(),
          status: props.status || DisputeStatus.OPEN,
          raisedBy: props.raisedBy.trim(),
          evidence: props.evidence || null,
          resolutionNotes: props.resolutionNotes || null,
          resolvedAt: props.resolvedAt || null,
          closedAt: props.closedAt || null,
          createdAt: props.createdAt || new Date(),
          updatedAt: props.updatedAt || new Date(),
        },
        disputeId,
      ),
    );
  }
}
