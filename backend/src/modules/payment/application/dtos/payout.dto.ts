/**
 * Payout and Settlement Application DTOs.
 * Models the trainer payout lifecycle, eligibility check, and immutable settlement snapshots.
 */

export interface CheckPayoutEligibilityDTO {
  paymentId: string;
}

export interface PayoutEligibilityResponseDTO {
  paymentId: string;
  isEligible: boolean;
  eligibleAmount: number;
  currency: string;
  eligibleAt: string | null;
  reason?: string;
}

export interface ProcessPayoutDTO {
  paymentId: string;
  adminId?: string;
  idempotencyKey?: string;
}

export interface RetryPayoutDTO {
  paymentId: string;
  adminId?: string;
  idempotencyKey?: string;
}

export interface ListPayoutsQueryDTO {
  status?: string;
  trainerId?: string;
  limit?: number;
  offset?: number;
}

export interface PayoutDetailsDTO {
  payoutId: string;
  paymentId: string;
  trainerId: string;
  amount: number;
  currency: string;
  status: string; // 'PENDING' | 'ON_HOLD' | 'PROCESSING' | 'PAID' | 'FAILED'
  eligibleAt: string | null;
  processedAt: string | null;
  gatewayPayoutId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SettlementDetailsDTO {
  settlementId: string;
  paymentId: string;
  trainerAmount: number;
  platformAmount: number;
  currency: string;
  settledAt: string;
}
