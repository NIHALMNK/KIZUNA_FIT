import { RealtimeDomainEventSubscriber } from '../../../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { PaymentSucceededEvent } from '../../domain/events/payment-succeeded.event';
import { PaymentFailedEvent } from '../../domain/events/payment-failed.event';
import { PayoutEligibleEvent } from '../../domain/events/payout-eligible.event';
import { PayoutPaidEvent } from '../../domain/events/payout-paid.event';

/**
 * Registers Payment domain event mappings on RealtimeDomainEventSubscriber.
 * Translates domain events to canonical realtime envelopes targeted at verified recipient user rooms.
 */
export const registerPaymentRealtimeEvents = (subscriber: RealtimeDomainEventSubscriber): void => {
  // 1. Payment Succeeded -> notify both Client and Trainer User IDs
  subscriber.registerMapping<PaymentSucceededEvent>('PaymentSucceededEvent', (event) => ({
    targetUserIds: [event.clientId, event.trainerId],
    realtimeType: 'payment:succeeded',
    payload: {
      paymentId: event.paymentId,
      offerId: event.offerId,
      acquisitionPipelineId: event.acquisitionPipelineId,
      clientId: event.clientId,
      trainerId: event.trainerId,
      totalAmount: event.totalAmount,
      currency: event.currency,
      invoiceNumber: event.invoiceNumber,
      subscriptionId: event.subscriptionId,
    },
  }));

  // 2. Payment Failed -> notify Client User ID
  subscriber.registerMapping<PaymentFailedEvent>('PaymentFailedEvent', (event) => ({
    targetUserId: event.clientId,
    realtimeType: 'payment:failed',
    payload: {
      paymentId: event.paymentId,
      clientId: event.clientId,
      trainerId: event.trainerId,
      reason: event.reason,
    },
  }));

  // 3. Payout Eligible -> notify Trainer User ID
  subscriber.registerMapping<PayoutEligibleEvent>('PayoutEligibleEvent', (event) => ({
    targetUserId: event.trainerId,
    realtimeType: 'payout:eligible',
    payload: {
      paymentId: event.paymentId,
      payoutId: event.payoutId,
      trainerId: event.trainerId,
      amount: event.amount,
      currency: event.currency,
    },
  }));

  // 4. Payout Paid -> notify Trainer User ID
  subscriber.registerMapping<PayoutPaidEvent>('PayoutPaidEvent', (event) => ({
    targetUserId: event.trainerId,
    realtimeType: 'payout:paid',
    payload: {
      paymentId: event.paymentId,
      payoutId: event.payoutId,
      trainerId: event.trainerId,
      amount: event.amount,
      currency: event.currency,
      gatewayPayoutId: event.gatewayPayoutId,
    },
  }));
};
