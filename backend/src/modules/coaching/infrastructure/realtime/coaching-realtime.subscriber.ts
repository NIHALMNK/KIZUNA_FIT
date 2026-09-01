import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import {
  CoachingRelationshipCreatedEvent,
  CoachingRelationshipActivatedEvent,
  CoachingRelationshipCompletedEvent,
  CoachingRelationshipCancelledEvent,
  CoachingRelationshipDisputedEvent,
  CoachingRelationshipRefundedEvent,
} from '../../domain/events';

/**
 * Registers Coaching domain event mappings on RealtimeDomainEventSubscriber.
 * Translates domain events to canonical realtime envelopes targeted at client and trainer user rooms.
 */
export const registerCoachingRealtimeEvents = (subscriber: RealtimeDomainEventSubscriber): void => {
  // 1. Coaching Relationship Created -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipCreatedEvent>(
    'CoachingRelationshipCreatedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_created',
      payload: {
        relationshipId: event.relationshipId,
        acquisitionPipelineId: event.acquisitionPipelineId,
        paymentId: event.paymentId,
        subscriptionId: event.subscriptionId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        status: event.status,
        activatedAt: event.activatedAt?.toISOString() ?? null,
      },
    }),
  );

  // 2. Coaching Relationship Activated -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipActivatedEvent>(
    'CoachingRelationshipActivatedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_activated',
      payload: {
        relationshipId: event.relationshipId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        activatedAt: event.activatedAt.toISOString(),
      },
    }),
  );

  // 3. Coaching Relationship Completed -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipCompletedEvent>(
    'CoachingRelationshipCompletedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_completed',
      payload: {
        relationshipId: event.relationshipId,
        paymentId: event.paymentId,
        subscriptionId: event.subscriptionId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        completedAt: event.completedAt.toISOString(),
      },
    }),
  );

  // 4. Coaching Relationship Cancelled -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipCancelledEvent>(
    'CoachingRelationshipCancelledEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_cancelled',
      payload: {
        relationshipId: event.relationshipId,
        paymentId: event.paymentId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        cancelledBy: event.cancelledBy,
        reason: event.reason,
        cancelledAt: event.cancelledAt.toISOString(),
      },
    }),
  );

  // 5. Coaching Relationship Disputed -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipDisputedEvent>(
    'CoachingRelationshipDisputedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_disputed',
      payload: {
        relationshipId: event.relationshipId,
        paymentId: event.paymentId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        disputeId: event.disputeId,
        disputedAt: event.disputedAt.toISOString(),
      },
    }),
  );

  // 6. Coaching Relationship Refunded -> notify both Client and Trainer
  subscriber.registerMapping<CoachingRelationshipRefundedEvent>(
    'CoachingRelationshipRefundedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'coaching:relationship_refunded',
      payload: {
        relationshipId: event.relationshipId,
        paymentId: event.paymentId,
        clientId: event.clientId,
        trainerId: event.trainerId,
        refundId: event.refundId,
        refundedAt: event.refundedAt.toISOString(),
      },
    }),
  );
};
