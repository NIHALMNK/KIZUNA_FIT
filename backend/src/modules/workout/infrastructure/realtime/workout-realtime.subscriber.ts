import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import {
  WorkoutProgramCreatedEvent,
  WorkoutProgramActivatedEvent,
  WorkoutCompletionStartedEvent,
  WorkoutCompletedEvent,
} from '../../domain/events';

export const registerWorkoutRealtimeEvents = (subscriber: RealtimeDomainEventSubscriber): void => {
  // 1. Workout Program Created -> notify Client and Trainer
  subscriber.registerMapping<WorkoutProgramCreatedEvent>('WorkoutProgramCreatedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'workout:program_created',
    payload: {
      programId: event.programId,
      coachingRelationshipId: event.coachingRelationshipId,
      trainerId: event.trainerId,
      clientId: event.clientId,
      version: event.version,
      status: event.status,
    },
  }));

  // 2. Workout Program Activated -> notify Client and Trainer
  subscriber.registerMapping<WorkoutProgramActivatedEvent>(
    'WorkoutProgramActivatedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'workout:program_activated',
      payload: {
        programId: event.programId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        activatedAt: event.activatedAt.toISOString(),
      },
    }),
  );

  // 3. Workout Completion Started -> notify Client and Trainer
  subscriber.registerMapping<WorkoutCompletionStartedEvent>(
    'WorkoutCompletionStartedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'workout:completion_started',
      payload: {
        completionId: event.completionId,
        coachingRelationshipId: event.coachingRelationshipId,
        workoutProgramId: event.workoutProgramId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        workoutDay: event.workoutDay,
        startedAt: event.startedAt.toISOString(),
      },
    }),
  );

  // 4. Workout Completed -> notify Client and Trainer
  subscriber.registerMapping<WorkoutCompletedEvent>('WorkoutCompletedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'workout:completed',
    payload: {
      completionId: event.completionId,
      coachingRelationshipId: event.coachingRelationshipId,
      workoutProgramId: event.workoutProgramId,
      clientId: event.clientId,
      trainerId: event.trainerId,
      workoutDay: event.workoutDay,
      completedAt: event.completedAt.toISOString(),
    },
  }));
};
