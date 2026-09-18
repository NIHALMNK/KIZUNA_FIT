import { describe, it, expect } from 'vitest';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';

describe('ConsultationSlot Value Object', () => {
  it('should successfully create a valid ConsultationSlot', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 45 * 60 * 1000); // 45 min duration

    const result = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: 'UTC',
    });

    expect(result.isSuccess).toBe(true);
    const slot = result.getValue();
    expect(slot.timezone).toBe('UTC');
    expect(slot.getDurationInMinutes()).toBe(45);
    expect(slot.scheduledStartAt.getTime()).toBe(start.getTime());
    expect(slot.scheduledEndAt.getTime()).toBe(end.getTime());
  });

  it('should fail if scheduledEndAt is before or equal to scheduledStartAt', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() - 1000);

    const result = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: 'UTC',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('scheduledEndAt must be strictly after scheduledStartAt');
  });

  it('should fail if duration is less than 15 minutes', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 10 * 60 * 1000); // 10 minutes

    const result = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: 'UTC',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('at least 15 minutes');
  });

  it('should fail if duration exceeds 120 minutes', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 130 * 60 * 1000); // 130 minutes

    const result = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: 'UTC',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('must not exceed 120 minutes');
  });

  it('should fail if timezone is empty or invalid', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const result = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: '   ',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('valid timezone string');
  });

  it('should guarantee immutability on returned Date instances', () => {
    const start = new Date(Date.now() + 3600000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const slot = ConsultationSlot.create({
      scheduledStartAt: start,
      scheduledEndAt: end,
      timezone: 'Asia/Kolkata',
    }).getValue();

    const retrievedStart = slot.scheduledStartAt;
    retrievedStart.setFullYear(2000);

    expect(slot.scheduledStartAt.getFullYear()).not.toBe(2000);
  });
});
