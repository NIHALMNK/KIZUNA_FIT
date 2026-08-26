/**
 * KIZUNAFIT - Payout Domain Contracts
 * Authoritative client-facing definitions for Trainer Payouts & Escrow Reviews.
 */

export enum PayoutStatus {
  PENDING = 'PENDING',
  ON_HOLD = 'ON_HOLD',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

// --- Domain Models ---

export interface PaymentPayout {
  readonly payoutId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PayoutStatus;
  readonly eligibleAt?: string | null;
  readonly processedAt?: string | null;
  readonly gatewayPayoutId?: string | null;
  readonly failureReason?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

// --- API DTO Contracts ---

export interface PayoutEligibilityDTO {
  paymentId: string;
  payoutId: string;
  trainerId: string;
  isEligible: boolean;
  eligibleAmount: number;
  currency: string;
  reason?: string;
  eligibleAt?: string;
  hasActiveDispute: boolean;
}

export interface PayoutDetailsDTO {
  payoutId: string;
  paymentId: string;
  trainerId: string;
  amount: number;
  currency: string;
  status: PayoutStatus;
  eligibleAt?: string;
  processedAt?: string;
  gatewayPayoutId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessPayoutRequestDTO {
  idempotencyKey?: string;
}

export interface PayoutQueryParams {
  trainerId?: string;
  status?: PayoutStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedPayoutsResponseDTO {
  data: PayoutDetailsDTO[];
  total: number;
  page: number;
  limit: number;
}

// --- Status Guards & Helpers ---

export const isPayoutPending = (status: PayoutStatus): boolean => status === PayoutStatus.PENDING;

export const isPayoutOnHold = (status: PayoutStatus): boolean => status === PayoutStatus.ON_HOLD;

export const isPayoutProcessing = (status: PayoutStatus): boolean =>
  status === PayoutStatus.PROCESSING;

export const isPayoutPaid = (status: PayoutStatus): boolean => status === PayoutStatus.PAID;

export const isPayoutFailed = (status: PayoutStatus): boolean => status === PayoutStatus.FAILED;

export const isPayoutTerminal = (status: PayoutStatus): boolean =>
  status === PayoutStatus.PAID || status === PayoutStatus.FAILED;
