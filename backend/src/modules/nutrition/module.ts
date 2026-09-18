import { AwilixContainer } from 'awilix';
import { registerNutritionDependencies } from './dependencies';
import { registerNutritionRealtimeEvents } from './infrastructure/realtime/nutrition-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';

export const registerNutritionModule = (container: AwilixContainer): void => {
  registerNutritionDependencies(container);

  // Register realtime socket event mappings
  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const realtimeSubscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerNutritionRealtimeEvents(realtimeSubscriber);
  }
};
