import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { TrainerRequestCreatedEvent } from '../../domain/events/trainer-request-created.event';
import { TrainerRequestAcceptedEvent } from '../../domain/events/trainer-request-accepted.event';
import { TrainerRequestRejectedEvent } from '../../domain/events/trainer-request-rejected.event';
import { TrainerRequestWithdrawnEvent } from '../../domain/events/trainer-request-withdrawn.event';
import { AcquisitionPipelineClosedEvent } from '../../domain/events/acquisition-pipeline-closed.event';

/**
 * Registers Marketplace domain event mappings on RealtimeDomainEventSubscriber.
 * Translates domain events to canonical realtime envelopes targetted at verified recipient user rooms.
 */
export const registerMarketplaceRealtimeEvents = (
  subscriber: RealtimeDomainEventSubscriber,
): void => {
  // 1. Client creates request -> notify assigned Trainer User ID
  subscriber.registerMapping<TrainerRequestCreatedEvent>('TrainerRequestCreatedEvent', (event) => ({
    targetUserId: event.trainerId,
    realtimeType: 'marketplace:request:created',
    payload: {
      pipelineId: event.pipelineId,
      clientId: event.clientId,
      trainerId: event.trainerId,
      requestId: event.requestId,
    },
  }));

  // 2. Trainer accepts request -> notify Client User ID
  subscriber.registerMapping<TrainerRequestAcceptedEvent>(
    'TrainerRequestAcceptedEvent',
    (event) => ({
      targetUserId: event.clientId,
      realtimeType: 'marketplace:request:accepted',
      payload: {
        pipelineId: event.pipelineId,
        clientId: event.clientId,
        trainerId: event.trainerId,
      },
    }),
  );

  // 3. Trainer rejects request -> notify Client User ID
  subscriber.registerMapping<TrainerRequestRejectedEvent>(
    'TrainerRequestRejectedEvent',
    (event) => ({
      targetUserId: event.clientId,
      realtimeType: 'marketplace:request:rejected',
      payload: {
        pipelineId: event.pipelineId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        reason: event.reason,
      },
    }),
  );

  // 4. Client withdraws request -> notify Trainer User ID
  subscriber.registerMapping<TrainerRequestWithdrawnEvent>(
    'TrainerRequestWithdrawnEvent',
    (event) => ({
      targetUserId: event.trainerId,
      realtimeType: 'marketplace:request:withdrawn',
      payload: {
        pipelineId: event.pipelineId,
        clientId: event.clientId,
        trainerId: event.trainerId,
      },
    }),
  );

  // 5. Trainer closes pipeline -> notify Client User ID
  subscriber.registerMapping<AcquisitionPipelineClosedEvent>(
    'AcquisitionPipelineClosedEvent',
    (event) => ({
      targetUserId: event.clientId,
      realtimeType: 'marketplace:request:closed',
      payload: {
        pipelineId: event.pipelineId,
        clientId: event.clientId,
        trainerId: event.trainerId,
      },
    }),
  );
};
