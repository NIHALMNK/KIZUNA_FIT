import { describe, it, expect } from 'vitest';
import { CONSULTATION_QUERY_KEYS } from '../application/hooks/useConsultationQueries';
import { ConsultationStatus } from '../domain/types/consultation.types';

describe('CONSULTATION_QUERY_KEYS Strategy', () => {
  it('should generate static base key for all', () => {
    expect(CONSULTATION_QUERY_KEYS.all).toEqual(['consultations']);
  });

  it('should generate structured key for upcoming consultations', () => {
    const params = { page: 1, limit: 10, status: ConsultationStatus.SCHEDULED };
    const key = CONSULTATION_QUERY_KEYS.upcoming(params);
    expect(key).toEqual(['consultations', 'upcoming', params]);
  });

  it('should generate structured key for consultation history', () => {
    const params = { page: 2, limit: 5 };
    const key = CONSULTATION_QUERY_KEYS.history(params);
    expect(key).toEqual(['consultations', 'history', params]);
  });

  it('should generate detail key with consultationId', () => {
    const key = CONSULTATION_QUERY_KEYS.detail('consultation_abc');
    expect(key).toEqual(['consultations', 'detail', 'consultation_abc']);
  });

  it('should generate pipeline key with pipelineId', () => {
    const key = CONSULTATION_QUERY_KEYS.pipeline('pipe_xyz');
    expect(key).toEqual(['consultations', 'pipeline', 'pipe_xyz']);
  });

  it('should generate room key with roomId', () => {
    const key = CONSULTATION_QUERY_KEYS.room('room_123');
    expect(key).toEqual(['consultations', 'room', 'room_123']);
  });
});
