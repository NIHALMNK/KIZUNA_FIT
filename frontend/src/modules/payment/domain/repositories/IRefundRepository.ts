/**
 * KIZUNAFIT - Refund Repository Contract
 * Defines exceptional service-failure refund operations.
 */

import {
  RequestRefundRequestDTO,
  AdminReviewRefundRequestDTO,
  AdminApproveRefundRequestDTO,
  AdminRejectRefundRequestDTO,
  RefundDetailsDTO,
  RefundQueryParams,
  PaginatedRefundsResponseDTO,
} from '../types/refund.types';

export interface IRefundRepository {
  /**
   * Client requests exceptional service-failure refund (reason only).
   */
  requestRefund(paymentId: string, payload: RequestRefundRequestDTO): Promise<RefundDetailsDTO>;

  /**
   * Retrieves specific refund details.
   */
  getRefund(paymentId: string, refundId: string): Promise<RefundDetailsDTO>;

  /**
   * Lists refund requests with optional status filtering.
   */
  listRefunds(params?: RefundQueryParams): Promise<PaginatedRefundsResponseDTO>;

  /**
   * Admin moves refund to UNDER_REVIEW.
   */
  reviewRefund(
    paymentId: string,
    refundId: string,
    payload?: AdminReviewRefundRequestDTO,
  ): Promise<RefundDetailsDTO>;

  /**
   * Admin approves refund of trainerFee.
   */
  approveRefund(
    paymentId: string,
    refundId: string,
    payload?: AdminApproveRefundRequestDTO,
  ): Promise<RefundDetailsDTO>;

  /**
   * Admin rejects refund with reason.
   */
  rejectRefund(
    paymentId: string,
    refundId: string,
    payload: AdminRejectRefundRequestDTO,
  ): Promise<RefundDetailsDTO>;

  /**
   * Admin dispatches gateway refund to client.
   */
  processApprovedRefund(paymentId: string, refundId: string): Promise<RefundDetailsDTO>;
}
