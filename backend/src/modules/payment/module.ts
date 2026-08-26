import { AwilixContainer } from 'awilix';
import { registerPaymentDependencies } from './dependencies';
import { registerPaymentRealtimeEvents } from './infrastructure/realtime/payment-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';

export const registerPaymentModule = (container: AwilixContainer): void => {
  registerPaymentDependencies(container);

  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const subscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerPaymentRealtimeEvents(subscriber);
  }
};
