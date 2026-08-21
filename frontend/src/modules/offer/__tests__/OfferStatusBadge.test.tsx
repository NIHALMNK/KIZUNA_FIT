import { describe, it, expect } from 'vitest';
import { CoachingOfferStatus, CoachingOfferResponseDTO } from '../domain/types/offer.types';

describe('Offer Presentation Contract & Invariant Tests', () => {
  const sampleOffer: CoachingOfferResponseDTO = {
    offerId: 'offer_123',
    acquisitionPipelineId: 'pipeline_123',
    consultationId: 'consultation_123',
    clientId: 'client_123',
    trainerId: 'trainer_456',
    pricing: {
      trainerFee: 12000,
      platformFee: 0,
      totalAmount: 12000,
      currency: 'INR',
    },
    scope: {
      durationDays: 84,
      planType: '12-Week Transformation Plan',
      includedFeatures: ['Personalized Workout Program', 'Custom Macro Guidance'],
      trainerNotes: 'Discussed during call',
    },
    status: CoachingOfferStatus.SENT,
    expiresAt: '2026-08-28T10:00:00.000Z',
    acceptedAt: null,
    declinedAt: null,
    declineReason: null,
    createdAt: '2026-08-21T10:00:00.000Z',
    updatedAt: '2026-08-21T10:00:00.000Z',
  };

  it('should validate offer data structure contract', () => {
    expect(sampleOffer.offerId).toBe('offer_123');
    expect(sampleOffer.pricing.totalAmount).toBe(12000);
    expect(sampleOffer.pricing.trainerFee + sampleOffer.pricing.platformFee).toBe(
      sampleOffer.pricing.totalAmount,
    );
    expect(sampleOffer.scope.durationDays).toBe(84);
    expect(sampleOffer.status).toBe(CoachingOfferStatus.SENT);
  });

  it('should verify all 5 status values map correctly', () => {
    expect(CoachingOfferStatus.DRAFT).toBe('DRAFT');
    expect(CoachingOfferStatus.SENT).toBe('SENT');
    expect(CoachingOfferStatus.ACCEPTED).toBe('ACCEPTED');
    expect(CoachingOfferStatus.DECLINED).toBe('DECLINED');
    expect(CoachingOfferStatus.EXPIRED).toBe('EXPIRED');
  });
});
