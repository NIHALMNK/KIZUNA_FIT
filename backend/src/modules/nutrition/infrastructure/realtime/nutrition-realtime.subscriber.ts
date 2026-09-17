import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import {
  NutritionPlanCreatedEvent,
  NutritionPlanActivatedEvent,
  NutritionPlanCompletedEvent,
  NutritionPlanSubmittedEvent,
  NutritionPlanRecalledEvent,
  NutritionPlanAcceptedEvent,
  NutritionPlanRejectedEvent,
  NutritionPlanDeletionRequestedEvent,
  NutritionPlanDeletionAcceptedEvent,
  NutritionPlanDeletionRejectedEvent,
  NutritionCompletionStartedEvent,
  NutritionCompletionUpdatedEvent,
  NutritionCompletedEvent,
} from '../../domain/events';

/**
 * Registers Nutrition domain event mappings on RealtimeDomainEventSubscriber.
 * Translates domain events to canonical realtime envelopes targeted at client and trainer user rooms.
 */
export const registerNutritionRealtimeEvents = (
  subscriber: RealtimeDomainEventSubscriber,
): void => {
  // 1. Nutrition Plan Created -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanCreatedEvent>('NutritionPlanCreatedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'nutrition:plan_created',
    payload: {
      planId: event.planId,
      coachingRelationshipId: event.coachingRelationshipId,
      trainerId: event.trainerId,
      clientId: event.clientId,
      version: event.version,
      status: event.status,
    },
  }));

  // 2. Nutrition Plan Activated -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanActivatedEvent>(
    'NutritionPlanActivatedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_activated',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        activatedAt: event.activatedAt.toISOString(),
      },
    }),
  );

  // 3. Nutrition Plan Completed -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanCompletedEvent>(
    'NutritionPlanCompletedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_completed',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        completedAt: event.completedAt.toISOString(),
      },
    }),
  );

  // 3b. Nutrition Plan Submitted -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanSubmittedEvent>(
    'NutritionPlanSubmittedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_submitted',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        submittedAt: event.submittedAt.toISOString(),
      },
    }),
  );

  // 3c. Nutrition Plan Recalled -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanRecalledEvent>('NutritionPlanRecalledEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'nutrition:plan_recalled',
    payload: {
      planId: event.planId,
      coachingRelationshipId: event.coachingRelationshipId,
      trainerId: event.trainerId,
      clientId: event.clientId,
      version: event.version,
      recalledAt: event.recalledAt.toISOString(),
    },
  }));

  // 3d. Nutrition Plan Accepted -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanAcceptedEvent>('NutritionPlanAcceptedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'nutrition:plan_accepted',
    payload: {
      planId: event.planId,
      coachingRelationshipId: event.coachingRelationshipId,
      trainerId: event.trainerId,
      clientId: event.clientId,
      version: event.version,
      acceptedAt: event.acceptedAt.toISOString(),
      previousActivePlanId: event.previousActivePlanId,
    },
  }));

  // 3e. Nutrition Plan Rejected -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanRejectedEvent>('NutritionPlanRejectedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'nutrition:plan_rejected',
    payload: {
      planId: event.planId,
      coachingRelationshipId: event.coachingRelationshipId,
      trainerId: event.trainerId,
      clientId: event.clientId,
      version: event.version,
      rejectedAt: event.rejectedAt.toISOString(),
      reason: event.reason,
    },
  }));

  // 3f. Nutrition Plan Deletion Requested -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanDeletionRequestedEvent>(
    'NutritionPlanDeletionRequestedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_deletion_requested',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        requestedAt: event.deletionRequestedAt.toISOString(),
      },
    }),
  );

  // 3g. Nutrition Plan Deletion Accepted -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanDeletionAcceptedEvent>(
    'NutritionPlanDeletionAcceptedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_deletion_accepted',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        acceptedAt: event.cancelledAt.toISOString(),
      },
    }),
  );

  // 3h. Nutrition Plan Deletion Rejected -> notify Client and Trainer
  subscriber.registerMapping<NutritionPlanDeletionRejectedEvent>(
    'NutritionPlanDeletionRejectedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:plan_deletion_rejected',
      payload: {
        planId: event.planId,
        coachingRelationshipId: event.coachingRelationshipId,
        trainerId: event.trainerId,
        clientId: event.clientId,
        version: event.version,
        rejectedAt: event.rejectedAt.toISOString(),
      },
    }),
  );

  // 4. Nutrition Completion Started -> notify Client and Trainer
  subscriber.registerMapping<NutritionCompletionStartedEvent>(
    'NutritionCompletionStartedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:completion_started',
      payload: {
        completionId: event.completionId,
        coachingRelationshipId: event.coachingRelationshipId,
        nutritionPlanId: event.nutritionPlanId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        dayNumber: event.dayNumber,
        startedAt: event.startedAt.toISOString(),
      },
    }),
  );

  // 5. Nutrition Completion Updated -> notify Client and Trainer
  subscriber.registerMapping<NutritionCompletionUpdatedEvent>(
    'NutritionCompletionUpdatedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'nutrition:completion_updated',
      payload: {
        completionId: event.completionId,
        coachingRelationshipId: event.coachingRelationshipId,
        nutritionPlanId: event.nutritionPlanId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        dayNumber: event.dayNumber,
        updatedAt: event.updatedAt.toISOString(),
      },
    }),
  );

  // 6. Nutrition Completed -> notify Client and Trainer
  subscriber.registerMapping<NutritionCompletedEvent>('NutritionCompletedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'nutrition:completed',
    payload: {
      completionId: event.completionId,
      coachingRelationshipId: event.coachingRelationshipId,
      nutritionPlanId: event.nutritionPlanId,
      clientId: event.clientId,
      trainerId: event.trainerId,
      dayNumber: event.dayNumber,
      completedAt: event.completedAt.toISOString(),
    },
  }));
};
