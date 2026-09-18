import { AwilixContainer } from 'awilix';
import { registerWorkoutDependencies } from './dependencies';
import { registerWorkoutRealtimeEvents } from './infrastructure/realtime/workout-realtime.subscriber';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';

export const registerWorkoutModule = (container: AwilixContainer): void => {
  registerWorkoutDependencies(container);

  // Register realtime socket event mappings
  if (container.hasRegistration('realtimeDomainEventSubscriber')) {
    const realtimeSubscriber = container.resolve<RealtimeDomainEventSubscriber>(
      'realtimeDomainEventSubscriber',
    );
    registerWorkoutRealtimeEvents(realtimeSubscriber);
  }
};
