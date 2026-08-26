/**
 * KIZUNAFIT - Refund Domain Contracts
 * Authoritative client-facing definitions for Exceptional Service-Failure Refunds.
 */

export enum RefundStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSED = 'PROCESSED',
  CANCELLED = 'CANCELLED',
}

export enum RefundType {
  FULL_TRAINER_FEE_REFUND = 'FULL_TRAINER_FEE_REFUND',
}

// --- Domain Models ---

export interface PaymentRefund {
  readonly refundId: string;
  readonly amount: number;
  readonly currency: string;
  readonly type: RefundType;
  readonly status: RefundStatus;
  readonly reason: string;
  readonly requestedBy: string;
  readonly adminNotes?: string | null;
  readonly gatewayRefundId?: string | null;
  readonly requestedAt: string;
  readonly reviewedAt?: string | null;
  readonly processedAt?: string | null;
}

// --- API DTO Contracts ---

/**
 * Requesting an exceptional refund requires ONLY a reason.
 * Amount is server-authoritative and strictly equals trainerFee.
 */
export interface RequestRefundRequestDTO {
  reason: string;
}

export interface AdminReviewRefundRequestDTO {
  adminNotes?: string;
}

export interface AdminApproveRefundRequestDTO {
  adminNotes?: string;
}

export interface AdminRejectRefundRequestDTO {
  adminNotes: string;
}

export interface RefundDetailsDTO {
  refundId: string;
  paymentId: string;
  amount: number;
  currency: string;
  type: RefundType;
  status: RefundStatus;
  reason: string;
  requestedBy: string;
  adminNotes?: string;
  gatewayRefundId?: string;
  requestedAt: string;
  reviewedAt?: string;
  processedAt?: string;
}

export interface RefundQueryParams {
  status?: RefundStatus;
  page?: number;
  limit?: number;
}

export interface PaginatedRefundsResponseDTO {
  data: RefundDetailsDTO[];
  total: number;
  page: number;
  limit: number;
}

// --- Status Guards & Helpers ---

export const isRefundPending = (status: RefundStatus): boolean => status === RefundStatus.PENDING;

export const isRefundUnderReview = (status: RefundStatus): boolean =>
  status === RefundStatus.UNDER_REVIEW;

export const isRefundApproved = (status: RefundStatus): boolean => status === RefundStatus.APPROVED;

export const isRefundProcessed = (status: RefundStatus): boolean =>
  status === RefundStatus.PROCESSED;

export const isRefundTerminal = (status: RefundStatus): boolean =>
  status === RefundStatus.PROCESSED ||
  status === RefundStatus.REJECTED ||
  status === RefundStatus.CANCELLED;
