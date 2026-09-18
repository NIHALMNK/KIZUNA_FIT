import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerCoachingRealtimeEvents } from '../../../../src/modules/coaching/infrastructure/realtime/coaching-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import {
  CoachingRelationshipCreatedEvent,
  CoachingRelationshipCompletedEvent,
  CoachingRelationshipCancelledEvent,
} from '../../../../src/modules/coaching/domain/events';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';

describe('CoachingRealtimeSubscriber Unit Tests', () => {
  let mockSubscriber: RealtimeDomainEventSubscriber;
  const registeredMappings: Record<string, (event: any) => any> = {};

  beforeEach(() => {
    registeredMappings['CoachingRelationshipCreatedEvent'] = undefined as any;
    registeredMappings['CoachingRelationshipCompletedEvent'] = undefined as any;
    registeredMappings['CoachingRelationshipCancelledEvent'] = undefined as any;

    mockSubscriber = {
      registerMapping: vi.fn().mockImplementation((eventName, mappingFn) => {
        registeredMappings[eventName] = mappingFn;
      }),
    } as unknown as RealtimeDomainEventSubscriber;

    registerCoachingRealtimeEvents(mockSubscriber);
  });

  it('should register all 6 domain event mappings', () => {
    expect(mockSubscriber.registerMapping).toHaveBeenCalledTimes(6);
  });

  it('should format CoachingRelationshipCreatedEvent correctly for realtime broadcast', () => {
    const event = new CoachingRelationshipCreatedEvent(
      'rel_100',
      'pipe_100',
      'pay_100',
      'sub_100',
      'usr_client_01',
      'usr_trainer_01',
      CoachingRelationshipStatus.ACTIVE,
      new Date('2026-08-01T10:00:00.000Z'),
    );

    const mapping = registeredMappings['CoachingRelationshipCreatedEvent'](event);

    expect(mapping.targetUserIds).toEqual(['usr_client_01', 'usr_trainer_01']);
    expect(mapping.realtimeType).toBe('coaching:relationship_created');
    expect(mapping.payload.relationshipId).toBe('rel_100');
    expect(mapping.payload.status).toBe(CoachingRelationshipStatus.ACTIVE);
  });

  it('should format CoachingRelationshipCompletedEvent correctly for realtime broadcast', () => {
    const event = new CoachingRelationshipCompletedEvent(
      'rel_100',
      'pay_100',
      'sub_100',
      'usr_client_01',
      'usr_trainer_01',
      new Date('2026-10-01T10:00:00.000Z'),
    );

    const mapping = registeredMappings['CoachingRelationshipCompletedEvent'](event);

    expect(mapping.targetUserIds).toEqual(['usr_client_01', 'usr_trainer_01']);
    expect(mapping.realtimeType).toBe('coaching:relationship_completed');
    expect(mapping.payload.relationshipId).toBe('rel_100');
    expect(mapping.payload.completedAt).toBe('2026-10-01T10:00:00.000Z');
  });

  it('should format CoachingRelationshipCancelledEvent correctly for realtime broadcast', () => {
    const event = new CoachingRelationshipCancelledEvent(
      'rel_100',
      'pay_100',
      'usr_client_01',
      'usr_trainer_01',
      'usr_trainer_01',
      'Client moved away',
      new Date('2026-09-01T10:00:00.000Z'),
    );

    const mapping = registeredMappings['CoachingRelationshipCancelledEvent'](event);

    expect(mapping.targetUserIds).toEqual(['usr_client_01', 'usr_trainer_01']);
    expect(mapping.realtimeType).toBe('coaching:relationship_cancelled');
    expect(mapping.payload.reason).toBe('Client moved away');
  });
});
