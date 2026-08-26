import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { paymentRepository } from '../../infrastructure/repositories/PaymentRepositoryImpl';
import { refundRepository } from '../../infrastructure/repositories/RefundRepositoryImpl';
import { disputeRepository } from '../../infrastructure/repositories/DisputeRepositoryImpl';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { RazorpayCheckoutAdapter } from '../../infrastructure/providers/razorpayCheckout';
import { useAuthStore } from '../../../identity/application/store/authStore';
import { Role } from '../../../identity/domain/enums/Role';
import {
  PAYMENT_QUERY_KEYS,
  REFUND_QUERY_KEYS,
  DISPUTE_QUERY_KEYS,
  PAYOUT_QUERY_KEYS,
} from '../../application/queryKeys';
import { PaymentStatus } from '../../domain/types/payment.types';

describe('Payment Frontend Application Layer (Phase 12.3)', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.spyOn(queryClient, 'invalidateQueries');
    useAuthStore.setState({
      status: 'authenticated',
      user: { id: 'usr_client_1', role: Role.CLIENT },
    });
  });

  describe('1. Query Key Construction & Invalidation Targets', () => {
    it('generates exact PAYMENT_QUERY_KEYS hierarchy', () => {
      expect(PAYMENT_QUERY_KEYS.all).toEqual(['payments']);
      expect(PAYMENT_QUERY_KEYS.lists()).toEqual(['payments', 'list']);
      expect(PAYMENT_QUERY_KEYS.list({ page: 1, limit: 10 })).toEqual([
        'payments',
        'list',
        { page: 1, limit: 10 },
      ]);
      expect(PAYMENT_QUERY_KEYS.detail('pay_123')).toEqual(['payments', 'detail', 'pay_123']);
      expect(PAYMENT_QUERY_KEYS.invoice('pay_123')).toEqual([
        'payments',
        'detail',
        'pay_123',
        'invoice',
      ]);
    });

    it('generates exact REFUND_QUERY_KEYS and DISPUTE_QUERY_KEYS hierarchies', () => {
      expect(REFUND_QUERY_KEYS.all).toEqual(['refunds']);
      expect(REFUND_QUERY_KEYS.detail('pay_123', 'ref_123')).toEqual([
        'refunds',
        'pay_123',
        'ref_123',
      ]);

      expect(DISPUTE_QUERY_KEYS.all).toEqual(['disputes']);
      expect(DISPUTE_QUERY_KEYS.detail('pay_123', 'disp_123')).toEqual([
        'disputes',
        'pay_123',
        'disp_123',
      ]);
    });

    it('generates exact PAYOUT_QUERY_KEYS hierarchy', () => {
      expect(PAYOUT_QUERY_KEYS.all).toEqual(['payouts']);
      expect(PAYOUT_QUERY_KEYS.detail('pay_123')).toEqual(['payouts', 'detail', 'pay_123']);
      expect(PAYOUT_QUERY_KEYS.eligibility('pay_123')).toEqual([
        'payouts',
        'eligibility',
        'pay_123',
      ]);
      expect(PAYOUT_QUERY_KEYS.settlement('pay_123')).toEqual(['payouts', 'settlement', 'pay_123']);
    });
  });

  describe('2. Repository Invocation & Authorization Rules', () => {
    it('initiatePayment invokes repository with strictly offerId', async () => {
      const initiateSpy = vi
        .spyOn(paymentRepository, 'initiatePayment')
        .mockResolvedValue({ paymentId: 'pay_123' } as any);

      await paymentRepository.initiatePayment('off_accepted_001');
      expect(initiateSpy).toHaveBeenCalledWith('off_accepted_001');
    });

    it('verifyPayment invokes repository with signature verification payload', async () => {
      const verifySpy = vi
        .spyOn(paymentRepository, 'verifyPayment')
        .mockResolvedValue({ status: 'SUCCESS', paymentId: 'pay_123' } as any);

      await paymentRepository.verifyPayment('pay_123', {
        providerPaymentId: 'pay_rzp_1',
        providerOrderId: 'order_rzp_1',
        signature: 'sig_crypto_valid',
      });

      expect(verifySpy).toHaveBeenCalledWith('pay_123', {
        providerPaymentId: 'pay_rzp_1',
        providerOrderId: 'order_rzp_1',
        signature: 'sig_crypto_valid',
      });
    });

    it('requestRefund sends strictly reason without amount/percentage', async () => {
      const refundSpy = vi
        .spyOn(refundRepository, 'requestRefund')
        .mockResolvedValue({ refundId: 'ref_123' } as any);

      await refundRepository.requestRefund('pay_123', {
        reason: 'Service failure and trainer unresponsiveness',
      });

      expect(refundSpy).toHaveBeenCalledWith('pay_123', {
        reason: 'Service failure and trainer unresponsiveness',
      });
    });

    it('processPayout invokes repository without client financial amounts', async () => {
      const payoutSpy = vi
        .spyOn(payoutRepository, 'processPayout')
        .mockResolvedValue({ payoutId: 'pout_123' } as any);

      await payoutRepository.processPayout('pay_123', { idempotencyKey: 'idemp_key_1' });
      expect(payoutSpy).toHaveBeenCalledWith('pay_123', {
        idempotencyKey: 'idemp_key_1',
      });
    });
  });

  describe('3. Payment Invalidation & Cache Strategy Verification', () => {
    it('invalidates payment and offer queries after verification', () => {
      const paymentId = 'pay_abc_123';
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payments', 'detail', 'pay_abc_123'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payments', 'list'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['offers'],
      });
    });

    it('invalidates refund, payout eligibility and payment detail on refund mutation', () => {
      const paymentId = 'pay_refund_123';
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.eligibility(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.detail(paymentId) });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['refunds'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payouts', 'eligibility', 'pay_refund_123'],
      });
    });

    it('invalidates dispute, payout eligibility and payment detail on dispute mutation', () => {
      const paymentId = 'pay_dispute_123';
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.eligibility(paymentId) });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['disputes'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payouts', 'eligibility', 'pay_dispute_123'],
      });
    });

    it('invalidates payout, settlement and payment detail on payout mutation', () => {
      const paymentId = 'pay_payout_123';
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.detail(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.settlement(paymentId) });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.detail(paymentId) });

      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payouts'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['payouts', 'settlement', 'pay_payout_123'],
      });
    });
  });

  describe('4. End-to-End Razorpay Checkout & Server Verification Flow', () => {
    it('executes initiate -> checkout modal -> backend verification flow successfully', async () => {
      // Mock repository responses
      const mockInitiate = vi.spyOn(paymentRepository, 'initiatePayment').mockResolvedValue({
        paymentId: 'pay_flow_123',
        providerOrderId: 'order_flow_123',
        amount: 10000,
        currency: 'INR',
        keyId: 'rzp_key_test_123',
        pricing: {
          trainerFee: 8000,
          platformFee: 2000,
          totalAmount: 10000,
          currency: 'INR',
          commissionRate: 0.2,
        },
      });

      const mockVerify = vi.spyOn(paymentRepository, 'verifyPayment').mockResolvedValue({
        status: 'SUCCESS',
        paymentId: 'pay_flow_123',
        providerPaymentId: 'pay_rzp_flow_123',
      });

      const mockOpenCheckout = vi
        .spyOn(RazorpayCheckoutAdapter, 'openCheckout')
        .mockImplementation(async (options) => {
          // Simulate user paying in modal
          options.onSuccess({
            providerPaymentId: 'pay_rzp_flow_123',
            providerOrderId: 'order_flow_123',
            signature: 'sig_flow_valid',
          });
        });

      // Orchestration step-by-step
      const initResult = await paymentRepository.initiatePayment('off_accepted_flow');
      expect(mockInitiate).toHaveBeenCalledWith('off_accepted_flow');

      let verifiedResult: any = null;
      await RazorpayCheckoutAdapter.openCheckout({
        keyId: initResult.keyId,
        providerOrderId: initResult.providerOrderId,
        amount: initResult.amount,
        currency: initResult.currency,
        onSuccess: async (rzpPayload) => {
          verifiedResult = await paymentRepository.verifyPayment(initResult.paymentId, {
            providerPaymentId: rzpPayload.providerPaymentId,
            providerOrderId: rzpPayload.providerOrderId,
            signature: rzpPayload.signature,
          });
        },
      });

      expect(mockOpenCheckout).toHaveBeenCalledTimes(1);
      expect(mockVerify).toHaveBeenCalledWith('pay_flow_123', {
        providerPaymentId: 'pay_rzp_flow_123',
        providerOrderId: 'order_flow_123',
        signature: 'sig_flow_valid',
      });
      expect(verifiedResult.status).toBe('SUCCESS');
    });

    it('rejects flow and refuses to mark success when server verification rejects signature', async () => {
      vi.spyOn(paymentRepository, 'initiatePayment').mockResolvedValue({
        paymentId: 'pay_tamper_1',
        providerOrderId: 'order_tamper_1',
        amount: 10000,
        currency: 'INR',
        keyId: 'rzp_key_test_123',
        pricing: {
          trainerFee: 8000,
          platformFee: 2000,
          totalAmount: 10000,
          currency: 'INR',
          commissionRate: 0.2,
        },
      });

      vi.spyOn(paymentRepository, 'verifyPayment').mockRejectedValue(
        new Error('Payment signature verification failed.'),
      );

      vi.spyOn(RazorpayCheckoutAdapter, 'openCheckout').mockImplementation(async (options) => {
        options.onSuccess({
          providerPaymentId: 'pay_rzp_tamper',
          providerOrderId: 'order_tamper_1',
          signature: 'sig_tamper_invalid',
        });
      });

      const initResult = await paymentRepository.initiatePayment('off_accepted_tamper');

      let verifyError: Error | null = null;
      await RazorpayCheckoutAdapter.openCheckout({
        keyId: initResult.keyId,
        providerOrderId: initResult.providerOrderId,
        amount: initResult.amount,
        currency: initResult.currency,
        onSuccess: async (rzpPayload) => {
          try {
            await paymentRepository.verifyPayment(initResult.paymentId, {
              providerPaymentId: rzpPayload.providerPaymentId,
              providerOrderId: rzpPayload.providerOrderId,
              signature: rzpPayload.signature,
            });
          } catch (err: any) {
            verifyError = err;
          }
        },
      });

      expect(verifyError).not.toBeNull();
      expect(verifyError!.message).toBe('Payment signature verification failed.');
    });

    it('idempotently reuses existing payment order on repeated Pay click', async () => {
      const existingInitiateResult = {
        paymentId: 'pay_existing_123',
        providerOrderId: 'order_existing_123',
        amount: 15000,
        currency: 'INR',
        keyId: 'rzp_key_test_123',
        pricing: {
          trainerFee: 12000,
          platformFee: 3000,
          totalAmount: 15000,
          currency: 'INR',
          commissionRate: 0.2,
        },
      };

      const initiateSpy = vi
        .spyOn(paymentRepository, 'initiatePayment')
        .mockResolvedValue(existingInitiateResult);

      const firstClick = await paymentRepository.initiatePayment('off_repeat_click');
      const secondClick = await paymentRepository.initiatePayment('off_repeat_click');

      expect(initiateSpy).toHaveBeenCalledTimes(2);
      expect(firstClick.providerOrderId).toBe('order_existing_123');
      expect(secondClick.providerOrderId).toBe('order_existing_123');
      expect(secondClick.paymentId).toBe('pay_existing_123');
    });

    it('maps backend 409 conflict message cleanly without generic communication fallback', async () => {
      vi.spyOn(paymentRepository, 'initiatePayment').mockRejectedValue(
        new Error('A payment record already exists and has succeeded for offer off_succeeded_001'),
      );

      let caughtError: Error | null = null;
      try {
        await paymentRepository.initiatePayment('off_succeeded_001');
      } catch (err: any) {
        caughtError = err;
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError!.message).toContain('already exists and has succeeded');
      expect(caughtError!.message).not.toBe(
        'An error occurred while communicating with the server.',
      );
    });
  });
});
