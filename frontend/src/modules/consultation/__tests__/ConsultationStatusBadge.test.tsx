import { describe, it, expect } from 'vitest';
import { ConsultationStatus } from '../domain/types/consultation.types';

describe('ConsultationStatus Mapping Invariant Tests', () => {
  it('should verify all 6 consultation status enum values exist', () => {
    expect(ConsultationStatus.CREATED).toBe('CREATED');
    expect(ConsultationStatus.SLOT_BOOKED).toBe('SLOT_BOOKED');
    expect(ConsultationStatus.SCHEDULED).toBe('SCHEDULED');
    expect(ConsultationStatus.COMPLETED).toBe('COMPLETED');
    expect(ConsultationStatus.NO_SHOW).toBe('NO_SHOW');
    expect(ConsultationStatus.CANCELLED).toBe('CANCELLED');
  });
});
