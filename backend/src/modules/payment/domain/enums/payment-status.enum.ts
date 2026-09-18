/**
 * Authoritative Payment Aggregate lifecycle states.
 * Reconciled hierarchy:
 * CREATED -> PROCESSING -> SUCCESS
 * PROCESSING -> FAILED
 * SUCCESS -> REFUNDED
 */
export enum PaymentStatus {
  CREATED = 'CREATED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}
