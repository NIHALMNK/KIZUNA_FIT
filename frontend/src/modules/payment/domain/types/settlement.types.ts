/**
 * KIZUNAFIT - Settlement Domain Contracts
 * Authoritative client-facing definitions for Final Settlement Snapshots (Post-PAID).
 */

// --- Domain Models ---

export interface PaymentSettlement {
  readonly settlementId: string;
  readonly trainerAmount: number;
  readonly platformAmount: number;
  readonly currency: string;
  readonly settledAt: string;
}

// --- API DTO Contracts ---

export interface SettlementDetailsDTO {
  settlementId: string;
  paymentId: string;
  payoutId: string;
  trainerId: string;
  trainerAmount: number;
  platformAmount: number;
  currency: string;
  settledAt: string;
}
