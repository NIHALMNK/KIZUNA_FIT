import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { OfferCreatedEvent } from '../../domain/events/offer-created.event';
import { OfferSentEvent } from '../../domain/events/offer-sent.event';
import { OfferAcceptedEvent } from '../../domain/events/offer-accepted.event';
import { OfferDeclinedEvent } from '../../domain/events/offer-declined.event';
import { OfferExpiredEvent } from '../../domain/events/offer-expired.event';
import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';

/**
 * Registers Offer domain event mappings on RealtimeDomainEventSubscriber.
 * Translates Offer domain events to canonical realtime envelopes targeted at participant user rooms (`user:<userId>`).
 */
export const registerOfferRealtimeEvents = (subscriber: RealtimeDomainEventSubscriber): void => {
  // 1. Offer Created -> notify Trainer
  subscriber.registerMapping<OfferCreatedEvent>('OfferCreatedEvent', (event) => ({
    targetUserId: event.trainerId,
    realtimeType: 'offer:created',
    payload: {
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      consultationId: event.consultationId,
      status: CoachingOfferStatus.DRAFT,
    },
  }));

  // 2. Offer Sent -> notify Client and Trainer
  subscriber.registerMapping<OfferSentEvent>('OfferSentEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'offer:sent',
    payload: {
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      consultationId: event.consultationId,
      expiresAt: event.expiresAt.toISOString(),
      status: CoachingOfferStatus.SENT,
    },
  }));

  // 3. Offer Accepted -> notify Client and Trainer
  subscriber.registerMapping<OfferAcceptedEvent>('OfferAcceptedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'offer:accepted',
    payload: {
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      consultationId: event.consultationId,
      acceptedAt: event.acceptedAt.toISOString(),
      status: CoachingOfferStatus.ACCEPTED,
    },
  }));

  // 4. Offer Declined -> notify Client and Trainer
  subscriber.registerMapping<OfferDeclinedEvent>('OfferDeclinedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'offer:declined',
    payload: {
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      consultationId: event.consultationId,
      declinedAt: event.declinedAt.toISOString(),
      reason: event.reason,
      status: CoachingOfferStatus.DECLINED,
    },
  }));

  // 5. Offer Expired -> notify Client and Trainer
  subscriber.registerMapping<OfferExpiredEvent>('OfferExpiredEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'offer:expired',
    payload: {
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      consultationId: event.consultationId,
      expiredAt: event.expiredAt.toISOString(),
      status: CoachingOfferStatus.EXPIRED,
    },
  }));
};
