import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SendOfferUseCase } from '../../../../src/modules/offer/application/use-cases/send-offer.use-case';
import { AcceptOfferUseCase } from '../../../../src/modules/offer/application/use-cases/accept-offer.use-case';
import { DeclineOfferUseCase } from '../../../../src/modules/offer/application/use-cases/decline-offer.use-case';
import { ExpireOfferUseCase } from '../../../../src/modules/offer/application/use-cases/expire-offer.use-case';
import { ICoachingOfferRepository } from '../../../../src/modules/offer/domain/repositories/coaching-offer.repository';
import { CoachingOffer } from '../../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';

describe('Offer Lifecycle Use Cases', () => {
  let mockOfferRepo: ICoachingOfferRepository;

  const samplePricing = PricingSnapshot.create({
    trainerFee: 10000,
  }).getValue();

  const sampleScope = ScopeSnapshot.create({
    durationDays: 30,
    planType: 'Basic 1-Month',
  }).getValue();

  const createDraftOffer = () => {
    return CoachingOffer.create(
      {
        acquisitionPipelineId: 'pipe_123',
        consultationId: 'consult_456',
        clientId: 'client_789',
        trainerId: 'trainer_101',
        pricingSnapshot: samplePricing,
        scopeSnapshot: sampleScope,
        status: CoachingOfferStatus.DRAFT,
      },
      'offer_123',
    ).getValue();
  };

  const createSentOffer = () => {
    return CoachingOffer.create(
      {
        acquisitionPipelineId: 'pipe_123',
        consultationId: 'consult_456',
        clientId: 'client_789',
        trainerId: 'trainer_101',
        pricingSnapshot: samplePricing,
        scopeSnapshot: sampleScope,
        status: CoachingOfferStatus.SENT,
      },
      'offer_123',
    ).getValue();
  };

  beforeEach(() => {
    mockOfferRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(null),
      findByConsultationId: vi.fn().mockResolvedValue(null),
      findByAcquisitionPipelineId: vi.fn().mockResolvedValue(null),
      findByClientId: vi.fn().mockResolvedValue({ offers: [], total: 0 }),
      findByTrainerId: vi.fn().mockResolvedValue({ offers: [], total: 0 }),
      findExpiredPendingOffers: vi.fn().mockResolvedValue([]),
    };
  });

  describe('SendOfferUseCase', () => {
    it('should transition draft offer to SENT when called by trainer', async () => {
      const offer = createDraftOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new SendOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
        trainerId: 'trainer_101',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(CoachingOfferStatus.SENT);
      expect(mockOfferRepo.save).toHaveBeenCalledWith(offer);
    });

    it('should reject if called by non-trainer user', async () => {
      const offer = createDraftOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new SendOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
        trainerId: 'wrong_trainer',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('is not authorized');
    });
  });

  describe('AcceptOfferUseCase', () => {
    it('should transition SENT offer to ACCEPTED when called by recipient client', async () => {
      const offer = createSentOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new AcceptOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
        clientId: 'client_789',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(CoachingOfferStatus.ACCEPTED);
      expect(mockOfferRepo.save).toHaveBeenCalledWith(offer);
    });

    it('should reject if called by non-client user', async () => {
      const offer = createSentOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new AcceptOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
        clientId: 'wrong_client',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('is not authorized');
    });
  });

  describe('DeclineOfferUseCase', () => {
    it('should transition SENT offer to DECLINED when called by recipient client', async () => {
      const offer = createSentOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new DeclineOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
        clientId: 'client_789',
        reason: 'Price too high',
      });

      expect(result.isSuccess).toBe(true);
      const dto = result.getValue();
      expect(dto.status).toBe(CoachingOfferStatus.DECLINED);
      expect(dto.declineReason).toBe('Price too high');
      expect(mockOfferRepo.save).toHaveBeenCalledWith(offer);
    });
  });

  describe('ExpireOfferUseCase', () => {
    it('should transition SENT offer to EXPIRED', async () => {
      const offer = createSentOffer();
      vi.spyOn(mockOfferRepo, 'findById').mockResolvedValue(offer);

      const useCase = new ExpireOfferUseCase(mockOfferRepo);
      const result = await useCase.execute({
        offerId: 'offer_123',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(CoachingOfferStatus.EXPIRED);
      expect(mockOfferRepo.save).toHaveBeenCalledWith(offer);
    });
  });
});
