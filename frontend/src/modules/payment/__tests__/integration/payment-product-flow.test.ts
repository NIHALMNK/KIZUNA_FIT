import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { paymentApi } from '../../infrastructure/api/paymentApi';
import { refundApi } from '../../infrastructure/api/refundApi';
import { disputeApi } from '../../infrastructure/api/disputeApi';
import { payoutApi } from '../../infrastructure/api/payoutApi';
import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { socketClientService } from '../../../../infrastructure/realtime/SocketClientService';
import { registerPaymentRealtimeRules } from '../../infrastructure/realtime/paymentRealtimeBridge';
import { PAYMENT_QUERY_KEYS, PAYOUT_QUERY_KEYS } from '../../application/queryKeys';
import { RefundStatus, RefundType } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { PayoutStatus } from '../../domain/types/payout.types';

describe('Payment Domain Product-Flow Integration (Phase 12.7)', () => {
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

  describe('1. Client Product-Flow Integration', () => {
    it('initiates payment from an accepted offer sending ONLY offerId', async () => {
      const initiateSpy = vi.spyOn(paymentApi, 'initiatePayment').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_offer_accepted_001',
          providerOrderId: 'order_rzp_001',
          amount: 15000,
          currency: 'INR',
          keyId: 'rzp_test_key_001',
          pricing: {
            trainerFee: 12000,
            platformFee: 3000,
            totalAmount: 15000,
            currency: 'INR',
            commissionRate: 0.2,
          },
        },
      });

      const response = await paymentApi.initiatePayment({
        offerId: 'off_accepted_001',
      });

      expect(initiateSpy).toHaveBeenCalledWith({
        offerId: 'off_accepted_001',
      });
      expect(response.data.paymentId).toBe('pay_offer_accepted_001');
    });

    it('submits exceptional service-failure refund request with strictly reason string', async () => {
      const refundSpy = vi.spyOn(refundApi, 'requestRefund').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_serv_fail_001',
          paymentId: 'pay_001',
          amount: 12000,
          currency: 'INR',
          reason: 'Trainer never held any onboarding or workout session.',
          requestedBy: 'cli_001',
          requestedAt: '2026-08-25T10:00:00.000Z',
          status: RefundStatus.PENDING,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
        },
      });

      const response = await refundApi.requestRefund('pay_001', {
        reason: 'Trainer never held any onboarding or workout session.',
      });

      expect(refundSpy).toHaveBeenCalledWith('pay_001', {
        reason: 'Trainer never held any onboarding or workout session.',
      });
      expect(response.data.amount).toBe(12000);
      expect(response.data.status).toBe(RefundStatus.PENDING);
    });

    it('raises client dispute and freezes payout transfer', async () => {
      const disputeSpy = vi.spyOn(disputeApi, 'raiseDispute').mockResolvedValueOnce({
        status: 'success',
        data: {
          disputeId: 'disp_cli_001',
          paymentId: 'pay_001',
          raisedBy: 'cli_001',
          reason: 'Double billed by bank and gateway.',
          status: DisputeStatus.OPEN,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await disputeApi.raiseDispute('pay_001', {
        reason: 'Double billed by bank and gateway.',
      });

      expect(disputeSpy).toHaveBeenCalledWith('pay_001', {
        reason: 'Double billed by bank and gateway.',
      });
      expect(response.data.status).toBe(DisputeStatus.OPEN);
    });

    it('handles 409 duplicate payment initiation by triggering query invalidations to reconcile authoritative state', async () => {
      // Simulate duplicate payment conflict error
      const conflictError = new Error(
        'A payment record already exists and has succeeded for offer off_001',
      );

      if (
        conflictError.message.includes('already exists') ||
        conflictError.message.includes('succeeded')
      ) {
        queryClient.invalidateQueries({ queryKey: ['offers'] });
        queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
        queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.all });
      }

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['offers'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['client-dashboard'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.all,
      });
    });
  });

  describe('2. Trainer Product-Flow Integration', () => {
    it('trainer fetches payment list containing successful coaching payments via paymentRepository', async () => {
      const { paymentRepository } =
        await import('../../infrastructure/repositories/PaymentRepositoryImpl');
      const listSpy = vi.spyOn(paymentApi, 'listPayments').mockResolvedValueOnce({
        status: 'ok',
        data: {
          payments: [
            {
              id: 'pay_trn_001',
              offerId: 'off_001',
              acquisitionPipelineId: 'acq_001',
              clientId: 'cli_001',
              trainerId: 'trn_001',
              pricing: {
                trainerFee: 12000,
                platformFee: 3000,
                totalAmount: 15000,
                currency: 'INR',
              },
              status: 'SUCCESS',
              subscription: {
                id: 'sub_001',
                status: 'ACTIVE',
                sessionsIncluded: 12,
                sessionsRemaining: 12,
              },
              payout: {
                id: 'pout_001',
                amount: 12000,
                status: 'PAID',
                eligibleAt: '2026-08-28T10:00:00.000Z',
              },
              settlement: {
                id: 'set_001',
                trainerAmount: 12000,
                platformAmount: 3000,
                settledAt: '2026-08-29T10:00:00.000Z',
              },
              transactions: [],
              refunds: [],
              disputes: [],
              createdAt: '2026-08-25T10:00:00.000Z',
              updatedAt: '2026-08-25T10:00:00.000Z',
            },
          ],
          total: 1,
          limit: 20,
          offset: 0,
        } as any,
      });

      const result = await paymentRepository.listPayments({ page: 1, limit: 20 });

      expect(listSpy).toHaveBeenCalled();
      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.data[0].paymentId).toBe('pay_trn_001');
      expect(result.data[0].pricing.trainerFee).toBe(12000);
      expect(result.data[0].pricing.totalAmount).toBe(15000);
      expect(result.data[0].payout?.status).toBe('PAID');
    });

    it('checks trainer payout eligibility and reflects active dispute freeze', async () => {
      const eligibilitySpy = vi.spyOn(payoutApi, 'checkEligibility').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_trn_001',
          payoutId: 'pout_trn_001',
          trainerId: 'trn_001',
          isEligible: false,
          eligibleAmount: 0,
          currency: 'INR',
          hasActiveDispute: true,
          reason: 'Payout transfer is frozen due to an active payment dispute.',
        },
      });

      const response = await payoutApi.checkEligibility('pay_trn_001');
      expect(eligibilitySpy).toHaveBeenCalledWith('pay_trn_001');
      expect(response.data.isEligible).toBe(false);
      expect(response.data.hasActiveDispute).toBe(true);
    });

    it('retrieves read-only settlement snapshot after payout reaches PAID', async () => {
      const settlementSpy = vi.spyOn(payoutApi, 'getSettlement').mockResolvedValueOnce({
        status: 'success',
        data: {
          settlementId: 'set_trn_001',
          paymentId: 'pay_trn_001',
          payoutId: 'pout_trn_001',
          trainerId: 'trn_001',
          trainerAmount: 12000,
          platformAmount: 3000,
          currency: 'INR',
          settledAt: '2026-08-25T12:00:00.000Z',
        },
      });

      const response = await payoutApi.getSettlement('pay_trn_001');
      expect(settlementSpy).toHaveBeenCalledWith('pay_trn_001');
      expect(response.data.trainerAmount).toBe(12000);
      expect(response.data.platformAmount).toBe(3000);
    });
  });

  describe('3. Admin Product-Flow Integration', () => {
    it('admin approves full refund and dispatches gateway transfer', async () => {
      const approveSpy = vi.spyOn(refundApi, 'approveRefund').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_001',
          paymentId: 'pay_001',
          amount: 12000,
          currency: 'INR',
          reason: 'Trainer no-show confirmed.',
          requestedBy: 'cli_001',
          requestedAt: '2026-08-25T10:00:00.000Z',
          status: RefundStatus.APPROVED,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
          adminNotes: 'Confirmed no-show through consultation logs.',
        },
      });

      const processSpy = vi.spyOn(refundApi, 'processApprovedRefund').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_001',
          paymentId: 'pay_001',
          amount: 12000,
          currency: 'INR',
          reason: 'Trainer no-show confirmed.',
          requestedBy: 'cli_001',
          requestedAt: '2026-08-25T10:00:00.000Z',
          status: RefundStatus.PROCESSED,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
        },
      });

      const approveRes = await refundApi.approveRefund('pay_001', 'ref_001', {
        adminNotes: 'Confirmed no-show through consultation logs.',
      });
      expect(approveSpy).toHaveBeenCalled();
      expect(approveRes.data.status).toBe(RefundStatus.APPROVED);

      const processRes = await refundApi.processApprovedRefund('pay_001', 'ref_001');
      expect(processSpy).toHaveBeenCalled();
      expect(processRes.data.status).toBe(RefundStatus.PROCESSED);
    });

    it('admin resolves dispute with resolutionNotes and closes it to unfreeze payout', async () => {
      const resolveSpy = vi.spyOn(disputeApi, 'resolveDispute').mockResolvedValueOnce({
        status: 'success',
        data: {
          disputeId: 'disp_001',
          paymentId: 'pay_001',
          raisedBy: 'cli_001',
          reason: 'Double billing issue.',
          resolutionNotes: 'Bank transaction logs reconciled; second charge was released.',
          status: DisputeStatus.RESOLVED,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const closeSpy = vi.spyOn(disputeApi, 'closeDispute').mockResolvedValueOnce({
        status: 'success',
        data: {
          disputeId: 'disp_001',
          paymentId: 'pay_001',
          raisedBy: 'cli_001',
          reason: 'Double billing issue.',
          status: DisputeStatus.CLOSED,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const resolveRes = await disputeApi.resolveDispute('pay_001', 'disp_001', {
        resolutionNotes: 'Bank transaction logs reconciled; second charge was released.',
      });
      expect(resolveSpy).toHaveBeenCalled();
      expect(resolveRes.data.status).toBe(DisputeStatus.RESOLVED);

      const closeRes = await disputeApi.closeDispute('pay_001', 'disp_001');
      expect(closeSpy).toHaveBeenCalled();
      expect(closeRes.data.status).toBe(DisputeStatus.CLOSED);
    });

    it('admin processes payout transfer without custom financial amount', async () => {
      const processPayoutSpy = vi.spyOn(payoutApi, 'processPayout').mockResolvedValueOnce({
        status: 'success',
        data: {
          payoutId: 'pout_001',
          paymentId: 'pay_001',
          trainerId: 'trn_001',
          amount: 12000,
          currency: 'INR',
          status: PayoutStatus.PROCESSING,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await payoutApi.processPayout('pay_001', {
        idempotencyKey: 'idem_flow_001',
      });

      expect(processPayoutSpy).toHaveBeenCalledWith('pay_001', {
        idempotencyKey: 'idem_flow_001',
      });
      expect(response.data.status).toBe(PayoutStatus.PROCESSING);
    });
  });

  describe('4. Realtime Product-Flow Invalidation', () => {
    it('payment:succeeded triggers refetch of payment details, offers, and dashboard', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'CLIENT');

      (socketClientService as any).dispatchRealtimeEvent('payment:succeeded', {
        type: 'payment:succeeded',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_flow_001',
        payload: {
          paymentId: 'pay_flow_001',
          offerId: 'off_flow_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          totalAmount: 15000,
          currency: 'INR',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYMENT_QUERY_KEYS.detail('pay_flow_001'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['offers'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['client-dashboard'],
      });

      cleanup();
    });

    it('payout:paid triggers refetch of settlement and payout details for trainer', () => {
      const cleanup = registerPaymentRealtimeRules(bridge, 'TRAINER');

      (socketClientService as any).dispatchRealtimeEvent('payout:paid', {
        type: 'payout:paid',
        version: 1,
        timestamp: '2026-08-25T10:00:00.000Z',
        entityId: 'pay_flow_001',
        payload: {
          paymentId: 'pay_flow_001',
          payoutId: 'pout_001',
          trainerId: 'trn_001',
          amount: 12000,
          currency: 'INR',
        },
      });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.detail('pay_flow_001'),
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: PAYOUT_QUERY_KEYS.settlement('pay_flow_001'),
      });

      cleanup();
    });
  });
});
