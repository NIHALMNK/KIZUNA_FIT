import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerProfileRealtimeEvents } from '../../../../src/modules/profile/infrastructure/realtime/profile-realtime.subscriber';
import {
  TrainerProfileUpdatedEvent,
  TrainerAvatarUpdatedEvent,
  TrainerAvailabilityChangedEvent,
  TrainerCertificationAddedEvent,
  TrainerShowcaseAddedEvent,
} from '../../../../src/modules/profile/domain/events/TrainerProfileEvents';
import { TrainerAvailabilityStatus } from '../../../../src/modules/profile/domain/enums/TrainerAvailabilityStatus';

describe('Profile Realtime Event Subscriber', () => {
  it('should publish profile:trainer:updated event to scoped trainer profile room on TrainerProfileUpdatedEvent', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToRoom = vi.fn();
    const mockRealtimePublisher: any = { publishToRoom: mockPublishToRoom };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerProfileRealtimeEvents(subscriber);

    const event = new TrainerProfileUpdatedEvent('prof_123');
    await dispatcher.dispatch(event);

    expect(mockPublishToRoom).toHaveBeenCalledTimes(1);
    expect(mockPublishToRoom).toHaveBeenCalledWith(
      'trainer:profile:prof_123',
      expect.objectContaining({
        type: 'profile:trainer:updated',
        entityId: 'prof_123',
        payload: {
          trainerProfileId: 'prof_123',
        },
      }),
    );
  });

  it('should publish profile:trainer:updated event on avatar update', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToRoom = vi.fn();
    const mockRealtimePublisher: any = { publishToRoom: mockPublishToRoom };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerProfileRealtimeEvents(subscriber);

    const event = new TrainerAvatarUpdatedEvent('prof_123', 'http://avatar.png');
    await dispatcher.dispatch(event);

    expect(mockPublishToRoom).toHaveBeenCalledTimes(1);
    expect(mockPublishToRoom).toHaveBeenCalledWith(
      'trainer:profile:prof_123',
      expect.objectContaining({
        type: 'profile:trainer:updated',
        entityId: 'prof_123',
        payload: {
          trainerProfileId: 'prof_123',
          avatarUrl: 'http://avatar.png',
        },
      }),
    );
  });

  it('should publish profile:trainer:availability-changed event to scoped room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToRoom = vi.fn();
    const mockRealtimePublisher: any = { publishToRoom: mockPublishToRoom };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerProfileRealtimeEvents(subscriber);

    const event = new TrainerAvailabilityChangedEvent(
      'prof_123',
      'user_456',
      TrainerAvailabilityStatus.OFFLINE,
    );
    await dispatcher.dispatch(event);

    expect(mockPublishToRoom).toHaveBeenCalledTimes(1);
    expect(mockPublishToRoom).toHaveBeenCalledWith(
      'trainer:profile:prof_123',
      expect.objectContaining({
        type: 'profile:trainer:availability-changed',
        entityId: 'prof_123',
        payload: {
          trainerProfileId: 'prof_123',
          trainerUserId: 'user_456',
          newStatus: TrainerAvailabilityStatus.OFFLINE,
        },
      }),
    );
  });
});
