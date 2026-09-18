import { Document } from 'mongoose';
import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { SubscriptionStatus } from '../../../../domain/enums/subscription-status.enum';
import { RefundStatus } from '../../../../domain/enums/refund-status.enum';
import { RefundType } from '../../../../domain/enums/refund-type.enum';
import { DisputeStatus } from '../../../../domain/enums/dispute-status.enum';
import { PayoutStatus } from '../../../../domain/enums/payout-status.enum';
import { TransactionType } from '../../../../domain/enums/transaction-type.enum';
import { TransactionStatus } from '../../../../domain/enums/transaction-status.enum';

export interface ITransactionSubDocument {
  _id: string;
  providerTransactionId?: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  processedAt: Date;
}

export interface ISubscriptionSubDocument {
  _id: string;
  status: SubscriptionStatus;
  coachingRelationshipId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  sessionsIncluded: number;
  sessionsRemaining: number;
  activatedAt?: Date | null;
  completedAt?: Date | null;
}

export interface IRefundSubDocument {
  _id: string;
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

export interface IDisputeSubDocument {
  _id: string;
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

export interface IPayoutSubDocument {
  _id: string;
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

export interface IInvoiceSubDocument {
  _id: string;
  invoiceNumber: string;
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  issuedAt: Date;
  pdfUrl?: string | null;
}

export interface ISettlementSubDocument {
  _id: string;
  trainerAmount: number;
  platformAmount: number;
  currency: string;
  settledAt: Date;
}

export interface IPaymentDocument extends Document<string> {
  _id: string;
  offerId: string;
  acquisitionPipelineId: string;
  clientId: string;
  trainerId: string;
  pricing: {
    trainerFee: number;
    platformFee: number;
    totalAmount: number;
    currency: string;
  };
  status: PaymentStatus;
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
  transactions: ITransactionSubDocument[];
  subscription: ISubscriptionSubDocument;
  refunds: IRefundSubDocument[];
  disputes: IDisputeSubDocument[];
  payout: IPayoutSubDocument;
  invoice: IInvoiceSubDocument;
  settlement?: ISettlementSubDocument | null;
  createdAt: Date;
  updatedAt: Date;
}
