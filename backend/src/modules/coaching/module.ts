import { AwilixContainer } from 'awilix';
import { registerCoachingDependencies } from './dependencies';
import { registerCoachingRealtimeEvents } from './infrastructure/realtime/coaching-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { CoachingPaymentSubscriber } from './infrastructure/subscribers/coaching-payment.subscriber';

export const registerCoachingModule = (container: AwilixContainer): void => {
  registerCoachingDependencies(container);

  // Initialize event subscribers
  if (container.hasRegistration('coachingPaymentSubscriber')) {
    const paymentSubscriber = container.resolve<CoachingPaymentSubscriber>(
      'coachingPaymentSubscriber',
    );
    paymentSubscriber.register();
  }

  // Register realtime socket event mappings
  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const realtimeSubscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerCoachingRealtimeEvents(realtimeSubscriber);
  }
};
