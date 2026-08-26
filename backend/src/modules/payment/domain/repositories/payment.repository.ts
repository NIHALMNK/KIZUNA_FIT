import { Payment } from '../aggregates/payment.aggregate';

export interface IPaymentRepository {
  findById(paymentId: string): Promise<Payment | null>;
  findByOfferId(offerId: string): Promise<Payment | null>;
  findByProviderOrderId(providerOrderId: string): Promise<Payment | null>;
  findByProviderPaymentId(providerPaymentId: string): Promise<Payment | null>;
  listByClientId(clientId: string, limit?: number, offset?: number): Promise<Payment[]>;
  listByTrainerId(trainerId: string, limit?: number, offset?: number): Promise<Payment[]>;
  listAll(limit?: number, offset?: number): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
  existsForOffer(offerId: string): Promise<boolean>;
}
