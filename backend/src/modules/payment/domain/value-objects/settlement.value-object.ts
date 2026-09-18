import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface SettlementProps {
  settlementId: string;
  trainerAmount: number;
  platformAmount: number;
  currency: string;
  settledAt: Date;
}

/**
 * Value Object representing the completed financial reconciliation.
 * Settlement is NOT a Payment status.
 */
export class Settlement extends ValueObject<SettlementProps> {
  private constructor(props: SettlementProps) {
    super(props);
  }

  get settlementId(): string {
    return this.props.settlementId;
  }

  get trainerAmount(): number {
    return this.props.trainerAmount;
  }

  get platformAmount(): number {
    return this.props.platformAmount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get settledAt(): Date {
    return this.props.settledAt;
  }

  public toPrimitives(): SettlementProps {
    return {
      settlementId: this.props.settlementId,
      trainerAmount: this.props.trainerAmount,
      platformAmount: this.props.platformAmount,
      currency: this.props.currency,
      settledAt: this.props.settledAt,
    };
  }

  public static create(props: {
    settlementId?: string;
    trainerAmount: number;
    platformAmount: number;
    currency?: string;
    settledAt?: Date;
  }): Result<Settlement> {
    if (
      typeof props.trainerAmount !== 'number' ||
      isNaN(props.trainerAmount) ||
      props.trainerAmount < 0
    ) {
      return Result.fail<Settlement>('trainerAmount must be a non-negative number');
    }

    if (
      typeof props.platformAmount !== 'number' ||
      isNaN(props.platformAmount) ||
      props.platformAmount < 0
    ) {
      return Result.fail<Settlement>('platformAmount must be a non-negative number');
    }

    const cleanId =
      props.settlementId || `stl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<Settlement>(
      new Settlement({
        settlementId: cleanId,
        trainerAmount: props.trainerAmount,
        platformAmount: props.platformAmount,
        currency: cleanCurrency,
        settledAt: props.settledAt || new Date(),
      }),
    );
  }
}
