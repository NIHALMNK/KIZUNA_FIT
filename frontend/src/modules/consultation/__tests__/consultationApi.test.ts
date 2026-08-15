import { describe, it, expect, vi, beforeEach } from 'vitest';
import { consultationApi } from '../infrastructure/api/consultationApi';
import { httpClient } from '../../../infrastructure/api/HttpClient';
import {
  ConsultationStatus,
  ConsultationPlatform,
  ConsultationResponseDTO,
} from '../domain/types/consultation.types';

vi.mock('../../../infrastructure/api/HttpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('consultationApi Infrastructure Tests', () => {
  const sampleResponse: ConsultationResponseDTO = {
    consultationId: 'consultation_123',
    acquisitionPipelineId: 'pipe_123',
    clientId: 'client_123',
    trainerId: 'trainer_456',
    slot: {
      scheduledStartAt: '2026-09-01T10:00:00.000Z',
      scheduledEndAt: '2026-09-01T10:45:00.000Z',
      timezone: 'UTC',
      bookedAt: '2026-08-13T10:00:00.000Z',
    },
    platform: ConsultationPlatform.WEBRTC,
    roomId: 'room_consultation_123',
    meetingUrl: null,
    meetingDetails: null,
    status: ConsultationStatus.CREATED,
    completedAt: null,
    cancellation: null,
    createdAt: '2026-08-13T10:00:00.000Z',
    updatedAt: '2026-08-13T10:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createConsultation — should send POST to /consultations with payload', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const payload = {
      acquisitionPipelineId: 'pipe_123',
      scheduledStartAt: '2026-09-01T10:00:00.000Z',
      scheduledEndAt: '2026-09-01T10:45:00.000Z',
      timezone: 'UTC',
      platform: ConsultationPlatform.WEBRTC,
    };

    const res = await consultationApi.createConsultation(payload);
    expect(httpClient.post).toHaveBeenCalledWith('/consultations', payload);
    expect(res).toEqual(sampleResponse);
  });

  it('getUpcomingConsultations — should send GET to /consultations/upcoming with params', async () => {
    const paginatedRes = { consultations: [sampleResponse], total: 1, page: 1, limit: 10 };
    vi.mocked(httpClient.get).mockResolvedValue(paginatedRes);

    const params = { page: 1, limit: 10, sort: 'newest' as const };
    const res = await consultationApi.getUpcomingConsultations(params);
    expect(httpClient.get).toHaveBeenCalledWith('/consultations/upcoming', { params });
    expect(res).toEqual(paginatedRes);
  });

  it('getConsultationHistory — should send GET to /consultations/history', async () => {
    const paginatedRes = { consultations: [], total: 0, page: 1, limit: 10 };
    vi.mocked(httpClient.get).mockResolvedValue(paginatedRes);

    const res = await consultationApi.getConsultationHistory();
    expect(httpClient.get).toHaveBeenCalledWith('/consultations/history', { params: undefined });
    expect(res).toEqual(paginatedRes);
  });

  it('getConsultation — should send GET to /consultations/:consultationId', async () => {
    vi.mocked(httpClient.get).mockResolvedValue(sampleResponse);

    const res = await consultationApi.getConsultation('consultation_123');
    expect(httpClient.get).toHaveBeenCalledWith('/consultations/consultation_123');
    expect(res).toEqual(sampleResponse);
  });

  it('getConsultationByPipeline — should send GET to /consultations/pipeline/:pipelineId', async () => {
    vi.mocked(httpClient.get).mockResolvedValue(sampleResponse);

    const res = await consultationApi.getConsultationByPipeline('pipe_123');
    expect(httpClient.get).toHaveBeenCalledWith('/consultations/pipeline/pipe_123');
    expect(res).toEqual(sampleResponse);
  });

  it('getConsultationByRoom — should send GET to /consultations/room/:roomId', async () => {
    vi.mocked(httpClient.get).mockResolvedValue(sampleResponse);

    const res = await consultationApi.getConsultationByRoom('room_consultation_123');
    expect(httpClient.get).toHaveBeenCalledWith('/consultations/room/room_consultation_123');
    expect(res).toEqual(sampleResponse);
  });

  it('bookConsultationSlot — should send POST to /consultations/:id/book', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const payload = {
      scheduledStartAt: '2026-09-01T14:00:00.000Z',
      scheduledEndAt: '2026-09-01T14:45:00.000Z',
      timezone: 'UTC',
    };
    const res = await consultationApi.bookConsultationSlot('consultation_123', payload);
    expect(httpClient.post).toHaveBeenCalledWith('/consultations/consultation_123/book', payload);
    expect(res).toEqual(sampleResponse);
  });

  it('scheduleConsultation — should send POST to /consultations/:id/schedule', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const payload = {
      scheduledStartAt: '2026-09-01T14:00:00.000Z',
      scheduledEndAt: '2026-09-01T14:45:00.000Z',
      timezone: 'UTC',
    };
    const res = await consultationApi.scheduleConsultation('consultation_123', payload);
    expect(httpClient.post).toHaveBeenCalledWith(
      '/consultations/consultation_123/schedule',
      payload,
    );
    expect(res).toEqual(sampleResponse);
  });

  it('confirmSchedule — should send POST to /consultations/:id/confirm', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const res = await consultationApi.confirmSchedule('consultation_123');
    expect(httpClient.post).toHaveBeenCalledWith('/consultations/consultation_123/confirm');
    expect(res).toEqual(sampleResponse);
  });

  it('cancelConsultation — should send POST to /consultations/:id/cancel', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const payload = { reason: 'Client schedule conflict' };
    const res = await consultationApi.cancelConsultation('consultation_123', payload);
    expect(httpClient.post).toHaveBeenCalledWith('/consultations/consultation_123/cancel', payload);
    expect(res).toEqual(sampleResponse);
  });

  it('completeConsultation — should send POST to /consultations/:id/complete', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const res = await consultationApi.completeConsultation('consultation_123');
    expect(httpClient.post).toHaveBeenCalledWith('/consultations/consultation_123/complete');
    expect(res).toEqual(sampleResponse);
  });

  it('markNoShow — should send POST to /consultations/:id/no-show', async () => {
    vi.mocked(httpClient.post).mockResolvedValue(sampleResponse);

    const res = await consultationApi.markNoShow('consultation_123');
    expect(httpClient.post).toHaveBeenCalledWith('/consultations/consultation_123/no-show');
    expect(res).toEqual(sampleResponse);
  });
});
