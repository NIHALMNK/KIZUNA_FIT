import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { TransactionType } from '../enums/transaction-type.enum';
import { TransactionStatus } from '../enums/transaction-status.enum';

export interface TransactionProps {
  providerTransactionId?: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  processedAt: Date;
}

/**
 * Immutable entity representing a discrete financial movement
 * (PAYMENT, REFUND, PAYOUT).
 */
export class Transaction extends Entity<TransactionProps> {
  private constructor(props: TransactionProps, id: string) {
    super(props, id);
  }

  get transactionId(): string {
    return this._id;
  }

  get providerTransactionId(): string | null | undefined {
    return this.props.providerTransactionId;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): TransactionStatus {
    return this.props.status;
  }

  get processedAt(): Date {
    return this.props.processedAt;
  }

  public toPrimitives(): TransactionProps & { transactionId: string } {
    return {
      transactionId: this._id,
      providerTransactionId: this.props.providerTransactionId,
      type: this.props.type,
      amount: this.props.amount,
      currency: this.props.currency,
      status: this.props.status,
      processedAt: this.props.processedAt,
    };
  }

  public static create(
    props: {
      providerTransactionId?: string | null;
      type: TransactionType;
      amount: number;
      currency?: string;
      status?: TransactionStatus;
      processedAt?: Date;
    },
    id?: string,
  ): Result<Transaction> {
    if (typeof props.amount !== 'number' || isNaN(props.amount) || props.amount <= 0) {
      return Result.fail<Transaction>('Transaction amount must be a positive number');
    }

    if (!props.type || !Object.values(TransactionType).includes(props.type)) {
      return Result.fail<Transaction>('Invalid transaction type');
    }

    const txId = id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<Transaction>(
      new Transaction(
        {
          providerTransactionId: props.providerTransactionId || null,
          type: props.type,
          amount: props.amount,
          currency: cleanCurrency,
          status: props.status || TransactionStatus.SUCCESS,
          processedAt: props.processedAt || new Date(),
        },
        txId,
      ),
    );
  }
}
