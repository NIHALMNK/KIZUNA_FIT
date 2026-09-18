/**
 * Authoritative Payout lifecycle states.
 * PENDING -> ON_HOLD -> PROCESSING -> PAID
 * Failure: PROCESSING -> FAILED
 */
export enum PayoutStatus {
  PENDING = 'PENDING',
  ON_HOLD = 'ON_HOLD',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}
