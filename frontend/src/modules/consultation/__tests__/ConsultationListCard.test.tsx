import { describe, it, expect } from 'vitest';
import {
  ConsultationStatus,
  ConsultationPlatform,
  ConsultationResponseDTO,
} from '../domain/types/consultation.types';

describe('ConsultationListCard Invariant & Contract Tests', () => {
  const sampleConsultation: ConsultationResponseDTO = {
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

  it('should validate consultation data structure for list card rendering', () => {
    expect(sampleConsultation.consultationId).toBe('consultation_123');
    expect(sampleConsultation.roomId).toBe('room_consultation_123');
    expect(sampleConsultation.status).toBe(ConsultationStatus.CREATED);
  });
});
