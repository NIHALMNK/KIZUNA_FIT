/**
 * KIZUNAFIT - Payment API Client
 * Encapsulates core HTTP endpoints for Payment initiation, verification, and retrieval.
 */

import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  InitiatePaymentRequestDTO,
  InitiatePaymentResponseDTO,
  VerifyPaymentRequestDTO,
  VerifyPaymentResponseDTO,
  PaymentQueryParams,
  PaginatedPaymentsResponseDTO,
  PaymentDetailsResponseDTO,
  PaymentInvoiceResponseDTO,
} from '../../domain/types/payment.types';

export const paymentApi = {
  /**
   * Initiates payment for an ACCEPTED offer.
   * Sends ONLY { offerId: string } to preserve server-side financial authority.
   */
  initiatePayment: async (
    payload: InitiatePaymentRequestDTO,
  ): Promise<{ status: string; data: InitiatePaymentResponseDTO }> => {
    return httpClient.post<{ status: string; data: InitiatePaymentResponseDTO }>('/payments', {
      offerId: payload.offerId,
    });
  },

  /**
   * Submits Razorpay client verification information to backend.
   */
  verifyPayment: async (
    paymentId: string,
    payload: VerifyPaymentRequestDTO,
  ): Promise<{ status: string; data: VerifyPaymentResponseDTO }> => {
    return httpClient.post<{ status: string; data: VerifyPaymentResponseDTO }>(
      `/payments/${paymentId}/verify`,
      {
        providerPaymentId: payload.providerPaymentId,
        providerOrderId: payload.providerOrderId,
        providerSignature: payload.signature,
      },
    );
  },

  /**
   * Retrieves single Payment Aggregate details by ID.
   */
  getPaymentById: async (
    paymentId: string,
  ): Promise<{ status: string; data: PaymentDetailsResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaymentDetailsResponseDTO }>(
      `/payments/${paymentId}`,
    );
  },

  /**
   * Lists payments with role-based scoping and pagination.
   */
  listPayments: async (
    params?: PaymentQueryParams,
  ): Promise<{ status: string; data: PaginatedPaymentsResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaginatedPaymentsResponseDTO }>('/payments', {
      params,
    });
  },

  /**
   * Retrieves immutable invoice details for a payment.
   */
  getInvoice: async (
    paymentId: string,
  ): Promise<{ status: string; data: PaymentInvoiceResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaymentInvoiceResponseDTO }>(
      `/payments/${paymentId}/invoice`,
    );
  },
};
