import { AwilixContainer } from 'awilix';
import { registerOfferDependencies } from './dependencies';
import { registerOfferRealtimeEvents } from './infrastructure/realtime/offer-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';

export const registerOfferModule = (container: AwilixContainer): void => {
  registerOfferDependencies(container);

  // Register realtime mappings if subscriber exists
  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const subscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerOfferRealtimeEvents(subscriber);
  }
};
