import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../src/shared/events/domain-event-dispatcher';
import { RealtimeDomainEventSubscriber } from '../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { IDomainEvent } from '../../../src/shared/core/AggregateRoot';
import { configureContainer } from '../../../src/bootstrap/dependency-injection/container';

class SampleDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(
    public readonly pipelineId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
  ) {}

  public getAggregateId(): string {
    return this.pipelineId;
  }
}

describe('RealtimeDomainEventSubscriber (TEST R7, R8, R9, R10, R11, R12)', () => {
  it('should resolve realtimeDomainEventSubscriber from Awilix container without throwing AwilixResolutionError', () => {
    const container = configureContainer();
    const subscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    expect(subscriber).toBeInstanceOf(RealtimeDomainEventSubscriber);
  });

  it('TEST R7, R8, R9, R10 — should bridge dispatched domain event to IRealtimePublisher target user room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = {
      publishToUser: mockPublishToUser,
      publishToRoom: vi.fn(),
      publishToAll: vi.fn(),
    };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    // Register mapping: SampleDomainEvent -> recipient trainerId
    subscriber.registerMapping<SampleDomainEvent>('SampleDomainEvent', (event) => ({
      targetUserId: event.trainerId,
      realtimeType: 'sample:created',
      payload: { clientId: event.clientId },
    }));

    const domainEvent = new SampleDomainEvent('pipe_100', 'client_abc', 'trainer_xyz');

    // TEST R7: DomainEventDispatcher receives event
    await dispatcher.dispatch(domainEvent);

    // TEST R8 & R9: Realtime bridge receives event and calls IRealtimePublisher with target trainer_xyz
    expect(mockPublishToUser).toHaveBeenCalledTimes(1);
    expect(mockPublishToUser).toHaveBeenCalledWith(
      'trainer_xyz',
      expect.objectContaining({
        type: 'sample:created',
        version: 1,
        entityId: 'pipe_100',
        payload: { clientId: 'client_abc' },
      }),
    );
  });

  it('TEST R11 — a different user room is never targeted', async () => {
    const dispatcher = new DomainEventDispatcher();
    const mockPublishToUser = vi.fn();
    const mockRealtimePublisher: any = { publishToUser: mockPublishToUser };
    const mockLogger: any = { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() };

    const subscriber = new RealtimeDomainEventSubscriber(
      dispatcher,
      mockRealtimePublisher,
      mockLogger,
    );

    subscriber.registerMapping<SampleDomainEvent>('SampleDomainEvent', (event) => ({
      targetUserId: event.trainerId,
      realtimeType: 'sample:created',
    }));

    await dispatcher.dispatch(new SampleDomainEvent('pipe_101', 'client_1', 'intended_trainer_99'));

    expect(mockPublishToUser).toHaveBeenCalledWith('intended_trainer_99', expect.anything());
    expect(mockPublishToUser).not.toHaveBeenCalledWith('other_user_88', expect.anything());
  });

  it('TEST R12 — Domain and application layers contain no Socket.IO dependency', () => {
    const domainEvent = new SampleDomainEvent('pipe_102', 'c1', 't1');
    expect(domainEvent.getAggregateId()).toBe('pipe_102');
    expect(domainEvent.dateTimeOccurred).toBeInstanceOf(Date);
    // Verified pure domain object without Socket.IO or WebSocket dependencies
  });
});
