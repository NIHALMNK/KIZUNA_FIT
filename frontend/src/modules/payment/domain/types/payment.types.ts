/**
 * KIZUNAFIT - Payment Domain Contracts
 * Authoritative client-facing domain definitions and DTO contracts.
 */

export enum PaymentStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  PAYOUT = 'PAYOUT',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

// --- Domain Models & Value Objects ---

export interface PaymentPricing {
  readonly trainerFee: number;
  readonly platformFee: number;
  readonly totalAmount: number;
  readonly currency: string;
  readonly commissionRate: number;
}

export interface PaymentTransaction {
  readonly transactionId: string;
  readonly providerTransactionId: string;
  readonly type: TransactionType;
  readonly amount: number;
  readonly currency: string;
  readonly createdAt: string;
}

export interface PaymentSubscription {
  readonly subscriptionId: string;
  readonly status: SubscriptionStatus;
  readonly startDate?: string | null;
  readonly endDate?: string | null;
  readonly sessionsIncluded: number;
  readonly sessionsRemaining: number;
  readonly coachingRelationshipId?: string | null;
  readonly activatedAt?: string | null;
  readonly completedAt?: string | null;
}

export interface PaymentInvoice {
  readonly invoiceNumber: string;
  readonly paymentId: string;
  readonly offerId: string;
  readonly issuedAt: string;
  readonly client: {
    readonly id: string;
  };
  readonly trainer: {
    readonly id: string;
  };
  readonly lineItems: {
    readonly description: string;
    readonly trainerFee: number;
    readonly platformFee: number;
    readonly totalAmount: number;
    readonly currency: string;
  };
  readonly paidAt?: string | null;
  readonly providerPaymentId?: string | null;
}

// Forward declarations for composite PaymentDetails & PaymentSummary
import type { PaymentRefund } from './refund.types';
import type { PaymentDispute } from './dispute.types';
import type { PaymentPayout } from './payout.types';
import type { PaymentSettlement } from './settlement.types';

export interface PaymentSummary {
  readonly paymentId: string;
  readonly offerId: string;
  readonly acquisitionPipelineId?: string | null;
  readonly clientId: string;
  readonly trainerId: string;
  readonly pricing: PaymentPricing;
  readonly status: PaymentStatus;
  readonly providerOrderId?: string | null;
  readonly providerPaymentId?: string | null;
  readonly hasActiveDispute?: boolean;
  readonly subscriptionStatus?: SubscriptionStatus;
  readonly payout?: PaymentPayout;
  readonly settlement?: PaymentSettlement | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PaymentDetails extends PaymentSummary {
  readonly transactions: PaymentTransaction[];
  readonly subscription: PaymentSubscription;
  readonly refunds: PaymentRefund[];
  readonly disputes: PaymentDispute[];
  readonly payout: PaymentPayout;
  readonly settlement?: PaymentSettlement | null;
  readonly hasActiveDispute: boolean;
  readonly isLockedByDispute: boolean;
  readonly eligiblePayoutAmount: number;
}

// --- API DTO Contracts ---

export interface InitiatePaymentRequestDTO {
  offerId: string;
}

export interface InitiatePaymentResponseDTO {
  paymentId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  pricing: PaymentPricing;
}

export interface VerifyPaymentRequestDTO {
  providerPaymentId: string;
  providerOrderId: string;
  signature: string;
}

export interface VerifyPaymentResponseDTO {
  status: 'SUCCESS' | 'FAILED';
  paymentId: string;
  providerPaymentId: string;
}

export interface PaymentQueryParams {
  status?: PaymentStatus;
  role?: 'CLIENT' | 'TRAINER' | 'ADMIN';
  page?: number;
  limit?: number;
}

export interface PaginatedPaymentsResponseDTO {
  data: PaymentSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentDetailsResponseDTO {
  paymentId: string;
  offerId: string;
  acquisitionPipelineId?: string;
  clientId: string;
  trainerId: string;
  pricing: PaymentPricing;
  status: PaymentStatus;
  providerOrderId?: string;
  providerPaymentId?: string;
  transactions: PaymentTransaction[];
  subscription: PaymentSubscription;
  refunds: any[];
  disputes: any[];
  payout: any;
  settlement?: any;
  hasActiveDispute: boolean;
  isLockedByDispute: boolean;
  eligiblePayoutAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentInvoiceResponseDTO {
  invoiceNumber: string;
  paymentId: string;
  offerId: string;
  issuedAt: string;
  client: {
    id: string;
  };
  trainer: {
    id: string;
  };
  lineItems: {
    description: string;
    trainerFee: number;
    platformFee: number;
    totalAmount: number;
    currency: string;
  };
  paidAt?: string;
  providerPaymentId?: string;
}

// --- Status Guards & Helpers ---

export const isPaymentSuccess = (status: PaymentStatus): boolean =>
  status === PaymentStatus.SUCCESS;

export const isPaymentTerminal = (status: PaymentStatus): boolean =>
  status === PaymentStatus.SUCCESS ||
  status === PaymentStatus.FAILED ||
  status === PaymentStatus.REFUNDED;

export const isPaymentRefunded = (status: PaymentStatus): boolean =>
  status === PaymentStatus.REFUNDED;
