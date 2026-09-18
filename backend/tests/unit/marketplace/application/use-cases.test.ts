import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/create-trainer-request/create-trainer-request.use-case';
import { GetTrainerRequestsUseCase } from '../../../../src/modules/marketplace/application/use-cases/get-trainer-requests/get-trainer-requests.use-case';
import { GetTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/get-trainer-request/get-trainer-request.use-case';
import { AcceptTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/accept-trainer-request/accept-trainer-request.use-case';
import { RejectTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/reject-trainer-request/reject-trainer-request.use-case';
import { WithdrawTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/withdraw-trainer-request/withdraw-trainer-request.use-case';
import { CloseTrainerRequestUseCase } from '../../../../src/modules/marketplace/application/use-cases/close-trainer-request/close-trainer-request.use-case';
import { SwitchTrainerUseCase } from '../../../../src/modules/marketplace/application/use-cases/switch-trainer/switch-trainer.use-case';
import { IAcquisitionPipelineRepository } from '../../../../src/modules/marketplace/domain/repositories/acquisition-pipeline.repository';
import { ProfileGateway } from '../../../../src/modules/marketplace/application/ports/profile-gateway.port';
import { CoachingGateway } from '../../../../src/modules/marketplace/application/ports/coaching-gateway.port';
import { AcquisitionPipelineFactory } from '../../../../src/modules/marketplace/domain/factories/acquisition-pipeline.factory';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('Marketplace Application Layer Use Cases', () => {
  let mockPipelineRepo: IAcquisitionPipelineRepository;
  let mockProfileGateway: ProfileGateway;
  let mockCoachingGateway: CoachingGateway;

  const sampleSnapshotProps = {
    trainerId: 'trainer_456',
    fullName: 'Alex Trainer',
    headline: 'Certified Fitness Specialist',
    profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
    specializations: ['Fitness'],
    yearsOfExperience: 5,
    averageRating: 4.8,
    totalReviews: 40,
  };

  const createSamplePipeline = () =>
    AcquisitionPipelineFactory.createNewPipeline({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      clientGoal: 'Build muscle and endurance',
      clientMessage: 'Looking forward to working together',
      trainerSnapshot: sampleSnapshotProps,
    }).getValue();

  let activePipeline = createSamplePipeline();

  beforeEach(() => {
    activePipeline = createSamplePipeline();

    mockPipelineRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockImplementation(async () => activePipeline),
      findByRequestId: vi.fn().mockImplementation(async () => activePipeline),
      findActivePipeline: vi.fn().mockResolvedValue(null),
      findActivePipelineBetween: vi.fn().mockResolvedValue(null),
      findByClientId: vi
        .fn()
        .mockImplementation(async () => ({ pipelines: [activePipeline], total: 1 })),
      findByTrainerId: vi
        .fn()
        .mockImplementation(async () => ({ pipelines: [activePipeline], total: 1 })),
      findPendingByTrainer: vi
        .fn()
        .mockImplementation(async () => ({ pipelines: [activePipeline], total: 1 })),
      findHistory: vi
        .fn()
        .mockImplementation(async () => ({ pipelines: [activePipeline], total: 1 })),
    };

    mockProfileGateway = {
      getTrainerEligibilityAndSnapshot: vi.fn().mockResolvedValue({
        eligibility: { verificationStatus: 'APPROVED', availabilityStatus: 'AVAILABLE' },
        snapshot: sampleSnapshotProps,
      }),
    };

    mockCoachingGateway = {
      hasActiveRelationship: vi.fn().mockResolvedValue(false),
    };
  });

  describe('CreateTrainerRequestUseCase', () => {
    it('should successfully create a new trainer request when inputs and policies pass', async () => {
      const useCase = new CreateTrainerRequestUseCase(
        mockPipelineRepo,
        mockProfileGateway,
        mockCoachingGateway,
      );

      const result = await useCase.execute({
        clientId: 'client_123',
        trainerId: 'trainer_456',
        goal: 'Build muscle and endurance',
        message: 'Looking forward to working together',
      });

      expect(result.isSuccess).toBe(true);
      expect(mockPipelineRepo.save).toHaveBeenCalledTimes(1);
      expect(result.getValue().clientId).toBe('client_123');
      expect(result.getValue().status).toBe(AcquisitionPipelineStatus.REQUESTED);
    });

    it('should fail if trainer profile is not found or ineligible', async () => {
      vi.mocked(mockProfileGateway.getTrainerEligibilityAndSnapshot).mockResolvedValueOnce(null);

      const useCase = new CreateTrainerRequestUseCase(
        mockPipelineRepo,
        mockProfileGateway,
        mockCoachingGateway,
      );

      const result = await useCase.execute({
        clientId: 'client_123',
        trainerId: 'invalid_trainer',
        goal: 'Valid goal',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Trainer profile not found');
    });

    it('should fail if client and trainer already have an active coaching relationship', async () => {
      vi.mocked(mockCoachingGateway.hasActiveRelationship).mockResolvedValueOnce(true);

      const useCase = new CreateTrainerRequestUseCase(
        mockPipelineRepo,
        mockProfileGateway,
        mockCoachingGateway,
      );

      const result = await useCase.execute({
        clientId: 'client_123',
        trainerId: 'trainer_456',
        goal: 'Valid goal',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('active coaching relationship');
    });
  });

  describe('GetTrainerRequestsUseCase', () => {
    it('should retrieve paginated trainer requests for a client', async () => {
      const useCase = new GetTrainerRequestsUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        userId: 'client_123',
        isTrainer: false,
        page: 1,
        limit: 10,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().requests.length).toBe(1);
      expect(result.getValue().total).toBe(1);
    });
  });

  describe('GetTrainerRequestUseCase', () => {
    it('should retrieve a single request if user is an authorized participant', async () => {
      const useCase = new GetTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        userId: 'client_123',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().requestId).toBe(activePipeline.trainerRequest.requestId);
    });

    it('should fail if user is not an authorized participant', async () => {
      const useCase = new GetTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        userId: 'outsider_789',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not an authorized participant');
    });
  });

  describe('AcceptTrainerRequestUseCase', () => {
    it('should allow trainer to accept pending request', async () => {
      const useCase = new AcceptTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        trainerId: 'trainer_456',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(AcquisitionPipelineStatus.ACCEPTED);
      expect(mockPipelineRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should fail if non-trainer attempts to accept', async () => {
      const useCase = new AcceptTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        trainerId: 'client_123',
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('RejectTrainerRequestUseCase', () => {
    it('should allow trainer to reject pending request with reason', async () => {
      const useCase = new RejectTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        trainerId: 'trainer_456',
        reason: 'Fully booked',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(AcquisitionPipelineStatus.REJECTED);
      expect(mockPipelineRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('WithdrawTrainerRequestUseCase', () => {
    it('should allow client to withdraw pending request', async () => {
      const useCase = new WithdrawTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        clientId: 'client_123',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(AcquisitionPipelineStatus.WITHDRAWN);
      expect(mockPipelineRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('CloseTrainerRequestUseCase', () => {
    it('should allow trainer to close an accepted request', async () => {
      activePipeline.accept(); // Accept pipeline first

      const useCase = new CloseTrainerRequestUseCase(mockPipelineRepo);

      const result = await useCase.execute({
        requestId: activePipeline.id,
        trainerId: 'trainer_456',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(AcquisitionPipelineStatus.CLOSED);
      expect(mockPipelineRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('SwitchTrainerUseCase', () => {
    it('should cancel active consultation and pipeline for pre-coaching trainer switch', async () => {
      (mockPipelineRepo.findActivePipeline as any).mockResolvedValueOnce(activePipeline);
      const mockConsultationRepo: any = {
        findByAcquisitionPipelineId: vi.fn().mockResolvedValue(null),
        save: vi.fn().mockResolvedValue(undefined),
      };

      const useCase = new SwitchTrainerUseCase(mockPipelineRepo, mockConsultationRepo);

      const result = await useCase.execute({
        clientId: 'client_123',
        reason: 'Client wants another specialization',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().cancelledPipelineId).toBe(activePipeline.id);
      expect(activePipeline.status).toBe(AcquisitionPipelineStatus.CANCELLED);
      expect(mockPipelineRepo.save).toHaveBeenCalled();
    });
  });
});
