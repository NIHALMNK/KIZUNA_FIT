import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { TrainerProfileRoom } from '../../../../infrastructure/websocket/utils/user-room.util';
import {
  TrainerProfileUpdatedEvent,
  TrainerAvatarUpdatedEvent,
  TrainerAvatarDeletedEvent,
  TrainerAvailabilityChangedEvent,
  TrainerCertificationAddedEvent,
  TrainerCertificationUpdatedEvent,
  TrainerCertificationDeletedEvent,
  TrainerShowcaseAddedEvent,
  TrainerShowcaseUpdatedEvent,
  TrainerShowcaseDeletedEvent,
} from '../../domain/events/TrainerProfileEvents';

/**
 * Registers Profile domain event mappings on RealtimeDomainEventSubscriber.
 * Translates Profile domain events to canonical realtime envelopes targeting scoped entity rooms.
 */
export const registerProfileRealtimeEvents = (subscriber: RealtimeDomainEventSubscriber): void => {
  // 1. General Profile Details Updated (Bio, Headline, Experience, Location, Specializations)
  subscriber.registerMapping<TrainerProfileUpdatedEvent>('TrainerProfileUpdatedEvent', (event) => ({
    targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
    realtimeType: 'profile:trainer:updated',
    payload: {
      trainerProfileId: event.trainerProfileId,
    },
  }));

  // 2. Avatar Updated
  subscriber.registerMapping<TrainerAvatarUpdatedEvent>('TrainerAvatarUpdatedEvent', (event) => ({
    targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
    realtimeType: 'profile:trainer:updated',
    payload: {
      trainerProfileId: event.trainerProfileId,
      avatarUrl: event.avatarUrl,
    },
  }));

  // 3. Avatar Deleted
  subscriber.registerMapping<TrainerAvatarDeletedEvent>('TrainerAvatarDeletedEvent', (event) => ({
    targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
    realtimeType: 'profile:trainer:updated',
    payload: {
      trainerProfileId: event.trainerProfileId,
    },
  }));

  // 4. Availability Status Changed
  subscriber.registerMapping<TrainerAvailabilityChangedEvent>(
    'TrainerAvailabilityChangedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:availability-changed',
      payload: {
        trainerProfileId: event.trainerProfileId,
        trainerUserId: event.userId,
        newStatus: event.newStatus,
      },
    }),
  );

  // 5. Certification Events
  subscriber.registerMapping<TrainerCertificationAddedEvent>(
    'TrainerCertificationAddedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:updated',
      payload: {
        trainerProfileId: event.trainerProfileId,
        certificationId: event.certificationId,
      },
    }),
  );

  subscriber.registerMapping<TrainerCertificationUpdatedEvent>(
    'TrainerCertificationUpdatedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:updated',
      payload: {
        trainerProfileId: event.trainerProfileId,
        certificationId: event.certificationId,
      },
    }),
  );

  subscriber.registerMapping<TrainerCertificationDeletedEvent>(
    'TrainerCertificationDeletedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:updated',
      payload: {
        trainerProfileId: event.trainerProfileId,
        certificationId: event.certificationId,
      },
    }),
  );

  // 6. Showcase Events
  subscriber.registerMapping<TrainerShowcaseAddedEvent>('TrainerShowcaseAddedEvent', (event) => ({
    targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
    realtimeType: 'profile:trainer:updated',
    payload: {
      trainerProfileId: event.trainerProfileId,
      showcaseId: event.showcaseId,
    },
  }));

  subscriber.registerMapping<TrainerShowcaseUpdatedEvent>(
    'TrainerShowcaseUpdatedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:updated',
      payload: {
        trainerProfileId: event.trainerProfileId,
        showcaseId: event.showcaseId,
      },
    }),
  );

  subscriber.registerMapping<TrainerShowcaseDeletedEvent>(
    'TrainerShowcaseDeletedEvent',
    (event) => ({
      targetRoom: TrainerProfileRoom.forProfile(event.trainerProfileId),
      realtimeType: 'profile:trainer:updated',
      payload: {
        trainerProfileId: event.trainerProfileId,
        showcaseId: event.showcaseId,
      },
    }),
  );
};
