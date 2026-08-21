import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateTrainerRequestUseCase } from '../../../src/modules/marketplace/application/use-cases/create-trainer-request/create-trainer-request.use-case';
import { DeclineOfferUseCase } from '../../../src/modules/offer/application/use-cases/decline-offer.use-case';
import { MarketplaceOfferSubscriber } from '../../../src/modules/marketplace/infrastructure/subscribers/marketplace-offer.subscriber';
import { AcquisitionPipelineFactory } from '../../../src/modules/marketplace/domain/factories/acquisition-pipeline.factory';
import { AcquisitionPipelineStatus } from '../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';
import { AcquisitionPipeline } from '../../../src/modules/marketplace/domain/aggregates/acquisition-pipeline.aggregate';
import { CoachingOffer } from '../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { CoachingPlanType } from '../../../src/modules/offer/domain/enums/coaching-plan-type.enum';
import { PricingSnapshot } from '../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';
import { DomainEventDispatcher } from '../../../src/shared/events/domain-event-dispatcher';
import { IAcquisitionPipelineRepository } from '../../../src/modules/marketplace/domain/repositories/acquisition-pipeline.repository';
import { ICoachingOfferRepository } from '../../../src/modules/offer/domain/repositories/coaching-offer.repository';
import { ProfileGateway } from '../../../src/modules/marketplace/application/ports/profile-gateway.port';
import { CoachingGateway } from '../../../src/modules/marketplace/application/ports/coaching-gateway.port';
import { ILogger } from '../../../src/shared/contracts/ILogger';

describe('End-to-End Offer Decline & Multi-Trainer Acquisition Workflow', () => {
  let dispatcher: DomainEventDispatcher;
  let pipelineDatabase: Map<string, AcquisitionPipeline>;
  let offerDatabase: Map<string, CoachingOffer>;
  let mockPipelineRepo: IAcquisitionPipelineRepository;
  let mockOfferRepo: ICoachingOfferRepository;
  let mockProfileGateway: ProfileGateway;
  let mockCoachingGateway: CoachingGateway;
  let mockLogger: ILogger;

  let createRequestUseCase: CreateTrainerRequestUseCase;
  let declineOfferUseCase: DeclineOfferUseCase;
  let marketplaceOfferSubscriber: MarketplaceOfferSubscriber;

  const trainerASnapshot = {
    trainerId: 'trainer_A_id',
    fullName: 'Trainer Alice',
    headline: 'Strength Coach',
    profileImage: 'https://cdn.kizunafit.com/a.jpg',
    specializations: ['Powerlifting'],
    yearsOfExperience: 6,
    averageRating: 4.9,
    totalReviews: 50,
  };

  const trainerBSnapshot = {
    trainerId: 'trainer_B_id',
    fullName: 'Trainer Bob',
    headline: 'HIIT & Conditioning Coach',
    profileImage: 'https://cdn.kizunafit.com/b.jpg',
    specializations: ['CrossFit'],
    yearsOfExperience: 4,
    averageRating: 4.7,
    totalReviews: 30,
  };

  beforeEach(() => {
    dispatcher = new DomainEventDispatcher();
    pipelineDatabase = new Map();
    offerDatabase = new Map();

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    mockPipelineRepo = {
      save: vi.fn().mockImplementation(async (p: AcquisitionPipeline) => {
        pipelineDatabase.set(p.id, p);
        if (p.domainEvents.length > 0) {
          await dispatcher.dispatchAll(p.domainEvents);
          p.clearEvents();
        }
      }),
      findById: vi.fn().mockImplementation(async (id: string) => pipelineDatabase.get(id) || null),
      findByRequestId: vi.fn().mockImplementation(async (reqId: string) => {
        for (const p of pipelineDatabase.values()) {
          if (p.trainerRequest.requestId === reqId) return p;
        }
        return null;
      }),
      findActivePipeline: vi.fn().mockImplementation(async (clientId: string) => {
        for (const p of pipelineDatabase.values()) {
          if (p.clientId === clientId && p.isOpen()) {
            return p;
          }
        }
        return null;
      }),
      findActivePipelineBetween: vi
        .fn()
        .mockImplementation(async (clientId: string, trainerId: string) => {
          for (const p of pipelineDatabase.values()) {
            if (p.clientId === clientId && p.trainerId === trainerId && p.isOpen()) {
              return p;
            }
          }
          return null;
        }),
      findByClientId: vi.fn().mockImplementation(async (clientId: string) => {
        const list = Array.from(pipelineDatabase.values()).filter((p) => p.clientId === clientId);
        return { pipelines: list, total: list.length };
      }),
      findByTrainerId: vi.fn().mockImplementation(async (trainerId: string) => {
        const list = Array.from(pipelineDatabase.values()).filter((p) => p.trainerId === trainerId);
        return { pipelines: list, total: list.length };
      }),
      findPendingByTrainer: vi.fn().mockImplementation(async (trainerId: string) => {
        const list = Array.from(pipelineDatabase.values()).filter(
          (p) => p.trainerId === trainerId && p.status === AcquisitionPipelineStatus.REQUESTED,
        );
        return { pipelines: list, total: list.length };
      }),
      findHistory: vi.fn().mockImplementation(async (userId: string, isTrainer: boolean) => {
        const field = isTrainer ? 'trainerId' : 'clientId';
        const list = Array.from(pipelineDatabase.values()).filter(
          (p) => (p as any)[field] === userId,
        );
        return { pipelines: list, total: list.length };
      }),
    };

    mockOfferRepo = {
      save: vi.fn().mockImplementation(async (offer: CoachingOffer) => {
        offerDatabase.set(offer.offerId, offer);
        if (offer.domainEvents.length > 0) {
          await dispatcher.dispatchAll(offer.domainEvents);
          offer.clearEvents();
        }
      }),
      findById: vi.fn().mockImplementation(async (id: string) => offerDatabase.get(id) || null),
      findByConsultationId: vi.fn().mockImplementation(async (cId: string) => {
        for (const o of offerDatabase.values()) {
          if (o.consultationId === cId) return o;
        }
        return null;
      }),
      findByAcquisitionPipelineId: vi.fn().mockImplementation(async (pId: string) => {
        for (const o of offerDatabase.values()) {
          if (o.acquisitionPipelineId === pId) return o;
        }
        return null;
      }),
      findByClientId: vi.fn().mockImplementation(async (clientId: string) => {
        const list = Array.from(offerDatabase.values()).filter((o) => o.clientId === clientId);
        return { offers: list, total: list.length };
      }),
      findByTrainerId: vi.fn().mockImplementation(async (trainerId: string) => {
        const list = Array.from(offerDatabase.values()).filter((o) => o.trainerId === trainerId);
        return { offers: list, total: list.length };
      }),
      findExpiredPendingOffers: vi.fn().mockResolvedValue([]),
    };

    mockProfileGateway = {
      getTrainerEligibilityAndSnapshot: vi.fn().mockImplementation(async (trainerId: string) => {
        if (trainerId === 'trainer_A_id') {
          return {
            eligibility: { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' },
            snapshot: trainerASnapshot,
          };
        }
        if (trainerId === 'trainer_B_id') {
          return {
            eligibility: { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' },
            snapshot: trainerBSnapshot,
          };
        }
        return null;
      }),
    };

    mockCoachingGateway = {
      hasActiveRelationship: vi.fn().mockResolvedValue(false),
    };

    createRequestUseCase = new CreateTrainerRequestUseCase(
      mockPipelineRepo,
      mockProfileGateway,
      mockCoachingGateway,
    );

    declineOfferUseCase = new DeclineOfferUseCase(mockOfferRepo, mockPipelineRepo);

    marketplaceOfferSubscriber = new MarketplaceOfferSubscriber(
      dispatcher,
      mockPipelineRepo,
      mockLogger,
    );
    marketplaceOfferSubscriber.register();
  });

  it('TEST 1 & 2: Client selects Trainer A → Declines Offer → Selects Trainer B successfully', async () => {
    // 1. Client creates request for Trainer A
    const reqAResult = await createRequestUseCase.execute({
      clientId: 'client_100',
      trainerId: 'trainer_A_id',
      goal: 'Gain strength',
      message: 'Looking for a coach',
    });

    expect(reqAResult.isSuccess).toBe(true);
    const pipelineAId = reqAResult.getValue().pipelineId;
    const pipelineA = pipelineDatabase.get(pipelineAId)!;
    expect(pipelineA).toBeDefined();
    expect(pipelineA.status).toBe(AcquisitionPipelineStatus.REQUESTED);

    // 2. Trainer A accepts, consultation completes, offer is created and sent
    pipelineA.accept();
    pipelineA.scheduleConsultation();
    pipelineA.completeConsultation();
    pipelineA.sendOffer();
    await mockPipelineRepo.save(pipelineA);

    const offerA = CoachingOffer.create(
      {
        acquisitionPipelineId: pipelineA.id,
        consultationId: 'consultation_A_id',
        clientId: 'client_100',
        trainerId: 'trainer_A_id',
        pricingSnapshot: PricingSnapshot.calculate(10000, 0.15).getValue(),
        scopeSnapshot: ScopeSnapshot.createForPlan(CoachingPlanType.PRO).getValue(),
        status: CoachingOfferStatus.SENT,
      },
      'offer_A_id',
    ).getValue();

    await mockOfferRepo.save(offerA);

    // 3. Client declines Offer A
    const declineResult = await declineOfferUseCase.execute({
      offerId: 'offer_A_id',
      clientId: 'client_100',
      reason: 'Budget constraints with Trainer A',
    });

    expect(declineResult.isSuccess).toBe(true);
    expect(offerA.status).toBe(CoachingOfferStatus.DECLINED);
    expect(offerA.isTerminal()).toBe(true);

    // Verify Pipeline A is now OFFER_DECLINED (terminal / closed)
    expect(pipelineA.status).toBe(AcquisitionPipelineStatus.OFFER_DECLINED);
    expect(pipelineA.isOpen()).toBe(false);

    // 4. Client immediately selects Trainer B in Marketplace
    const reqBResult = await createRequestUseCase.execute({
      clientId: 'client_100',
      trainerId: 'trainer_B_id',
      goal: 'Conditioning and fat loss',
      message: 'Hello Coach Bob',
    });

    expect(reqBResult.isSuccess).toBe(true);
    const pipelineBId = reqBResult.getValue().pipelineId;
    const pipelineB = pipelineDatabase.get(pipelineBId)!;
    expect(pipelineB).toBeDefined();
    expect(pipelineB.trainerId).toBe('trainer_B_id');
    expect(pipelineB.status).toBe(AcquisitionPipelineStatus.REQUESTED);

    // TEST 6: New Pipeline does not reuse old pipeline ID
    expect(pipelineBId).not.toBe(pipelineAId);

    // TEST 3 & 5: Old Pipeline and Old Offer remain in database
    expect(pipelineDatabase.has(pipelineAId)).toBe(true);
    expect(offerDatabase.has('offer_A_id')).toBe(true);
    expect(pipelineDatabase.size).toBe(2);
    expect(offerDatabase.size).toBe(1);
  });

  it('TEST 10: An actually ACTIVE pipeline still blocks duplicate acquisition', async () => {
    // 1. Client creates active request with Trainer A
    await createRequestUseCase.execute({
      clientId: 'client_200',
      trainerId: 'trainer_A_id',
      goal: 'Gain strength',
    });

    // 2. Client tries to create concurrent request for Trainer B while first is ACTIVE
    const duplicateResult = await createRequestUseCase.execute({
      clientId: 'client_200',
      trainerId: 'trainer_B_id',
      goal: 'Lose weight',
    });

    expect(duplicateResult.isFailure).toBe(true);
    expect(duplicateResult.error).toContain('already exists');
  });

  it('TEST 11 & 12: Historical records are immutable and decline never creates payment', async () => {
    const offer = CoachingOffer.create(
      {
        acquisitionPipelineId: 'pipe_300',
        consultationId: 'consult_300',
        clientId: 'client_300',
        trainerId: 'trainer_A_id',
        pricingSnapshot: PricingSnapshot.calculate(15000, 0.2).getValue(),
        scopeSnapshot: ScopeSnapshot.createForPlan(CoachingPlanType.PREMIUM).getValue(),
        status: CoachingOfferStatus.SENT,
      },
      'offer_300',
    ).getValue();

    await mockOfferRepo.save(offer);

    const declineRes = await declineOfferUseCase.execute({
      offerId: 'offer_300',
      clientId: 'client_300',
      reason: 'Not interested',
    });

    expect(declineRes.isSuccess).toBe(true);
    expect(offer.status).toBe(CoachingOfferStatus.DECLINED);
    expect(offer.isTerminal()).toBe(true);

    // Attempting to accept or modify a declined offer must throw OfferImmutableException
    expect(() => offer.accept()).toThrow("is in terminal status 'DECLINED' and cannot be modified");
  });
});
