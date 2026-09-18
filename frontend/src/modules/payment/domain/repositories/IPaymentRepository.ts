/**
 * KIZUNAFIT - Payment Repository Contract
 * Defines core Payment application operations.
 */

import {
  InitiatePaymentResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  PaymentQueryParams,
  PaginatedPaymentsResponseDTO,
  PaymentDetails,
  PaymentInvoice,
} from '../types/payment.types';

export interface IPaymentRepository {
  /**
   * Initiates payment for an ACCEPTED coaching offer.
   * Derives pricing snapshot and creates provider order.
   */
  initiatePayment(offerId: string): Promise<InitiatePaymentResponseDTO>;

  /**
   * Cryptographically verifies payment signature against gateway.
   */
  verifyPayment(
    paymentId: string,
    payload: VerifyPaymentRequestDTO,
  ): Promise<VerifyPaymentResponseDTO>;

  /**
   * Retrieves comprehensive Payment Aggregate details by payment ID.
   */
  getPayment(paymentId: string): Promise<PaymentDetails>;

  /**
   * Lists payments with role-based scoping and pagination.
   */
  listPayments(params?: PaymentQueryParams): Promise<PaginatedPaymentsResponseDTO>;

  /**
   * Retrieves immutable invoice details for a payment.
   */
  getInvoice(paymentId: string): Promise<PaymentInvoice>;
}
