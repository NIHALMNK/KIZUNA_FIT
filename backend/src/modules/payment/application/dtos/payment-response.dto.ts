import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import { SubscriptionStatus } from '../../domain/enums/subscription-status.enum';
import { PayoutStatus } from '../../domain/enums/payout-status.enum';

export interface PaymentTransactionDTO {
  transactionId: string;
  providerTransactionId?: string | null;
  type: string;
  amount: number;
  currency: string;
  status: string;
  processedAt: string;
}

export interface PaymentRefundDTO {
  refundId: string;
  amount: number;
  currency: string;
  reason: string;
  type: string;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
  processedAt?: string | null;
}

export interface PaymentDisputeDTO {
  disputeId: string;
  reason: string;
  status: string;
  raisedBy: string;
  evidence?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface PaymentResponseDTO {
  id: string;
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
  subscription: {
    id: string;
    status: SubscriptionStatus;
    coachingRelationshipId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    sessionsIncluded: number;
    sessionsRemaining: number;
  };
  payout: {
    id: string;
    amount: number;
    status: PayoutStatus;
    eligibleAt?: string | null;
    processedAt?: string | null;
  };
  invoice: {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    currency: string;
    issuedAt: string;
    pdfUrl?: string | null;
  };
  settlement?: {
    id: string;
    trainerAmount: number;
    platformAmount: number;
    settledAt: string;
  } | null;
  transactions: PaymentTransactionDTO[];
  refunds: PaymentRefundDTO[];
  disputes: PaymentDisputeDTO[];
  createdAt: string;
  updatedAt: string;
}
