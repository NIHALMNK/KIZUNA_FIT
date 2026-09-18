/**
 * KIZUNAFIT - Payment Realtime Query Bridge
 * Connects canonical Payment Socket.IO events to TanStack Query invalidation rules.
 *
 * Invariant: Realtime events trigger background query refetches; they are NEVER authoritative
 * sources of financial state.
 */

import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { PAYMENT_QUERY_KEYS, PAYOUT_QUERY_KEYS } from '../../application/queryKeys';
import {
  PaymentSucceededRealtimePayload,
  PaymentFailedRealtimePayload,
  PayoutEligibleRealtimePayload,
  PayoutPaidRealtimePayload,
} from './paymentRealtime.types';

export const registerPaymentRealtimeRules = (
  bridge: RealtimeQueryBridge,
  userRole?: string,
): (() => void) => {
  const unsubs: (() => void)[] = [];
  const normalizedRole = (userRole || '').toUpperCase();
  const isTrainerOrAdmin = normalizedRole === 'TRAINER' || normalizedRole === 'ADMIN';

  // 1. payment:succeeded -> Invalidate payment details, payment list, offers, dashboard
  const unPaymentSucceeded = bridge.registerRule<PaymentSucceededRealtimePayload>(
    'payment:succeeded',
    (event) => {
      const paymentId = event.payload?.paymentId || event.entityId;
      if (!paymentId) return [];

      const keys: (readonly unknown[])[] = [
        PAYMENT_QUERY_KEYS.detail(paymentId),
        PAYMENT_QUERY_KEYS.lists(),
        ['offers'],
        ['client-dashboard'],
      ];

      if (isTrainerOrAdmin) {
        keys.push(PAYOUT_QUERY_KEYS.eligibility(paymentId), PAYOUT_QUERY_KEYS.detail(paymentId));
      }

      return keys;
    },
  );
  unsubs.push(unPaymentSucceeded);

  // 2. payment:failed -> Invalidate payment details, payment list
  const unPaymentFailed = bridge.registerRule<PaymentFailedRealtimePayload>(
    'payment:failed',
    (event) => {
      const paymentId = event.payload?.paymentId || event.entityId;
      if (!paymentId) return [];

      return [PAYMENT_QUERY_KEYS.detail(paymentId), PAYMENT_QUERY_KEYS.lists()];
    },
  );
  unsubs.push(unPaymentFailed);

  // 3. payout:eligible -> Trainer/Admin only: Invalidate eligibility, payout details, payment details
  if (isTrainerOrAdmin) {
    const unPayoutEligible = bridge.registerRule<PayoutEligibleRealtimePayload>(
      'payout:eligible',
      (event) => {
        const paymentId = event.payload?.paymentId || event.entityId;
        if (!paymentId) return [];

        return [
          PAYOUT_QUERY_KEYS.eligibility(paymentId),
          PAYOUT_QUERY_KEYS.detail(paymentId),
          PAYMENT_QUERY_KEYS.detail(paymentId),
        ];
      },
    );
    unsubs.push(unPayoutEligible);

    // 4. payout:paid -> Trainer/Admin only: Invalidate payout details, settlement snapshot, payment details, list
    const unPayoutPaid = bridge.registerRule<PayoutPaidRealtimePayload>('payout:paid', (event) => {
      const paymentId = event.payload?.paymentId || event.entityId;
      if (!paymentId) return [];

      return [
        PAYOUT_QUERY_KEYS.detail(paymentId),
        PAYOUT_QUERY_KEYS.settlement(paymentId),
        PAYOUT_QUERY_KEYS.eligibility(paymentId),
        PAYMENT_QUERY_KEYS.detail(paymentId),
        PAYMENT_QUERY_KEYS.lists(),
      ];
    });
    unsubs.push(unPayoutPaid);
  }

  return () => {
    unsubs.forEach((unsub) => {
      try {
        unsub();
      } catch {
        // Ignore unsubscription cleanup errors safely
      }
    });
  };
};
