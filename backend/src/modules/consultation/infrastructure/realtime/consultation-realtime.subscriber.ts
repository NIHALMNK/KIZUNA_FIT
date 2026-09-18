import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { ConsultationCreatedEvent } from '../../domain/events/consultation-created.event';
import { ConsultationScheduledEvent } from '../../domain/events/consultation-scheduled.event';
import { ConsultationSlotBookedEvent } from '../../domain/events/consultation-slot-booked.event';
import { ConsultationCancelledEvent } from '../../domain/events/consultation-cancelled.event';
import { ConsultationCompletedEvent } from '../../domain/events/consultation-completed.event';
import { ConsultationNoShowEvent } from '../../domain/events/consultation-no-show.event';
import { ConsultationRescheduledEvent } from '../../domain/events/consultation-rescheduled.event';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';

/**
 * Registers Consultation domain event mappings on RealtimeDomainEventSubscriber.
 * Translates Consultation domain events to canonical realtime envelopes targeted at participant user rooms (`user:<userId>`).
 */
export const registerConsultationRealtimeEvents = (
  subscriber: RealtimeDomainEventSubscriber,
): void => {
  // 1. Consultation Created -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationCreatedEvent>('ConsultationCreatedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'consultation:created',
    payload: {
      consultationId: event.consultationId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      status: ConsultationStatus.CREATED,
    },
  }));

  // 2. Consultation Slot Booked -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationSlotBookedEvent>(
    'ConsultationSlotBookedEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'consultation:scheduled',
      payload: {
        consultationId: event.consultationId,
        scheduledStartAt: event.scheduledStartAt.toISOString(),
        scheduledEndAt: event.scheduledEndAt.toISOString(),
        status: ConsultationStatus.SLOT_BOOKED,
      },
    }),
  );

  // 3. Consultation Scheduled -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationScheduledEvent>('ConsultationScheduledEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'consultation:scheduled',
    payload: {
      consultationId: event.consultationId,
      scheduledStartAt: event.scheduledStartAt.toISOString(),
      scheduledEndAt: event.scheduledEndAt.toISOString(),
      status: ConsultationStatus.SCHEDULED,
    },
  }));

  // 3b. Consultation Rescheduled -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationRescheduledEvent>(
    'ConsultationRescheduledEvent',
    (event) => ({
      targetUserIds: [event.clientId, event.trainerId],
      realtimeType: 'consultation:rescheduled',
      payload: {
        consultationId: event.consultationId,
        scheduledStartAt: event.scheduledStartAt.toISOString(),
        scheduledEndAt: event.scheduledEndAt.toISOString(),
        timezone: event.timezone,
      },
    }),
  );

  // 4. Consultation Cancelled -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationCancelledEvent>('ConsultationCancelledEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'consultation:cancelled',
    payload: {
      consultationId: event.consultationId,
      cancelledBy: event.cancelledBy,
      status: ConsultationStatus.CANCELLED,
    },
  }));

  // 5. Consultation Completed -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationCompletedEvent>('ConsultationCompletedEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'consultation:completed',
    payload: {
      consultationId: event.consultationId,
      completedAt: event.completedAt.toISOString(),
      status: ConsultationStatus.COMPLETED,
    },
  }));

  // 6. Consultation No-Show -> notify both Client and Trainer
  subscriber.registerMapping<ConsultationNoShowEvent>('ConsultationNoShowEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'consultation:no-show',
    payload: {
      consultationId: event.consultationId,
      status: ConsultationStatus.NO_SHOW,
    },
  }));
};
