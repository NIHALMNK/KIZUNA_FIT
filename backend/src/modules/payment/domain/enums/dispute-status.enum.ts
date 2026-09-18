/**
 * Authoritative Dispute lifecycle states.
 * OPEN -> UNDER_INVESTIGATION -> RESOLVED -> CLOSED
 * Active dispute ('OPEN', 'UNDER_INVESTIGATION') freezes refunds and payouts.
 */
export enum DisputeStatus {
  OPEN = 'OPEN',
  UNDER_INVESTIGATION = 'UNDER_INVESTIGATION',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
