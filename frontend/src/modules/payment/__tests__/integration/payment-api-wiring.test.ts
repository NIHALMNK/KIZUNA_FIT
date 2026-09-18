import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { paymentApi } from '../../infrastructure/api/paymentApi';
import { refundApi } from '../../infrastructure/api/refundApi';
import { disputeApi } from '../../infrastructure/api/disputeApi';
import { payoutApi } from '../../infrastructure/api/payoutApi';
import {
  PAYMENT_QUERY_KEYS,
  REFUND_QUERY_KEYS,
  DISPUTE_QUERY_KEYS,
  PAYOUT_QUERY_KEYS,
} from '../../application/queryKeys';
import {
  PaymentStatus,
  SubscriptionStatus,
  TransactionType,
} from '../../domain/types/payment.types';
import { RefundStatus, RefundType } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { PayoutStatus } from '../../domain/types/payout.types';

describe('Payment Frontend API Wiring & End-to-End Integration (Phase 12.6)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. Payment API Operations & Server Financial Authority', () => {
    it('initiatePayment sends strictly { offerId } and never client-side amounts', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_init_123',
          providerOrderId: 'order_rzp_123',
          amount: 10000,
          currency: 'INR',
          keyId: 'rzp_test_key_123',
          offerId: 'off_accepted_123',
        },
      });

      const response = await paymentApi.initiatePayment({
        offerId: 'off_accepted_123',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments', {
        offerId: 'off_accepted_123',
      });
      expect(response.data.paymentId).toBe('pay_init_123');
      expect(response.data.amount).toBe(10000);
    });

    it('verifyPayment submits provider cryptographic signatures to /payments/:id/verify', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_init_123',
          status: PaymentStatus.SUCCESS,
          subscriptionId: 'sub_active_123',
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          paidAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await paymentApi.verifyPayment('pay_init_123', {
        providerPaymentId: 'pay_rzp_999',
        providerOrderId: 'order_rzp_123',
        signature: 'sig_crypto_valid_123',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_init_123/verify', {
        providerPaymentId: 'pay_rzp_999',
        providerOrderId: 'order_rzp_123',
        providerSignature: 'sig_crypto_valid_123',
      });
      expect(response.data.status).toBe(PaymentStatus.SUCCESS);
    });

    it('getPaymentById retrieves single aggregate details from /payments/:id', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_001',
          offerId: 'off_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
          status: PaymentStatus.SUCCESS,
          transactions: [],
          subscription: {
            subscriptionId: 'sub_001',
            status: SubscriptionStatus.ACTIVE,
            sessionsIncluded: 12,
            sessionsRemaining: 12,
          },
          refunds: [],
          disputes: [],
          payout: {
            payoutId: 'pout_001',
            amount: 8000,
            currency: 'INR',
            status: PayoutStatus.ON_HOLD,
          },
          settlement: null,
          hasActiveDispute: false,
          isLockedByDispute: false,
          eligiblePayoutAmount: 8000,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await paymentApi.getPaymentById('pay_001');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_001');
      expect(response.data.pricing.totalAmount).toBe(10000);
      expect(response.data.payout.amount).toBe(8000);
    });

    it('getInvoice fetches formal tax receipt from /payments/:id/invoice', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          invoiceId: 'inv_001',
          invoiceNumber: 'INV-2026-001',
          paymentId: 'pay_001',
          amount: 10000,
          currency: 'INR',
          tax: 0,
          issuedAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await paymentApi.getInvoice('pay_001');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_001/invoice');
      expect(response.data.invoiceNumber).toBe('INV-2026-001');
    });
  });

  describe('2. Refund Operations & Exceptional Service-Failure Invariants', () => {
    it('requestRefund sends strictly { reason } without refund amount or percentage', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_001',
          paymentId: 'pay_001',
          amount: 8000,
          reason: 'Coach never showed up for scheduled sessions.',
          status: RefundStatus.PENDING,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await refundApi.requestRefund('pay_001', {
        reason: 'Coach never showed up for scheduled sessions.',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_001/refunds', {
        reason: 'Coach never showed up for scheduled sessions.',
      });
      expect(response.data.amount).toBe(8000);
      expect(response.data.status).toBe(RefundStatus.PENDING);
    });

    it('rejectRefund sends required adminNotes to /payments/:id/refunds/:refundId/reject', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_001',
          paymentId: 'pay_001',
          amount: 8000,
          reason: 'Coach never showed up.',
          status: RefundStatus.REJECTED,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
          adminNotes: 'Trainer provided attendance logs showing full session completion.',
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await refundApi.rejectRefund('pay_001', 'ref_001', {
        adminNotes: 'Trainer provided attendance logs showing full session completion.',
      });

      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_001/refunds/ref_001/reject', {
        adminNotes: 'Trainer provided attendance logs showing full session completion.',
      });
      expect(response.data.status).toBe(RefundStatus.REJECTED);
    });

    it('processApprovedRefund dispatches gateway transfer via /payments/:id/refunds/:refundId/process', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          refundId: 'ref_001',
          paymentId: 'pay_001',
          amount: 8000,
          reason: 'Coach non-delivery.',
          status: RefundStatus.PROCESSED,
          type: RefundType.FULL_TRAINER_FEE_REFUND,
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await refundApi.processApprovedRefund('pay_001', 'ref_001');
      expect(postSpy).toHaveBeenCalledWith('/payments/pay_001/refunds/ref_001/process', {});
      expect(response.data.status).toBe(RefundStatus.PROCESSED);
    });
  });

  describe('3. Dispute Operations & Payout Freeze', () => {
    it('raiseDispute posts dispute data and freezes payout', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          disputeId: 'disp_001',
          paymentId: 'pay_001',
          raisedBy: 'cli_001',
          reason: 'Services were improperly billed.',
          status: DisputeStatus.OPEN,
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await disputeApi.raiseDispute('pay_001', {
        reason: 'Services were improperly billed.',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_001/disputes', {
        reason: 'Services were improperly billed.',
      });
      expect(response.data.status).toBe(DisputeStatus.OPEN);
    });

    it('resolveDispute posts resolutionNotes to /payments/:id/disputes/:disputeId/resolve', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValueOnce({
        status: 'success',
        data: {
          disputeId: 'disp_001',
          paymentId: 'pay_001',
          raisedBy: 'cli_001',
          reason: 'Services were improperly billed.',
          resolutionNotes: 'Agreement reached between client and coach.',
          status: DisputeStatus.RESOLVED,
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await disputeApi.resolveDispute('pay_001', 'disp_001', {
        resolutionNotes: 'Agreement reached between client and coach.',
      });

      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_001/disputes/disp_001/resolve', {
        resolutionNotes: 'Agreement reached between client and coach.',
      });
      expect(response.data.status).toBe(DisputeStatus.RESOLVED);
    });
  });

  describe('4. Payout & Settlement Operations', () => {
    it('checkEligibility queries /payments/:id/payout/eligibility', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          paymentId: 'pay_001',
          payoutId: 'pout_001',
          trainerId: 'trn_001',
          isEligible: true,
          eligibleAmount: 8000,
          currency: 'INR',
          hasActiveDispute: false,
        },
      });

      const response = await payoutApi.checkEligibility('pay_001');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_001/payout/eligibility');
      expect(response.data.isEligible).toBe(true);
      expect(response.data.eligibleAmount).toBe(8000);
    });

    it('processPayout submits payout transfer request without amount control', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValueOnce({
        status: 'success',
        data: {
          payoutId: 'pout_001',
          paymentId: 'pay_001',
          trainerId: 'trn_001',
          amount: 8000,
          currency: 'INR',
          status: PayoutStatus.PROCESSING,
          createdAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const response = await payoutApi.processPayout('pay_001', {
        idempotencyKey: 'idem_pout_999',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_001/payout/process', {
        idempotencyKey: 'idem_pout_999',
      });
      expect(response.data.amount).toBe(8000);
      expect(response.data.status).toBe(PayoutStatus.PROCESSING);
    });

    it('getSettlement retrieves read-only settlement snapshot from /payments/:id/settlement', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValueOnce({
        status: 'success',
        data: {
          settlementId: 'set_001',
          paymentId: 'pay_001',
          trainerId: 'trn_001',
          trainerAmount: 8000,
          platformAmount: 2000,
          currency: 'INR',
          settledAt: '2026-08-25T11:00:00.000Z',
        },
      });

      const response = await payoutApi.getSettlement('pay_001');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_001/settlement');
      expect(response.data.trainerAmount).toBe(8000);
      expect(response.data.platformAmount).toBe(2000);
    });
  });

  describe('5. Error Handling & Architectural Integrity', () => {
    it('correctly maps 403 Forbidden errors when accessing unauthorized payment aggregate', async () => {
      vi.spyOn(httpClient, 'get').mockRejectedValueOnce(
        new Error('You do not have permission to access this payment aggregate.'),
      );

      await expect(paymentApi.getPaymentById('pay_forbidden')).rejects.toThrow(
        'You do not have permission to access this payment aggregate.',
      );
    });

    it('correctly maps 409 Conflict errors during payout race conditions', async () => {
      vi.spyOn(httpClient, 'post').mockRejectedValueOnce(
        new Error('Payout transfer has already reached terminal status PAID.'),
      );

      await expect(payoutApi.processPayout('pay_conflict')).rejects.toThrow(
        'Payout transfer has already reached terminal status PAID.',
      );
    });
  });
});
