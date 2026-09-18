import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface PaymentPricingProps {
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
}

/**
 * Currency-safe Value Object representing the authoritative commercial terms
 * consumed from the accepted Offer PricingSnapshot.
 * Payment Domain does not recalculate commission rates; it consumes the accepted terms.
 * Formula: trainerFee + platformFee = totalAmount
 */
export class PaymentPricing extends ValueObject<PaymentPricingProps> {
  private constructor(props: PaymentPricingProps) {
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

  public toPrimitives(): PaymentPricingProps {
    return {
      trainerFee: this.props.trainerFee,
      platformFee: this.props.platformFee,
      totalAmount: this.props.totalAmount,
      currency: this.props.currency,
    };
  }

  public static create(props: {
    trainerFee: number;
    platformFee: number;
    totalAmount: number;
    currency?: string;
  }): Result<PaymentPricing> {
    if (typeof props.trainerFee !== 'number' || isNaN(props.trainerFee) || props.trainerFee <= 0) {
      return Result.fail<PaymentPricing>('trainerFee must be a positive number');
    }

    if (
      typeof props.platformFee !== 'number' ||
      isNaN(props.platformFee) ||
      props.platformFee < 0
    ) {
      return Result.fail<PaymentPricing>('platformFee must be a non-negative number');
    }

    if (
      typeof props.totalAmount !== 'number' ||
      isNaN(props.totalAmount) ||
      props.totalAmount <= 0
    ) {
      return Result.fail<PaymentPricing>('totalAmount must be a positive number');
    }

    const expectedTotal = props.trainerFee + props.platformFee;
    if (props.totalAmount !== expectedTotal) {
      return Result.fail<PaymentPricing>(
        `totalAmount (${props.totalAmount}) must equal trainerFee (${props.trainerFee}) + platformFee (${props.platformFee}) = ${expectedTotal}`,
      );
    }

    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<PaymentPricing>(
      new PaymentPricing({
        trainerFee: props.trainerFee,
        platformFee: props.platformFee,
        totalAmount: props.totalAmount,
        currency: cleanCurrency,
      }),
    );
  }
}
