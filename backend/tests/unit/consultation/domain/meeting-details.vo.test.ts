import { describe, it, expect } from 'vitest';
import { MeetingDetails } from '../../../../src/modules/consultation/domain/value-objects/meeting-details.vo';
import { ConsultationPlatform } from '../../../../src/modules/consultation/domain/enums/consultation-platform.enum';

describe('MeetingDetails Value Object', () => {
  it('should successfully create a valid MeetingDetails instance', () => {
    const result = MeetingDetails.create({
      platform: ConsultationPlatform.WEBRTC,
      roomId: 'room_12345',
      meetingUrl: 'https://meet.kizunafit.com/room_12345',
      instructions: 'Please test camera and mic prior to joining.',
    });

    expect(result.isSuccess).toBe(true);
    const details = result.getValue();
    expect(details.platform).toBe(ConsultationPlatform.WEBRTC);
    expect(details.roomId).toBe('room_12345');
    expect(details.meetingUrl).toBe('https://meet.kizunafit.com/room_12345');
    expect(details.instructions).toBe('Please test camera and mic prior to joining.');
  });

  it('should fail if platform is invalid', () => {
    const result = MeetingDetails.create({
      platform: 'INVALID_PLATFORM' as ConsultationPlatform,
      roomId: 'room_123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('valid ConsultationPlatform');
  });

  it('should fail if roomId is missing or empty', () => {
    const result = MeetingDetails.create({
      platform: ConsultationPlatform.ZOOM,
      roomId: '  ',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('valid roomId');
  });
});
