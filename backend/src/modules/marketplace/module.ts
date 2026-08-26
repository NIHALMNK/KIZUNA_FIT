import { AwilixContainer } from 'awilix';
import { registerMarketplaceDependencies } from './dependencies';
import { MarketplacePaymentSubscriber } from './infrastructure/subscribers/marketplace-payment.subscriber';
import { MarketplaceOfferSubscriber } from './infrastructure/subscribers/marketplace-offer.subscriber';
import { MarketplaceConsultationSubscriber } from './infrastructure/subscribers/marketplace-consultation.subscriber';
import { registerMarketplaceRealtimeEvents } from './infrastructure/realtime/marketplace-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';

export const registerMarketplaceModule = (container: AwilixContainer): void => {
  registerMarketplaceDependencies(container);

  if (container.hasRegistration('marketplacePaymentSubscriber')) {
    container.resolve<MarketplacePaymentSubscriber>('marketplacePaymentSubscriber').register();
  }
  if (container.hasRegistration('marketplaceOfferSubscriber')) {
    container.resolve<MarketplaceOfferSubscriber>('marketplaceOfferSubscriber').register();
  }
  if (container.hasRegistration('marketplaceConsultationSubscriber')) {
    container
      .resolve<MarketplaceConsultationSubscriber>('marketplaceConsultationSubscriber')
      .register();
  }

  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const subscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerMarketplaceRealtimeEvents(subscriber);
  }
};
