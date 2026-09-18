import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../src/shared/events/domain-event-dispatcher';
import { RealtimeDomainEventSubscriber } from '../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerConsultationRealtimeEvents } from '../../../src/modules/consultation/infrastructure/realtime/consultation-realtime.subscriber';
import { ConsultationCreatedEvent } from '../../../src/modules/consultation/domain/events/consultation-created.event';
import { ConsultationScheduledEvent } from '../../../src/modules/consultation/domain/events/consultation-scheduled.event';
import { ConsultationSlotBookedEvent } from '../../../src/modules/consultation/domain/events/consultation-slot-booked.event';
import { ConsultationCancelledEvent } from '../../../src/modules/consultation/domain/events/consultation-cancelled.event';
import { ConsultationCompletedEvent } from '../../../src/modules/consultation/domain/events/consultation-completed.event';
import { ConsultationNoShowEvent } from '../../../src/modules/consultation/domain/events/consultation-no-show.event';
import { CancellationActor } from '../../../src/modules/consultation/domain/enums/cancellation-actor.enum';
import { IRealtimePublisher } from '../../../src/shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../src/shared/contracts/ILogger';

function createMockRealtimePublisher(): IRealtimePublisher {
  return {
    publishToUser: vi.fn(),
    publishToRoom: vi.fn(),
    publishToAll: vi.fn(),
  };
}

function createMockLogger(): ILogger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
}

describe('Consultation Realtime Event Subscriber', () => {
  it('should publish consultation:created to both Client and Trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const event = new ConsultationCreatedEvent('consultation_1', 'pipe_1', 'client_1', 'trainer_1');
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:created',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          acquisitionPipelineId: 'pipe_1',
          status: 'CREATED',
        },
      }),
    );
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'trainer_1',
      expect.objectContaining({
        type: 'consultation:created',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          acquisitionPipelineId: 'pipe_1',
          status: 'CREATED',
        },
      }),
    );
  });

  it('should publish consultation:scheduled when ConsultationSlotBookedEvent is dispatched', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const start = new Date('2026-09-01T10:00:00Z');
    const end = new Date('2026-09-01T10:45:00Z');
    const event = new ConsultationSlotBookedEvent(
      'consultation_1',
      'client_1',
      'trainer_1',
      start,
      end,
    );
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:scheduled',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          scheduledStartAt: start.toISOString(),
          scheduledEndAt: end.toISOString(),
          status: 'SLOT_BOOKED',
        },
      }),
    );
  });

  it('should publish consultation:scheduled when ConsultationScheduledEvent is dispatched', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const start = new Date('2026-09-01T10:00:00Z');
    const end = new Date('2026-09-01T10:45:00Z');
    const event = new ConsultationScheduledEvent(
      'consultation_1',
      'pipe_1',
      'client_1',
      'trainer_1',
      start,
      end,
      'room_consultation_1',
    );
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:scheduled',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          scheduledStartAt: start.toISOString(),
          scheduledEndAt: end.toISOString(),
          status: 'SCHEDULED',
        },
      }),
    );
  });

  it('should publish consultation:cancelled to both Client and Trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const event = new ConsultationCancelledEvent(
      'consultation_1',
      'client_1',
      'trainer_1',
      CancellationActor.CLIENT,
      'Schedule conflict',
    );
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:cancelled',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          cancelledBy: CancellationActor.CLIENT,
          status: 'CANCELLED',
        },
      }),
    );
  });

  it('should publish consultation:completed to both Client and Trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const completedAt = new Date('2026-09-01T11:00:00Z');
    const event = new ConsultationCompletedEvent(
      'consultation_1',
      'pipe_1',
      'client_1',
      'trainer_1',
      completedAt,
    );
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:completed',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          completedAt: completedAt.toISOString(),
          status: 'COMPLETED',
        },
      }),
    );
  });

  it('should publish consultation:no-show to both Client and Trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const event = new ConsultationNoShowEvent('consultation_1', 'client_1', 'trainer_1');
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_1',
      expect.objectContaining({
        type: 'consultation:no-show',
        entityId: 'consultation_1',
        payload: {
          consultationId: 'consultation_1',
          status: 'NO_SHOW',
        },
      }),
    );
  });

  it('should deduplicate recipient users if client and trainer IDs are identical', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerConsultationRealtimeEvents(subscriber);

    const event = new ConsultationNoShowEvent('consultation_1', 'user_same', 'user_same');
    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(1);
    expect(publisher.publishToUser).toHaveBeenCalledWith('user_same', expect.anything());
  });
});
