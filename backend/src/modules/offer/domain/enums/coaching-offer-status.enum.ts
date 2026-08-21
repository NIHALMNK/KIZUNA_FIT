/**
 * Authoritative lifecycle status for CoachingOffer aggregate.
 * Source of Truth: 02_BUSINESS_RULES, 06_STATE_MACHINES, 07_ENTITY_MODELING, 08_DATABASE_DESIGN.
 *
 * Lifecycle:
 * DRAFT -> SENT -> ACCEPTED
 *               -> DECLINED
 *               -> EXPIRED
 */
export enum CoachingOfferStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}
