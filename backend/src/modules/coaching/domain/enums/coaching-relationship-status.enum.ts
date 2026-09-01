/**
 * Authoritative 7-state lifecycle for CoachingRelationship (SM-07).
 * No PAUSED, SUSPENDED, or RESUMED states are allowed.
 */
export enum CoachingRelationshipStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
  EXPIRED = 'EXPIRED',
}
