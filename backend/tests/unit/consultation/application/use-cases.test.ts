import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateConsultationUseCase } from '../../../../src/modules/consultation/application/use-cases/create-consultation.use-case';
import { BookConsultationSlotUseCase } from '../../../../src/modules/consultation/application/use-cases/book-consultation-slot.use-case';
import { ScheduleConsultationUseCase } from '../../../../src/modules/consultation/application/use-cases/schedule-consultation.use-case';
import { ConfirmConsultationScheduleUseCase } from '../../../../src/modules/consultation/application/use-cases/confirm-consultation-schedule.use-case';
import { CancelConsultationUseCase } from '../../../../src/modules/consultation/application/use-cases/cancel-consultation.use-case';
import { CompleteConsultationUseCase } from '../../../../src/modules/consultation/application/use-cases/complete-consultation.use-case';
import { MarkConsultationNoShowUseCase } from '../../../../src/modules/consultation/application/use-cases/mark-consultation-no-show.use-case';
import { GetConsultationUseCase } from '../../../../src/modules/consultation/application/use-cases/get-consultation.use-case';
import { GetConsultationByPipelineUseCase } from '../../../../src/modules/consultation/application/use-cases/get-consultation-by-pipeline.use-case';
import { GetUpcomingConsultationsUseCase } from '../../../../src/modules/consultation/application/use-cases/get-upcoming-consultations.use-case';
import { GetConsultationHistoryUseCase } from '../../../../src/modules/consultation/application/use-cases/get-consultation-history.use-case';
import { GetConsultationByRoomIdUseCase } from '../../../../src/modules/consultation/application/use-cases/get-consultation-by-room-id.use-case';

import { Consultation } from '../../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { ConsultationStatus } from '../../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../src/modules/consultation/domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../../../src/modules/consultation/domain/enums/cancellation-actor.enum';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('Consultation Application Layer Use Cases', () => {
  let mockConsultationRepo: any;
  let mockPipelineRepo: any;

  const pipelineId = 'pipe_1786359655394_11qed';
  const clientId = 'client_123';
  const trainerId = 'trainer_456';
  const consultationId = 'consultation_1786359655394_abc';
  const roomId = 'room_abc123';

  const sampleSlot = ConsultationSlot.create({
    scheduledStartAt: new Date(Date.now() + 3600000),
    scheduledEndAt: new Date(Date.now() + 7200000),
    timezone: 'UTC',
  }).getValue();

  const sampleConsultation = Consultation.create(
    {
      acquisitionPipelineId: pipelineId,
      clientId,
      trainerId,
      slot: sampleSlot,
      roomId,
    },
    consultationId,
  ).getValue();

  const samplePipeline = {
    id: pipelineId,
    clientId,
    trainerId,
    status: AcquisitionPipelineStatus.ACCEPTED,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockConsultationRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn().mockResolvedValue(sampleConsultation),
      findByAcquisitionPipelineId: vi.fn().mockResolvedValue(null),
      findByClientId: vi.fn().mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findByTrainerId: vi.fn().mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findUpcomingByClientId: vi
        .fn()
        .mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findUpcomingByTrainerId: vi
        .fn()
        .mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findHistoryByClientId: vi
        .fn()
        .mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findHistoryByTrainerId: vi
        .fn()
        .mockResolvedValue({ consultations: [sampleConsultation], total: 1 }),
      findByRoomId: vi.fn().mockResolvedValue(sampleConsultation),
    };

    mockPipelineRepo = {
      findById: vi.fn().mockResolvedValue(samplePipeline),
    };
  });

  describe('CreateConsultationUseCase', () => {
    it('should successfully create and save a new consultation for an ACCEPTED pipeline', async () => {
      const useCase = new CreateConsultationUseCase(mockConsultationRepo, mockPipelineRepo);
      const result = await useCase.execute({
        acquisitionPipelineId: pipelineId,
        userId: clientId,
        scheduledStartAt: new Date(Date.now() + 3600000),
        scheduledEndAt: new Date(Date.now() + 7200000),
        timezone: 'UTC',
      });

      expect(result.isSuccess).toBe(true);
      expect(mockConsultationRepo.save).toHaveBeenCalledTimes(1);
      const data = result.getValue();
      expect(data.acquisitionPipelineId).toBe(pipelineId);
      expect(data.status).toBe(ConsultationStatus.CREATED);
    });

    it('should fail if acquisition pipeline is not found', async () => {
      mockPipelineRepo.findById.mockResolvedValueOnce(null);
      const useCase = new CreateConsultationUseCase(mockConsultationRepo, mockPipelineRepo);
      const result = await useCase.execute({
        acquisitionPipelineId: 'non_existent_pipe',
        userId: clientId,
        scheduledStartAt: new Date(Date.now() + 3600000),
        scheduledEndAt: new Date(Date.now() + 7200000),
        timezone: 'UTC',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('was not found');
    });

    it('should fail if acquisition pipeline is not in ACCEPTED status', async () => {
      mockPipelineRepo.findById.mockResolvedValueOnce({
        ...samplePipeline,
        status: AcquisitionPipelineStatus.REQUESTED,
      });
      const useCase = new CreateConsultationUseCase(mockConsultationRepo, mockPipelineRepo);
      const result = await useCase.execute({
        acquisitionPipelineId: pipelineId,
        userId: clientId,
        scheduledStartAt: new Date(Date.now() + 3600000),
        scheduledEndAt: new Date(Date.now() + 7200000),
        timezone: 'UTC',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Pipeline must be ACCEPTED');
    });

    it('should fail if consultation already exists for the pipeline', async () => {
      mockConsultationRepo.findByAcquisitionPipelineId.mockResolvedValueOnce(sampleConsultation);
      const useCase = new CreateConsultationUseCase(mockConsultationRepo, mockPipelineRepo);
      const result = await useCase.execute({
        acquisitionPipelineId: pipelineId,
        userId: clientId,
        scheduledStartAt: new Date(Date.now() + 3600000),
        scheduledEndAt: new Date(Date.now() + 7200000),
        timezone: 'UTC',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('already exists for acquisition pipeline');
    });
  });

  describe('BookConsultationSlotUseCase', () => {
    it('should allow client participant to book a slot', async () => {
      const useCase = new BookConsultationSlotUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        clientId,
        scheduledStartAt: new Date(Date.now() + 4000000),
        scheduledEndAt: new Date(Date.now() + 7600000),
        timezone: 'UTC',
      });

      expect(result.isSuccess).toBe(true);
      expect(mockConsultationRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should reject booking attempt by unauthorized client', async () => {
      const useCase = new BookConsultationSlotUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        clientId: 'unauthorized_user',
        scheduledStartAt: new Date(Date.now() + 4000000),
        scheduledEndAt: new Date(Date.now() + 7600000),
        timezone: 'UTC',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not an authorized participant');
    });
  });

  describe('ScheduleConsultationUseCase', () => {
    it('should schedule consultation with valid meeting details', async () => {
      const useCase = new ScheduleConsultationUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        userId: trainerId,
        scheduledStartAt: new Date(Date.now() + 4000000),
        scheduledEndAt: new Date(Date.now() + 7600000),
        timezone: 'UTC',
        platform: ConsultationPlatform.WEBRTC,
        meetingDetails: {
          platform: ConsultationPlatform.WEBRTC,
          roomId: 'room_123',
          instructions: 'Check camera',
        },
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(ConsultationStatus.SCHEDULED);
    });
  });

  describe('ConfirmConsultationScheduleUseCase', () => {
    it('should confirm consultation schedule when in SLOT_BOOKED state', async () => {
      const bookedConsultation = Consultation.create(
        {
          acquisitionPipelineId: pipelineId,
          clientId,
          trainerId,
          slot: sampleSlot,
        },
        consultationId,
      ).getValue();
      bookedConsultation.bookSlot(sampleSlot);

      mockConsultationRepo.findById.mockResolvedValueOnce(bookedConsultation);

      const useCase = new ConfirmConsultationScheduleUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        trainerId,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(ConsultationStatus.SCHEDULED);
    });
  });

  describe('CancelConsultationUseCase', () => {
    it('should allow client participant to cancel consultation', async () => {
      const useCase = new CancelConsultationUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        userId: clientId,
        cancelledBy: CancellationActor.CLIENT,
        reason: 'Personal reason',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(ConsultationStatus.CANCELLED);
      expect(result.getValue().cancellation?.reason).toBe('Personal reason');
    });
  });

  describe('CompleteConsultationUseCase', () => {
    it('should allow trainer to mark consultation as completed', async () => {
      const scheduledConsultation = Consultation.create(
        {
          acquisitionPipelineId: pipelineId,
          clientId,
          trainerId,
          slot: sampleSlot,
        },
        consultationId,
      ).getValue();
      scheduledConsultation.schedule(sampleSlot);

      mockConsultationRepo.findById.mockResolvedValueOnce(scheduledConsultation);

      const useCase = new CompleteConsultationUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        trainerId,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(ConsultationStatus.COMPLETED);
    });

    it('should reject completion by non-trainer user', async () => {
      const useCase = new CompleteConsultationUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        trainerId: clientId, // Passing clientId instead of trainerId
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not an authorized participant');
    });
  });

  describe('MarkConsultationNoShowUseCase', () => {
    it('should allow trainer to mark consultation no-show', async () => {
      const scheduledConsultation = Consultation.create(
        {
          acquisitionPipelineId: pipelineId,
          clientId,
          trainerId,
          slot: sampleSlot,
        },
        consultationId,
      ).getValue();
      scheduledConsultation.schedule(sampleSlot);

      mockConsultationRepo.findById.mockResolvedValueOnce(scheduledConsultation);

      const useCase = new MarkConsultationNoShowUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        consultationId,
        trainerId,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(ConsultationStatus.NO_SHOW);
    });
  });

  describe('Query Use Cases', () => {
    it('GetConsultationUseCase should return consultation for authorized user', async () => {
      const useCase = new GetConsultationUseCase(mockConsultationRepo);
      const result = await useCase.execute({ consultationId, userId: clientId });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().consultationId).toBe(consultationId);
    });

    it('GetConsultationByPipelineUseCase should return consultation for pipeline', async () => {
      mockConsultationRepo.findByAcquisitionPipelineId.mockResolvedValueOnce(sampleConsultation);
      const useCase = new GetConsultationByPipelineUseCase(mockConsultationRepo);
      const result = await useCase.execute({ acquisitionPipelineId: pipelineId, userId: clientId });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().acquisitionPipelineId).toBe(pipelineId);
    });

    it('GetUpcomingConsultationsUseCase should return paginated upcoming consultations', async () => {
      const useCase = new GetUpcomingConsultationsUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        userId: clientId,
        isTrainer: false,
        page: 1,
        limit: 10,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().consultations).toHaveLength(1);
    });

    it('GetConsultationHistoryUseCase should return paginated past consultations', async () => {
      const useCase = new GetConsultationHistoryUseCase(mockConsultationRepo);
      const result = await useCase.execute({
        userId: trainerId,
        isTrainer: true,
        page: 1,
        limit: 10,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().consultations).toHaveLength(1);
    });

    it('GetConsultationByRoomIdUseCase should return consultation for valid roomId', async () => {
      const useCase = new GetConsultationByRoomIdUseCase(mockConsultationRepo);
      const result = await useCase.execute({ roomId, userId: clientId });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().roomId).toBe(roomId);
    });
  });
});
