import { PaymentStatus } from '../../domain/enums/payment-status.enum';

export interface InitiatePaymentCommandDTO {
  offerId: string;
  clientId: string;
}

export interface InitiatePaymentResponseDTO {
  paymentId: string;
  offerId: string;
  providerOrderId: string;
  keyId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
}
