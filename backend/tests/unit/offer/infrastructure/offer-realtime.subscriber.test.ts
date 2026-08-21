import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerOfferRealtimeEvents } from '../../../../src/modules/offer/infrastructure/realtime/offer-realtime.subscriber';
import { OfferCreatedEvent } from '../../../../src/modules/offer/domain/events/offer-created.event';
import { OfferSentEvent } from '../../../../src/modules/offer/domain/events/offer-sent.event';
import { OfferAcceptedEvent } from '../../../../src/modules/offer/domain/events/offer-accepted.event';
import { OfferDeclinedEvent } from '../../../../src/modules/offer/domain/events/offer-declined.event';
import { OfferExpiredEvent } from '../../../../src/modules/offer/domain/events/offer-expired.event';
import { IRealtimePublisher } from '../../../../src/shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../../src/shared/contracts/ILogger';

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

describe('Offer RealtimeDomainEventSubscriber Registration', () => {
  it('should register and publish offer:created event to trainer room', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerOfferRealtimeEvents(subscriber);

    const event = new OfferCreatedEvent(
      'offer_1',
      'pipeline_1',
      'consultation_1',
      'client_200',
      'trainer_100',
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'trainer_100',
      expect.objectContaining({
        type: 'offer:created',
        entityId: 'offer_1',
        payload: {
          offerId: 'offer_1',
          acquisitionPipelineId: 'pipeline_1',
          consultationId: 'consultation_1',
          status: 'DRAFT',
        },
      }),
    );
  });

  it('should register and publish offer:sent event to both client and trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerOfferRealtimeEvents(subscriber);

    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    const event = new OfferSentEvent(
      'offer_1',
      'pipeline_1',
      'consultation_1',
      'trainer_100',
      'client_200',
      expiresAt,
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_200',
      expect.objectContaining({
        type: 'offer:sent',
        entityId: 'offer_1',
        payload: {
          offerId: 'offer_1',
          acquisitionPipelineId: 'pipeline_1',
          consultationId: 'consultation_1',
          expiresAt: expiresAt.toISOString(),
          status: 'SENT',
        },
      }),
    );
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'trainer_100',
      expect.objectContaining({
        type: 'offer:sent',
        entityId: 'offer_1',
      }),
    );
  });

  it('should register and publish offer:accepted event to both client and trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerOfferRealtimeEvents(subscriber);

    const acceptedAt = new Date();
    const event = new OfferAcceptedEvent(
      'offer_1',
      'pipeline_1',
      'consultation_1',
      'trainer_100',
      'client_200',
      acceptedAt,
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_200',
      expect.objectContaining({
        type: 'offer:accepted',
        entityId: 'offer_1',
        payload: {
          offerId: 'offer_1',
          acquisitionPipelineId: 'pipeline_1',
          consultationId: 'consultation_1',
          acceptedAt: acceptedAt.toISOString(),
          status: 'ACCEPTED',
        },
      }),
    );
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'trainer_100',
      expect.objectContaining({
        type: 'offer:accepted',
        entityId: 'offer_1',
      }),
    );
  });

  it('should register and publish offer:declined event to both client and trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerOfferRealtimeEvents(subscriber);

    const declinedAt = new Date();
    const event = new OfferDeclinedEvent(
      'offer_1',
      'pipeline_1',
      'consultation_1',
      'trainer_100',
      'client_200',
      declinedAt,
      'Price too high',
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_200',
      expect.objectContaining({
        type: 'offer:declined',
        entityId: 'offer_1',
        payload: {
          offerId: 'offer_1',
          acquisitionPipelineId: 'pipeline_1',
          consultationId: 'consultation_1',
          declinedAt: declinedAt.toISOString(),
          reason: 'Price too high',
          status: 'DECLINED',
        },
      }),
    );
  });

  it('should register and publish offer:expired event to both client and trainer', async () => {
    const dispatcher = new DomainEventDispatcher();
    const publisher = createMockRealtimePublisher();
    const logger = createMockLogger();
    const subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);

    registerOfferRealtimeEvents(subscriber);

    const expiredAt = new Date();
    const event = new OfferExpiredEvent(
      'offer_1',
      'pipeline_1',
      'consultation_1',
      'trainer_100',
      'client_200',
      expiredAt,
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'client_200',
      expect.objectContaining({
        type: 'offer:expired',
        entityId: 'offer_1',
      }),
    );
  });
});
