import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerMarketplaceRealtimeEvents } from '../../../../src/modules/marketplace/infrastructure/realtime/marketplace-realtime.subscriber';
import { TrainerRequestCreatedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-created.event';
import { TrainerRequestAcceptedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-accepted.event';
import { TrainerRequestRejectedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-rejected.event';
import { TrainerRequestWithdrawnEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-withdrawn.event';

describe('Marketplace Realtime Event Subscriber', () => {
  it('should publish marketplace:request:created event to target trainer room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = { publishToUser: mockPublishToUser };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerMarketplaceRealtimeEvents(subscriber);

    const event = new TrainerRequestCreatedEvent('pipe_1', 'client_123', 'trainer_456', 'req_999');
    await dispatcher.dispatch(event);

    expect(mockPublishToUser).toHaveBeenCalledTimes(1);
    expect(mockPublishToUser).toHaveBeenCalledWith(
      'trainer_456',
      expect.objectContaining({
        type: 'marketplace:request:created',
        entityId: 'pipe_1',
        payload: {
          pipelineId: 'pipe_1',
          clientId: 'client_123',
          trainerId: 'trainer_456',
          requestId: 'req_999',
        },
      }),
    );
  });

  it('should publish marketplace:request:accepted event to target client room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = { publishToUser: mockPublishToUser };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerMarketplaceRealtimeEvents(subscriber);

    const event = new TrainerRequestAcceptedEvent('pipe_1', 'client_123', 'trainer_456');
    await dispatcher.dispatch(event);

    expect(mockPublishToUser).toHaveBeenCalledWith(
      'client_123',
      expect.objectContaining({
        type: 'marketplace:request:accepted',
        entityId: 'pipe_1',
      }),
    );
  });

  it('should publish marketplace:request:rejected event to target client room with reason', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = { publishToUser: mockPublishToUser };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerMarketplaceRealtimeEvents(subscriber);

    const event = new TrainerRequestRejectedEvent(
      'pipe_1',
      'client_123',
      'trainer_456',
      'Fully booked',
    );
    await dispatcher.dispatch(event);

    expect(mockPublishToUser).toHaveBeenCalledWith(
      'client_123',
      expect.objectContaining({
        type: 'marketplace:request:rejected',
        payload: expect.objectContaining({ reason: 'Fully booked' }),
      }),
    );
  });

  it('should publish marketplace:request:withdrawn event to target trainer room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = { publishToUser: mockPublishToUser };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    registerMarketplaceRealtimeEvents(subscriber);

    const event = new TrainerRequestWithdrawnEvent('pipe_1', 'client_123', 'trainer_456');
    await dispatcher.dispatch(event);

    expect(mockPublishToUser).toHaveBeenCalledWith(
      'trainer_456',
      expect.objectContaining({
        type: 'marketplace:request:withdrawn',
      }),
    );
  });
});
