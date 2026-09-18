/**
 * KIZUNAFIT - Refund API Client
 * Encapsulates HTTP endpoints for Exceptional Service-Failure Refunds.
 */

import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  RequestRefundRequestDTO,
  AdminReviewRefundRequestDTO,
  AdminApproveRefundRequestDTO,
  AdminRejectRefundRequestDTO,
  RefundDetailsDTO,
  RefundQueryParams,
  PaginatedRefundsResponseDTO,
} from '../../domain/types/refund.types';

export const refundApi = {
  /**
   * Client requests exceptional service-failure refund.
   * Sends ONLY { reason: string } - never amounts or percentages.
   */
  requestRefund: async (
    paymentId: string,
    payload: RequestRefundRequestDTO,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.post<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds`,
      { reason: payload.reason },
    );
  },

  /**
   * Retrieves specific refund details.
   */
  getRefund: async (
    paymentId: string,
    refundId: string,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.get<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds/${refundId}`,
    );
  },

  /**
   * Lists refund requests with optional status filtering.
   */
  listRefunds: async (
    params?: RefundQueryParams,
  ): Promise<{ status: string; data: PaginatedRefundsResponseDTO }> => {
    return httpClient.get<{ status: string; data: PaginatedRefundsResponseDTO }>(
      '/payments/refunds',
      { params },
    );
  },

  /**
   * Admin moves refund to UNDER_REVIEW.
   */
  reviewRefund: async (
    paymentId: string,
    refundId: string,
    payload?: AdminReviewRefundRequestDTO,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds/${refundId}/review`,
      payload || {},
    );
  },

  /**
   * Admin approves refund of trainerFee.
   */
  approveRefund: async (
    paymentId: string,
    refundId: string,
    payload?: AdminApproveRefundRequestDTO,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds/${refundId}/approve`,
      payload || {},
    );
  },

  /**
   * Admin rejects refund with reason.
   */
  rejectRefund: async (
    paymentId: string,
    refundId: string,
    payload: AdminRejectRefundRequestDTO,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.patch<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds/${refundId}/reject`,
      { adminNotes: payload.adminNotes },
    );
  },

  /**
   * Admin dispatches gateway refund to client.
   */
  processApprovedRefund: async (
    paymentId: string,
    refundId: string,
  ): Promise<{ status: string; data: RefundDetailsDTO }> => {
    return httpClient.post<{ status: string; data: RefundDetailsDTO }>(
      `/payments/${paymentId}/refunds/${refundId}/process`,
      {},
    );
  },
};
