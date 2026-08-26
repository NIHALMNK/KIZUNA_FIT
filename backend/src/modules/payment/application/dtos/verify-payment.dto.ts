import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export interface VerifyPaymentCommandDTO {
  paymentId: string;
  providerPaymentId: string;
  providerOrderId: string;
  providerSignature: string;
  clientId: string;
}

export interface VerifyPaymentResponseDTO {
  paymentId: string;
  offerId: string;
  status: PaymentStatus;
  providerPaymentId: string;
  providerOrderId: string;
  totalAmount: number;
  currency: string;
  verifiedAt: string;
}
