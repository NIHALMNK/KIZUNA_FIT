import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';

export interface InvoiceProps {
  invoiceNumber: string;
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  issuedAt: Date;
  pdfUrl?: string | null;
}

/**
 * Immutable entity representing the official financial receipt / invoice.
 */
export class Invoice extends Entity<InvoiceProps> {
  private constructor(props: InvoiceProps, id: string) {
    super(props, id);
  }

  get invoiceId(): string {
    return this._id;
  }

  get invoiceNumber(): string {
    return this.props.invoiceNumber;
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

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get pdfUrl(): string | null | undefined {
    return this.props.pdfUrl;
  }

  public toPrimitives(): InvoiceProps & { invoiceId: string } {
    return {
      invoiceId: this._id,
      invoiceNumber: this.props.invoiceNumber,
      trainerFee: this.props.trainerFee,
      platformFee: this.props.platformFee,
      totalAmount: this.props.totalAmount,
      currency: this.props.currency,
      issuedAt: this.props.issuedAt,
      pdfUrl: this.props.pdfUrl,
    };
  }

  public static create(
    props: {
      invoiceNumber?: string;
      trainerFee: number;
      platformFee: number;
      totalAmount: number;
      currency?: string;
      issuedAt?: Date;
      pdfUrl?: string | null;
    },
    id?: string,
  ): Result<Invoice> {
    if (
      typeof props.totalAmount !== 'number' ||
      isNaN(props.totalAmount) ||
      props.totalAmount <= 0
    ) {
      return Result.fail<Invoice>('Invoice totalAmount must be positive');
    }

    const invoiceId = id || `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const invoiceNumber =
      props.invoiceNumber ||
      `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const cleanCurrency =
      props.currency && typeof props.currency === 'string' && props.currency.trim().length > 0
        ? props.currency.trim().toUpperCase()
        : 'INR';

    return Result.ok<Invoice>(
      new Invoice(
        {
          invoiceNumber,
          trainerFee: props.trainerFee,
          platformFee: props.platformFee,
          totalAmount: props.totalAmount,
          currency: cleanCurrency,
          issuedAt: props.issuedAt || new Date(),
          pdfUrl: props.pdfUrl || null,
        },
        invoiceId,
      ),
    );
  }
}
