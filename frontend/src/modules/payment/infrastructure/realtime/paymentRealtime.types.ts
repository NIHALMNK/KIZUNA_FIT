/**
 * KIZUNAFIT - Payment Realtime Event Types (Phase 12.5)
 * Strict, canonical WebSocket event payload contracts matching backend emission.
 */

export interface PaymentSucceededRealtimePayload {
  paymentId: string;
  offerId: string;
  acquisitionPipelineId?: string;
  clientId: string;
  trainerId: string;
  totalAmount: number;
  currency: string;
  invoiceNumber?: string;
  subscriptionId?: string;
}

export interface PaymentFailedRealtimePayload {
  paymentId: string;
  clientId: string;
  trainerId: string;
  reason?: string;
}

export interface PayoutEligibleRealtimePayload {
  paymentId: string;
  payoutId: string;
  trainerId: string;
  amount: number;
  currency: string;
}

export interface PayoutPaidRealtimePayload {
  paymentId: string;
  payoutId: string;
  trainerId: string;
  amount: number;
  currency: string;
  gatewayPayoutId?: string;
}

export type PaymentRealtimeEventType =
  'payment:succeeded' | 'payment:failed' | 'payout:eligible' | 'payout:paid';
