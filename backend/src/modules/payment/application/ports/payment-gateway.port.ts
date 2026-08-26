export interface CreateGatewayOrderParams {
  paymentId: string;
  amount: number; // in major units (e.g. 10000 INR)
  currency: string;
  metadata?: Record<string, string>;
}

export interface GatewayOrderResult {
  providerOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyGatewayPaymentParams {
  paymentId: string;
  providerOrderId: string;
  providerPaymentId: string;
  providerSignature: string;
}

export interface GatewayVerificationResult {
  isValid: boolean;
  providerPaymentId: string;
  providerOrderId: string;
  amount: number;
  currency: string;
  status: string; // e.g. 'captured', 'authorized', 'failed'
}

export interface GatewayPaymentDetails {
  providerPaymentId: string;
  providerOrderId?: string | null;
  amount: number;
  currency: string;
  status: string;
  method?: string | null;
}

export interface ProcessGatewayRefundParams {
  providerPaymentId: string;
  amount: number;
  currency: string;
  reason?: string;
  notes?: Record<string, string>;
}

export interface GatewayRefundResult {
  gatewayRefundId: string;
  amount: number;
  status: string;
}

export interface ProcessGatewayPayoutParams {
  paymentId: string;
  payoutId: string;
  trainerId: string;
  amount: number;
  currency: string;
  idempotencyKey?: string;
  notes?: Record<string, string>;
}

export interface GatewayPayoutResult {
  gatewayPayoutId: string;
  amount: number;
  currency: string;
  status: string; // 'PAID' | 'PROCESSING' | 'FAILED'
  failureReason?: string | null;
}

/**
 * Port representing external payment gateway capabilities (e.g. Razorpay Test API).
 * Application layer depends only on this port.
 */
export interface IPaymentGatewayPort {
  createOrder(params: CreateGatewayOrderParams): Promise<GatewayOrderResult>;
  verifyPayment(params: VerifyGatewayPaymentParams): Promise<GatewayVerificationResult>;
  fetchPayment(providerPaymentId: string): Promise<GatewayPaymentDetails>;
  processRefund(params: ProcessGatewayRefundParams): Promise<GatewayRefundResult>;
  processPayout(params: ProcessGatewayPayoutParams): Promise<GatewayPayoutResult>;
  getKeyId?(): string;
}
