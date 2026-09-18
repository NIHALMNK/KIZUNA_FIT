import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface PricingSnapshotProps {
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  commissionRate: number;
}

/**
 * Immutable Value Object representing historical commercial terms of a CoachingOffer.
 * Rule PS-1: Pricing snapshots are immutable after creation.
 * Formula: trainerFee + platformFee = totalAmount
 * platformFee = Math.round(trainerFee * commissionRate)
 */
export class PricingSnapshot extends ValueObject<PricingSnapshotProps> {
  private constructor(props: PricingSnapshotProps) {
    super(props);
  }

  get trainerFee(): number {
    return this.props.trainerFee;
  }

  get platformFee(): number {
    return this.props.platformFee;
  }

  get totalAmount(): number {
    return this.props.totalAmount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get commissionRate(): number {
    return this.props.commissionRate;
  }

  public toPrimitives(): PricingSnapshotProps {
    return {
      trainerFee: this.props.trainerFee,
      platformFee: this.props.platformFee,
      totalAmount: this.props.totalAmount,
      currency: this.props.currency,
      commissionRate: this.props.commissionRate,
    };
  }

  public static calculate(
    trainerFee: number,
    commissionRate: number,
    currency?: string,
  ): Result<PricingSnapshot> {
    if (typeof trainerFee !== 'number' || isNaN(trainerFee) || trainerFee <= 0) {
      return Result.fail<PricingSnapshot>('trainerFee must be a positive number');
    }

    if (
      typeof commissionRate !== 'number' ||
      isNaN(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 1
    ) {
      return Result.fail<PricingSnapshot>(
        'commissionRate must be a decimal fraction between 0.0 and 1.0 (e.g. 0.10 for 10%)',
      );
    }

    // Precise integer calculation to prevent floating point drift
    const platformFee = Math.round(trainerFee * commissionRate);
    const totalAmount = trainerFee + platformFee;
    const cleanCurrency =
      currency && typeof currency === 'string' && currency.trim().length > 0
        ? currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<PricingSnapshot>(
      new PricingSnapshot({
        trainerFee,
        platformFee,
        totalAmount,
        currency: cleanCurrency,
        commissionRate,
      }),
    );
  }

  public static create(props: {
    trainerFee: number;
    platformFee?: number;
    totalAmount?: number;
    currency?: string;
    commissionRate?: number;
  }): Result<PricingSnapshot> {
    if (typeof props.trainerFee !== 'number' || isNaN(props.trainerFee) || props.trainerFee <= 0) {
      return Result.fail<PricingSnapshot>('trainerFee must be a positive number');
    }

    if (
      props.platformFee !== undefined &&
      (typeof props.platformFee !== 'number' || isNaN(props.platformFee) || props.platformFee < 0)
    ) {
      return Result.fail<PricingSnapshot>('platformFee must be a non-negative number');
    }

    if (
      props.commissionRate !== undefined &&
      (typeof props.commissionRate !== 'number' ||
        isNaN(props.commissionRate) ||
        props.commissionRate < 0 ||
        props.commissionRate > 1)
    ) {
      return Result.fail<PricingSnapshot>('commissionRate must be between 0.0 and 1.0');
    }

    const commissionRate = props.commissionRate ?? 0;
    const platformFee =
      typeof props.platformFee === 'number' && !isNaN(props.platformFee)
        ? props.platformFee
        : Math.round(props.trainerFee * commissionRate);

    const calculatedTotal = props.trainerFee + platformFee;
    const totalAmount =
      typeof props.totalAmount === 'number' && !isNaN(props.totalAmount)
        ? props.totalAmount
        : calculatedTotal;

    if (totalAmount !== calculatedTotal) {
      return Result.fail<PricingSnapshot>(
        `totalAmount (${totalAmount}) must equal trainerFee (${props.trainerFee}) + platformFee (${platformFee}) = ${calculatedTotal}`,
      );
    }

    const currency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<PricingSnapshot>(
      new PricingSnapshot({
        trainerFee: props.trainerFee,
        platformFee,
        totalAmount,
        currency,
        commissionRate,
      }),
    );
  }
}
