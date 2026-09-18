import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerPaymentRealtimeEvents } from '../../../../src/modules/payment/infrastructure/realtime/payment-realtime.subscriber';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { IRealtimePublisher } from '../../../../src/shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../../src/shared/contracts/ILogger';
import { PaymentSucceededEvent } from '../../../../src/modules/payment/domain/events/payment-succeeded.event';
import { PaymentFailedEvent } from '../../../../src/modules/payment/domain/events/payment-failed.event';

describe('Payment Realtime Domain Event Subscriber Tests', () => {
  let dispatcher: DomainEventDispatcher;
  let publisher: IRealtimePublisher;
  let logger: ILogger;
  let subscriber: RealtimeDomainEventSubscriber;

  beforeEach(() => {
    dispatcher = new DomainEventDispatcher();
    publisher = {
      publishToUser: vi.fn(),
      publishToRoom: vi.fn(),
      publishToAll: vi.fn(),
    };
    logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    subscriber = new RealtimeDomainEventSubscriber(dispatcher, publisher, logger);
    registerPaymentRealtimeEvents(subscriber);
  });

  it('should forward PaymentSucceededEvent to both client and trainer user rooms', async () => {
    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      'pipe_789',
      'usr_client_001',
      'usr_trainer_002',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(2);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'usr_client_001',
      expect.objectContaining({
        type: 'payment:succeeded',
        payload: expect.objectContaining({
          paymentId: 'pay_123',
          offerId: 'off_456',
          totalAmount: 10000,
        }),
      }),
    );
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'usr_trainer_002',
      expect.objectContaining({
        type: 'payment:succeeded',
        payload: expect.objectContaining({
          paymentId: 'pay_123',
          offerId: 'off_456',
          totalAmount: 10000,
        }),
      }),
    );
  });

  it('should forward PaymentFailedEvent to the client user room', async () => {
    const event = new PaymentFailedEvent(
      'pay_123',
      'off_456',
      'usr_client_001',
      'usr_trainer_002',
      'Card declined by bank',
    );

    await dispatcher.dispatch(event);

    expect(publisher.publishToUser).toHaveBeenCalledTimes(1);
    expect(publisher.publishToUser).toHaveBeenCalledWith(
      'usr_client_001',
      expect.objectContaining({
        type: 'payment:failed',
        payload: expect.objectContaining({
          paymentId: 'pay_123',
          reason: 'Card declined by bank',
        }),
      }),
    );
  });
});
