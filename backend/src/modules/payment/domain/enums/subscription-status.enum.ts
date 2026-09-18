/**
 * Authoritative Subscription entity lifecycle states.
 * PENDING -> ACTIVE -> COMPLETED
 * ACTIVE -> CANCELLED | REFUNDED | EXPIRED
 */
export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED',
}
