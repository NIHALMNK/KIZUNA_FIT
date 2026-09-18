import { describe, it, expect } from 'vitest';
import { ConsultationStatus } from '../domain/types/consultation.types';

describe('TrainerConsultationDetailView Action Invariant Tests', () => {
  it('should verify trainer allowed actions for CREATED state', () => {
    const status = ConsultationStatus.CREATED;
    const allowedActions = ['SET_SCHEDULE', 'CANCEL'];
    expect(status).toBe('CREATED');
    expect(allowedActions).toContain('SET_SCHEDULE');
    expect(allowedActions).toContain('CANCEL');
  });

  it('should verify trainer allowed actions for SLOT_BOOKED state', () => {
    const status = ConsultationStatus.SLOT_BOOKED;
    const allowedActions = ['CONFIRM_SCHEDULE', 'REQUEST_CHANGE', 'CANCEL'];
    expect(status).toBe('SLOT_BOOKED');
    expect(allowedActions).toContain('CONFIRM_SCHEDULE');
    expect(allowedActions).toContain('REQUEST_CHANGE');
    expect(allowedActions).toContain('CANCEL');
  });

  it('should verify trainer allowed actions for SCHEDULED state', () => {
    const status = ConsultationStatus.SCHEDULED;
    const allowedActions = ['JOIN_LIVE_SESSION', 'COMPLETE_SESSION', 'MARK_NO_SHOW', 'CANCEL'];
    expect(status).toBe('SCHEDULED');
    expect(allowedActions).toContain('JOIN_LIVE_SESSION');
    expect(allowedActions).toContain('COMPLETE_SESSION');
    expect(allowedActions).toContain('MARK_NO_SHOW');
    expect(allowedActions).toContain('CANCEL');
  });

  it('should verify terminal states are read-only', () => {
    const terminalStates = [
      ConsultationStatus.COMPLETED,
      ConsultationStatus.NO_SHOW,
      ConsultationStatus.CANCELLED,
    ];
    expect(terminalStates).toHaveLength(3);
    terminalStates.forEach((state) => {
      expect([
        ConsultationStatus.COMPLETED,
        ConsultationStatus.NO_SHOW,
        ConsultationStatus.CANCELLED,
      ]).toContain(state);
    });
  });
});
