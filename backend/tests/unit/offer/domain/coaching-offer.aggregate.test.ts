import { describe, it, expect } from 'vitest';
import { CoachingOffer } from '../../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';
import { OfferCreatedEvent } from '../../../../src/modules/offer/domain/events/offer-created.event';
import { OfferSentEvent } from '../../../../src/modules/offer/domain/events/offer-sent.event';
import { OfferAcceptedEvent } from '../../../../src/modules/offer/domain/events/offer-accepted.event';
import { OfferDeclinedEvent } from '../../../../src/modules/offer/domain/events/offer-declined.event';
import { OfferExpiredEvent } from '../../../../src/modules/offer/domain/events/offer-expired.event';
import {
  InvalidOfferStateTransitionException,
  OfferExpiredException,
  OfferImmutableException,
} from '../../../../src/modules/offer/domain/exceptions/offer-domain.exceptions';

describe('CoachingOffer Aggregate Root', () => {
  const samplePricing = PricingSnapshot.create({
    trainerFee: 12000,
    platformFee: 0,
    currency: 'INR',
  }).getValue();

  const sampleScope = ScopeSnapshot.create({
    durationDays: 84, // 12 weeks
    planType: '12-Week Transformation',
    includedFeatures: ['Custom Nutrition', 'Weekly Review', 'Chat Support'],
    trainerNotes: 'Tailored for body recomposition',
  }).getValue();

  it('should successfully create a new CoachingOffer in DRAFT status and emit OfferCreatedEvent', () => {
    const result = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.DRAFT,
    });

    expect(result.isSuccess).toBe(true);
    const offer = result.getValue();
    expect(offer.status).toBe(CoachingOfferStatus.DRAFT);
    expect(offer.acquisitionPipelineId).toBe('pipe_123');
    expect(offer.consultationId).toBe('consult_456');
    expect(offer.clientId).toBe('client_789');
    expect(offer.trainerId).toBe('trainer_101');
    expect(offer.pricingSnapshot.totalAmount).toBe(12000);
    expect(offer.scopeSnapshot.durationDays).toBe(84);
    expect(offer.isTerminal()).toBe(false);

    expect(offer.domainEvents).toHaveLength(1);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferCreatedEvent);
  });

  it('should prevent client and trainer from being the same user', () => {
    const result = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'user_same',
      trainerId: 'user_same',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Client cannot create an offer for themselves');
  });

  it('should create offer in SENT status directly and emit OfferCreatedEvent & OfferSentEvent with 7-day validity', () => {
    const before = Date.now();
    const result = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    });

    expect(result.isSuccess).toBe(true);
    const offer = result.getValue();
    expect(offer.status).toBe(CoachingOfferStatus.SENT);

    // Verify 7-day expiration
    const expectedExpiryMin = before + 7 * 24 * 60 * 60 * 1000 - 5000;
    const expectedExpiryMax = Date.now() + 7 * 24 * 60 * 60 * 1000 + 5000;
    expect(offer.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedExpiryMin);
    expect(offer.expiresAt.getTime()).toBeLessThanOrEqual(expectedExpiryMax);

    expect(offer.domainEvents).toHaveLength(2);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferCreatedEvent);
    expect(offer.domainEvents[1]).toBeInstanceOf(OfferSentEvent);
  });

  it('should transition from DRAFT to SENT and emit OfferSentEvent', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.DRAFT,
    }).getValue();

    offer.clearEvents();
    offer.send();

    expect(offer.status).toBe(CoachingOfferStatus.SENT);
    expect(offer.domainEvents).toHaveLength(1);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferSentEvent);
  });

  it('should transition from SENT to ACCEPTED and emit OfferAcceptedEvent', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    }).getValue();

    offer.clearEvents();
    offer.accept();

    expect(offer.status).toBe(CoachingOfferStatus.ACCEPTED);
    expect(offer.acceptedAt).toBeInstanceOf(Date);
    expect(offer.isTerminal()).toBe(true);
    expect(offer.isImmutable()).toBe(true);
    expect(offer.domainEvents).toHaveLength(1);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferAcceptedEvent);
  });

  it('should transition from SENT to DECLINED and emit OfferDeclinedEvent', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    }).getValue();

    offer.clearEvents();
    offer.decline('Budget constraints');

    expect(offer.status).toBe(CoachingOfferStatus.DECLINED);
    expect(offer.declinedAt).toBeInstanceOf(Date);
    expect(offer.declineReason).toBe('Budget constraints');
    expect(offer.isTerminal()).toBe(true);
    expect(offer.domainEvents).toHaveLength(1);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferDeclinedEvent);
  });

  it('should transition from SENT to EXPIRED and emit OfferExpiredEvent', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    }).getValue();

    offer.clearEvents();
    offer.expire();

    expect(offer.status).toBe(CoachingOfferStatus.EXPIRED);
    expect(offer.isTerminal()).toBe(true);
    expect(offer.domainEvents).toHaveLength(1);
    expect(offer.domainEvents[0]).toBeInstanceOf(OfferExpiredEvent);
  });

  it('should throw OfferExpiredException if trying to accept an offer past its expiration date', () => {
    const pastDate = new Date(Date.now() - 10000);
    const offer = CoachingOffer.create(
      {
        acquisitionPipelineId: 'pipe_123',
        consultationId: 'consult_456',
        clientId: 'client_789',
        trainerId: 'trainer_101',
        pricingSnapshot: samplePricing,
        scopeSnapshot: sampleScope,
        status: CoachingOfferStatus.SENT,
        expiresAt: pastDate,
      },
      'offer_expired_test',
    ).getValue();

    expect(offer.isExpired()).toBe(true);
    expect(() => offer.accept()).toThrow(OfferExpiredException);
  });

  it('should throw OfferImmutableException or InvalidOfferStateTransitionException when attempting to transition from terminal states', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    }).getValue();

    offer.accept();

    expect(() => offer.accept()).toThrow(OfferImmutableException);
    expect(() => offer.decline()).toThrow(OfferImmutableException);
    expect(() => offer.expire()).toThrow(OfferImmutableException);
    expect(() => offer.send()).toThrow(InvalidOfferStateTransitionException);
  });

  it('should verify terminal and immutable properties on accepted offer', () => {
    const offer = CoachingOffer.create({
      acquisitionPipelineId: 'pipe_123',
      consultationId: 'consult_456',
      clientId: 'client_789',
      trainerId: 'trainer_101',
      pricingSnapshot: samplePricing,
      scopeSnapshot: sampleScope,
      status: CoachingOfferStatus.SENT,
    }).getValue();

    expect(offer.isTerminal()).toBe(false);
    expect(offer.isImmutable()).toBe(false);

    offer.accept();

    expect(offer.isTerminal()).toBe(true);
    expect(offer.isImmutable()).toBe(true);
  });
});
