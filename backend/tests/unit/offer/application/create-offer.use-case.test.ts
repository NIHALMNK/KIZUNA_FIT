import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateOfferUseCase } from '../../../../src/modules/offer/application/use-cases/create-offer.use-case';
import { ICoachingOfferRepository } from '../../../../src/modules/offer/domain/repositories/coaching-offer.repository';
import { IConsultationRepository } from '../../../../src/modules/consultation/domain/repositories/consultation.repository';
import { Consultation } from '../../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { ConsultationStatus } from '../../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { CoachingOffer } from '../../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { CoachingPlanType } from '../../../../src/modules/offer/domain/enums/coaching-plan-type.enum';

describe('CreateOfferUseCase with Server-Side Plan Derivation', () => {
  let useCase: CreateOfferUseCase;
  let mockOfferRepo: ICoachingOfferRepository;
  let mockConsultationRepo: IConsultationRepository;

  const sampleSlot = ConsultationSlot.create({
    scheduledStartAt: new Date(Date.now() - 7200000),
    scheduledEndAt: new Date(Date.now() - 3600000),
    timezone: 'UTC',
  }).getValue();

  const createCompletedConsultation = () => {
    return Consultation.create(
      {
        acquisitionPipelineId: 'pipeline_123',
        clientId: 'client_456',
        trainerId: 'trainer_789',
        slot: sampleSlot,
        status: ConsultationStatus.COMPLETED,
        completedAt: new Date(),
      },
      'consult_123',
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

    mockConsultationRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(createCompletedConsultation()),
      findByAcquisitionPipelineId: vi.fn().mockResolvedValue(null),
      findByClientId: vi.fn().mockResolvedValue({ consultations: [], total: 0 }),
      findByTrainerId: vi.fn().mockResolvedValue({ consultations: [], total: 0 }),
      findByRoomId: vi.fn().mockResolvedValue(null),
      findUpcomingByParticipant: vi.fn().mockResolvedValue({ consultations: [], total: 0 }),
      findHistoryByParticipant: vi.fn().mockResolvedValue({ consultations: [], total: 0 }),
    };

    useCase = new CreateOfferUseCase(mockOfferRepo, mockConsultationRepo);
  });

  it('should create offer with server-side PRO plan commission (15%) and 30-day scope', async () => {
    const result = await useCase.execute({
      consultationId: 'consult_123',
      trainerId: 'trainer_789',
      planType: CoachingPlanType.PRO,
      trainerFee: 10000,
      currency: 'INR',
      trainerNotes: 'Personalized strength program',
      sendImmediately: true,
    });

    expect(result.isSuccess).toBe(true);
    const dto = result.getValue();
    expect(dto.consultationId).toBe('consult_123');
    expect(dto.clientId).toBe('client_456');
    expect(dto.trainerId).toBe('trainer_789');
    expect(dto.status).toBe(CoachingOfferStatus.SENT);

    // Derived Financials: 10000 trainerFee + 15% (1500) platformFee = 11500 totalAmount
    expect(dto.pricing.trainerFee).toBe(10000);
    expect(dto.pricing.commissionRate).toBe(0.15);
    expect(dto.pricing.platformFee).toBe(1500);
    expect(dto.pricing.totalAmount).toBe(11500);

    // Derived Scope: 30 days
    expect(dto.scope.durationDays).toBe(30);
    expect(dto.scope.planType).toBe('PRO');
    expect(dto.scope.includedFeatures).toContain('3 Live Sessions / Week');
    expect(dto.scope.includedFeatures).toContain('Progress Analyzer');

    expect(mockOfferRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should create offer with server-side BASIC plan commission (10%)', async () => {
    const result = await useCase.execute({
      consultationId: 'consult_123',
      trainerId: 'trainer_789',
      planType: CoachingPlanType.BASIC,
      trainerFee: 10000,
      sendImmediately: false,
    });

    expect(result.isSuccess).toBe(true);
    const dto = result.getValue();
    expect(dto.status).toBe(CoachingOfferStatus.DRAFT);
    expect(dto.pricing.commissionRate).toBe(0.1);
    expect(dto.pricing.platformFee).toBe(1000);
    expect(dto.pricing.totalAmount).toBe(11000);
    expect(dto.scope.durationDays).toBe(30);
  });

  it('should create offer with server-side PREMIUM plan commission (20%)', async () => {
    const result = await useCase.execute({
      consultationId: 'consult_123',
      trainerId: 'trainer_789',
      planType: CoachingPlanType.PREMIUM,
      trainerFee: 10000,
      sendImmediately: true,
    });

    expect(result.isSuccess).toBe(true);
    const dto = result.getValue();
    expect(dto.pricing.commissionRate).toBe(0.2);
    expect(dto.pricing.platformFee).toBe(2000);
    expect(dto.pricing.totalAmount).toBe(12000);
    expect(dto.scope.durationDays).toBe(30);
    expect(dto.scope.includedFeatures).toContain('Unlimited Live Sessions');
  });

  it('should fail if consultation is not in COMPLETED status', async () => {
    const activeConsultation = Consultation.create(
      {
        acquisitionPipelineId: 'pipeline_123',
        clientId: 'client_456',
        trainerId: 'trainer_789',
        slot: sampleSlot,
        status: ConsultationStatus.SCHEDULED,
      },
      'consult_123',
    ).getValue();

    vi.spyOn(mockConsultationRepo, 'findById').mockResolvedValue(activeConsultation);

    const result = await useCase.execute({
      consultationId: 'consult_123',
      trainerId: 'trainer_789',
      planType: CoachingPlanType.PRO,
      trainerFee: 10000,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain("is currently 'SCHEDULED'");
  });

  it('should fail if an offer already exists for the consultation', async () => {
    const existingOffer = {} as CoachingOffer;
    vi.spyOn(mockOfferRepo, 'findByConsultationId').mockResolvedValue(existingOffer);

    const result = await useCase.execute({
      consultationId: 'consult_123',
      trainerId: 'trainer_789',
      planType: CoachingPlanType.PRO,
      trainerFee: 10000,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('already exists for consultation');
  });
});
