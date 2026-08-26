/**
 * Authoritative Refund lifecycle states (Admin-reviewed exceptional remedy workflow).
 * PENDING -> UNDER_REVIEW -> APPROVED -> PROCESSED
 * UNDER_REVIEW -> REJECTED | CANCELLED
 */
export enum RefundStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  PROCESSED = 'PROCESSED',
}
