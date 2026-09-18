import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { socketClientService } from '../../../../infrastructure/realtime/SocketClientService';
import { registerPaymentRealtimeRules } from '../../infrastructure/realtime/paymentRealtimeBridge';
import { PAYMENT_QUERY_KEYS, PAYOUT_QUERY_KEYS } from '../../application/queryKeys';

describe('Payment Realtime Integration (Phase 12.5)', () => {
  let queryClient: QueryClient;
  let bridge: RealtimeQueryBridge;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.spyOn(queryClient, 'invalidateQueries');
    bridge = new RealtimeQueryBridge(queryClient);
  });

  describe('1. Canonical Event -> Query Invalidation Rules', () => {
    it('handles payment:succeeded event by invalidating payment detail, list, offers, and dashboard', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'CLIENT');

      // Simulate socket event delivery
      (socketClientService as any).dispatchRealtimeEvent('payment:succeeded', {
        type: 'payment:succeeded',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_succ_123',
        payload: {
          paymentId: 'pay_succ_123',
          offerId: 'off_123',
          clientId: 'cli_123',
          trainerId: 'trn_123',
          totalAmount: 10000,
          currency: 'INR',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.detail('pay_succ_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.lists(),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['offers'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['client-dashboard'],
      });

      cleanup();
    });

    it('handles payment:failed event by invalidating payment detail and list', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'CLIENT');

      (socketClientService as any).dispatchRealtimeEvent('payment:failed', {
        type: 'payment:failed',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_fail_123',
        payload: {
          paymentId: 'pay_fail_123',
          clientId: 'cli_123',
          trainerId: 'trn_123',
          reason: 'Gateway card declined',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.detail('pay_fail_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.lists(),
      });

      cleanup();
    });

    it('handles payout:eligible event for TRAINER by invalidating eligibility and payout details', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'TRAINER');

      (socketClientService as any).dispatchRealtimeEvent('payout:eligible', {
        type: 'payout:eligible',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_elig_123',
        payload: {
          paymentId: 'pay_elig_123',
          payoutId: 'pout_123',
          trainerId: 'trn_123',
          amount: 8000,
          currency: 'INR',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.eligibility('pay_elig_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.detail('pay_elig_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.detail('pay_elig_123'),
      });

      cleanup();
    });

    it('handles payout:paid event for TRAINER by invalidating payout, settlement snapshot, and payment detail', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'TRAINER');

      (socketClientService as any).dispatchRealtimeEvent('payout:paid', {
        type: 'payout:paid',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_paid_123',
        payload: {
          paymentId: 'pay_paid_123',
          payoutId: 'pout_123',
          trainerId: 'trn_123',
          amount: 8000,
          currency: 'INR',
          gatewayPayoutId: 'pout_rzp_999',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.detail('pay_paid_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.settlement('pay_paid_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.eligibility('pay_paid_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.detail('pay_paid_123'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.lists(),
      });

      cleanup();
    });
  });

  describe('2. Role-Gating & Event Security Protections', () => {
    it('does not register trainer payout rules when user is CLIENT', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'CLIENT');

      (socketClientService as any).dispatchRealtimeEvent('payout:paid', {
        type: 'payout:paid',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_paid_123',
        payload: {
          paymentId: 'pay_paid_123',
          payoutId: 'pout_123',
          trainerId: 'trn_123',
          amount: 8000,
          currency: 'INR',
        },
      });

      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();

      cleanup();
    });

    it('safely ignores events missing payment identifier without throwing errors', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'TRAINER');

      (socketClientService as any).dispatchRealtimeEvent('payment:succeeded', {
        type: 'payment:succeeded',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: '',
        payload: {} as any,
      });

      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();

      cleanup();
    });

    it('cleans up all subscriptions cleanly upon unregistration', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'ADMIN');
      cleanup();

      (socketClientService as any).dispatchRealtimeEvent('payment:succeeded', {
        type: 'payment:succeeded',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_unreg_123',
        payload: { paymentId: 'pay_unreg_123' } as any,
      });

      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });
});
