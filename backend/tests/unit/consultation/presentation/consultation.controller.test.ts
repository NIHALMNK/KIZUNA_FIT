import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { ConsultationController } from '../../../../src/modules/consultation/presentation/controllers/consultation.controller';
import { Result } from '../../../../src/shared/result/Result';
import { ConsultationStatus } from '../../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../src/modules/consultation/domain/enums/consultation-platform.enum';
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

interface MockUseCase {
  execute: ReturnType<typeof vi.fn>;
}

describe('ConsultationController Presentation Tests', () => {
  let controller: ConsultationController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  let mockCreateConsultationUseCase: MockUseCase;
  let mockBookConsultationSlotUseCase: MockUseCase;
  let mockScheduleConsultationUseCase: MockUseCase;
  let mockConfirmConsultationScheduleUseCase: MockUseCase;
  let mockCancelConsultationUseCase: MockUseCase;
  let mockCompleteConsultationUseCase: MockUseCase;
  let mockMarkConsultationNoShowUseCase: MockUseCase;
  let mockGetConsultationUseCase: MockUseCase;
  let mockGetConsultationByPipelineUseCase: MockUseCase;
  let mockGetUpcomingConsultationsUseCase: MockUseCase;
  let mockGetConsultationHistoryUseCase: MockUseCase;
  let mockGetConsultationByRoomIdUseCase: MockUseCase;

  const sampleDTO = {
    consultationId: 'consultation_1786359655394_abc',
    acquisitionPipelineId: 'pipe_1786359655394_11qed',
    clientId: 'client_123',
    trainerId: 'trainer_456',
    slot: {
      scheduledStartAt: new Date(),
      scheduledEndAt: new Date(),
      timezone: 'UTC',
      bookedAt: new Date(),
    },
    platform: ConsultationPlatform.WEBRTC,
    roomId: 'room_abc123',
    meetingUrl: 'https://meet.kizunafit.com/room_abc123',
    meetingDetails: null,
    status: ConsultationStatus.CREATED,
    completedAt: null,
    cancellation: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockReq = {
      auth: { userId: 'client_123', role: 'CLIENT' },
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockCreateConsultationUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockBookConsultationSlotUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockScheduleConsultationUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockConfirmConsultationScheduleUseCase = {
      execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)),
    };
    mockCancelConsultationUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockCompleteConsultationUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockMarkConsultationNoShowUseCase = {
      execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)),
    };
    mockGetConsultationUseCase = { execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)) };
    mockGetConsultationByPipelineUseCase = {
      execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)),
    };
    mockGetUpcomingConsultationsUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue(Result.ok({ consultations: [sampleDTO], total: 1, page: 1, limit: 10 })),
    };
    mockGetConsultationHistoryUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue(Result.ok({ consultations: [sampleDTO], total: 1, page: 1, limit: 10 })),
    };
    mockGetConsultationByRoomIdUseCase = {
      execute: vi.fn().mockResolvedValue(Result.ok(sampleDTO)),
    };

    controller = new ConsultationController(
      mockCreateConsultationUseCase as unknown as CreateConsultationUseCase,
      mockBookConsultationSlotUseCase as unknown as BookConsultationSlotUseCase,
      mockScheduleConsultationUseCase as unknown as ScheduleConsultationUseCase,
      mockConfirmConsultationScheduleUseCase as unknown as ConfirmConsultationScheduleUseCase,
      mockCancelConsultationUseCase as unknown as CancelConsultationUseCase,
      mockCompleteConsultationUseCase as unknown as CompleteConsultationUseCase,
      mockMarkConsultationNoShowUseCase as unknown as MarkConsultationNoShowUseCase,
      mockGetConsultationUseCase as unknown as GetConsultationUseCase,
      mockGetConsultationByPipelineUseCase as unknown as GetConsultationByPipelineUseCase,
      mockGetUpcomingConsultationsUseCase as unknown as GetUpcomingConsultationsUseCase,
      mockGetConsultationHistoryUseCase as unknown as GetConsultationHistoryUseCase,
      mockGetConsultationByRoomIdUseCase as unknown as GetConsultationByRoomIdUseCase,
    );
  });

  describe('create', () => {
    it('should return 201 Created on successful consultation creation', async () => {
      mockReq.body = {
        acquisitionPipelineId: 'pipe_1786359655394_11qed',
        scheduledStartAt: '2026-09-01T10:00:00Z',
        scheduledEndAt: '2026-09-01T10:45:00Z',
        timezone: 'UTC',
      };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: sampleDTO,
        }),
      );
    });

    it('should return 401 Unauthorized if request has no auth token', async () => {
      mockReq.auth = undefined;
      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('should return 409 Conflict if consultation already exists for pipeline', async () => {
      mockCreateConsultationUseCase.execute.mockResolvedValueOnce(
        Result.fail('A consultation already exists for acquisition pipeline'),
      );
      mockReq.body = { acquisitionPipelineId: 'pipe_123' };

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
  });

  describe('getById', () => {
    it('should return 200 OK with consultation details for authorized participant', async () => {
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: sampleDTO,
        }),
      );
    });

    it('should return 403 Forbidden if user is unauthorized', async () => {
      mockGetConsultationUseCase.execute.mockResolvedValueOnce(
        Result.fail("User 'user_999' is not an authorized participant"),
      );
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getByPipelineId', () => {
    it('should return 200 OK for valid pipeline lookup', async () => {
      mockReq.params = { pipelineId: 'pipe_123' };

      await controller.getByPipelineId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 Forbidden for unauthorized pipeline access', async () => {
      mockGetConsultationByPipelineUseCase.execute.mockResolvedValueOnce(
        Result.fail("User 'user_999' is not an authorized participant"),
      );
      mockReq.params = { pipelineId: 'pipe_123' };

      await controller.getByPipelineId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getByRoomId', () => {
    it('should return 200 OK for authorized room lookup', async () => {
      mockReq.params = { roomId: 'room_abc123' };

      await controller.getByRoomId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 Forbidden for unauthorized room access attempt', async () => {
      mockGetConsultationByRoomIdUseCase.execute.mockResolvedValueOnce(
        Result.fail("User 'user_999' is not an authorized participant"),
      );
      mockReq.params = { roomId: 'room_abc123' };

      await controller.getByRoomId(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('bookSlot', () => {
    it('should return 200 OK on successful slot booking', async () => {
      mockReq.params = { consultationId: 'consultation_123' };
      mockReq.body = {
        scheduledStartAt: '2026-09-01T10:00:00Z',
        scheduledEndAt: '2026-09-01T10:45:00Z',
        timezone: 'UTC',
      };

      await controller.bookSlot(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 Forbidden if non-client attempts to book', async () => {
      mockBookConsultationSlotUseCase.execute.mockResolvedValueOnce(
        Result.fail("User 'trainer_456' is not an authorized participant"),
      );
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.bookSlot(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('schedule', () => {
    it('should return 200 OK on valid schedule payload', async () => {
      mockReq.params = { consultationId: 'consultation_123' };
      mockReq.body = {
        scheduledStartAt: '2026-09-01T10:00:00Z',
        scheduledEndAt: '2026-09-01T10:45:00Z',
        timezone: 'UTC',
      };

      await controller.schedule(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('confirmSchedule', () => {
    it('should return 200 OK on schedule confirmation', async () => {
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.confirmSchedule(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('cancel', () => {
    it('should return 200 OK on valid cancellation', async () => {
      mockReq.params = { consultationId: 'consultation_123' };
      mockReq.body = { reason: 'Client requested reschedule' };

      await controller.cancel(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('complete', () => {
    it('should return 200 OK when trainer completes consultation', async () => {
      mockReq.auth = { userId: 'trainer_456', role: 'TRAINER' };
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.complete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 Forbidden when unauthorized user completes', async () => {
      mockCompleteConsultationUseCase.execute.mockResolvedValueOnce(
        Result.fail("User 'client_123' is not an authorized participant"),
      );
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.complete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('markNoShow', () => {
    it('should return 200 OK when trainer marks no-show', async () => {
      mockReq.auth = { userId: 'trainer_456', role: 'TRAINER' };
      mockReq.params = { consultationId: 'consultation_123' };

      await controller.markNoShow(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe('listUpcoming and listHistory', () => {
    it('should return paginated upcoming consultations', async () => {
      mockReq.query = { page: '1', limit: '10' };

      await controller.listUpcoming(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should return paginated consultation history', async () => {
      mockReq.query = { page: '1', limit: '10' };

      await controller.listHistory(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });
});
