import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { paymentApi } from '../../infrastructure/api/paymentApi';
import { refundApi } from '../../infrastructure/api/refundApi';
import { disputeApi } from '../../infrastructure/api/disputeApi';
import { payoutApi } from '../../infrastructure/api/payoutApi';
import { PaymentMapper } from '../../infrastructure/mappers/paymentMapper';
import { RazorpayCheckoutAdapter } from '../../infrastructure/providers/razorpayCheckout';
import {
  PaymentStatus,
  TransactionType,
  SubscriptionStatus,
} from '../../domain/types/payment.types';
import { RefundStatus, RefundType } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { PayoutStatus } from '../../domain/types/payout.types';

describe('Payment Frontend Infrastructure Layer (Phase 12.2)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. paymentApi HTTP Contract Tests', () => {
    it('initiatePayment sends ONLY offerId to POST /payments', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: {
          paymentId: 'pay_123',
          providerOrderId: 'order_rzp_123',
          amount: 10000,
          currency: 'INR',
          keyId: 'rzp_test_key',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
        },
      });

      const res = await paymentApi.initiatePayment({ offerId: 'offer_accepted_001' });

      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(postSpy).toHaveBeenCalledWith('/payments', {
        offerId: 'offer_accepted_001',
      });
      expect(res.data.paymentId).toBe('pay_123');
    });

    it('verifyPayment sends cryptographic signature payload to POST /payments/:id/verify', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: {
          status: 'SUCCESS',
          paymentId: 'pay_123',
          providerPaymentId: 'pay_rzp_999',
        },
      });

      const res = await paymentApi.verifyPayment('pay_123', {
        providerPaymentId: 'pay_rzp_999',
        providerOrderId: 'order_rzp_123',
        signature: 'sig_crypto_valid',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_123/verify', {
        providerPaymentId: 'pay_rzp_999',
        providerOrderId: 'order_rzp_123',
        providerSignature: 'sig_crypto_valid',
      });
      expect(res.data.status).toBe('SUCCESS');
    });

    it('getPaymentById sends GET /payments/:id', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 'ok',
        data: { paymentId: 'pay_123' },
      });

      await paymentApi.getPaymentById('pay_123');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_123');
    });

    it('listPayments sends GET /payments with query params', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 'ok',
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });

      await paymentApi.listPayments({ status: PaymentStatus.SUCCESS, page: 2, limit: 20 });
      expect(getSpy).toHaveBeenCalledWith('/payments', {
        params: { status: PaymentStatus.SUCCESS, page: 2, limit: 20 },
      });
    });

    it('getInvoice sends GET /payments/:id/invoice', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 'ok',
        data: { invoiceNumber: 'INV-2026-001' },
      });

      await paymentApi.getInvoice('pay_123');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_123/invoice');
    });
  });

  describe('2. refundApi HTTP Contract Tests', () => {
    it('requestRefund sends ONLY reason to POST /payments/:id/refunds', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: { refundId: 'ref_123' },
      });

      await refundApi.requestRefund('pay_123', {
        reason: 'Trainer abandoned coaching service',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_123/refunds', {
        reason: 'Trainer abandoned coaching service',
      });
    });

    it('reviewRefund sends PATCH /payments/:id/refunds/:refundId/review', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
        status: 'ok',
        data: { refundId: 'ref_123', status: RefundStatus.UNDER_REVIEW },
      });

      await refundApi.reviewRefund('pay_123', 'ref_123', { adminNotes: 'Checking proof' });
      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_123/refunds/ref_123/review', {
        adminNotes: 'Checking proof',
      });
    });

    it('approveRefund sends PATCH /payments/:id/refunds/:refundId/approve', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
        status: 'ok',
        data: { refundId: 'ref_123', status: RefundStatus.APPROVED },
      });

      await refundApi.approveRefund('pay_123', 'ref_123', {
        adminNotes: 'Approved full trainer fee',
      });
      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_123/refunds/ref_123/approve', {
        adminNotes: 'Approved full trainer fee',
      });
    });

    it('rejectRefund sends PATCH /payments/:id/refunds/:refundId/reject with required notes', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
        status: 'ok',
        data: { refundId: 'ref_123', status: RefundStatus.REJECTED },
      });

      await refundApi.rejectRefund('pay_123', 'ref_123', { adminNotes: 'Sessions were completed' });
      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_123/refunds/ref_123/reject', {
        adminNotes: 'Sessions were completed',
      });
    });

    it('processApprovedRefund sends POST /payments/:id/refunds/:refundId/process', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: { refundId: 'ref_123', status: RefundStatus.PROCESSED },
      });

      await refundApi.processApprovedRefund('pay_123', 'ref_123');
      expect(postSpy).toHaveBeenCalledWith('/payments/pay_123/refunds/ref_123/process', {});
    });
  });

  describe('3. disputeApi HTTP Contract Tests', () => {
    it('raiseDispute sends POST /payments/:id/disputes', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: { disputeId: 'disp_123' },
      });

      await disputeApi.raiseDispute('pay_123', {
        reason: 'Service quality dispute',
        evidence: 'Screenshots attached',
      });

      expect(postSpy).toHaveBeenCalledWith('/payments/pay_123/disputes', {
        reason: 'Service quality dispute',
        evidence: 'Screenshots attached',
      });
    });

    it('resolveDispute sends PATCH /payments/:id/disputes/:disputeId/resolve with notes', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
        status: 'ok',
        data: { disputeId: 'disp_123', status: DisputeStatus.RESOLVED },
      });

      await disputeApi.resolveDispute('pay_123', 'disp_123', {
        resolutionNotes: 'Agreement reached with parties',
      });

      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_123/disputes/disp_123/resolve', {
        resolutionNotes: 'Agreement reached with parties',
      });
    });

    it('closeDispute sends PATCH /payments/:id/disputes/:disputeId/close', async () => {
      const patchSpy = vi.spyOn(httpClient, 'patch').mockResolvedValue({
        status: 'ok',
        data: { disputeId: 'disp_123', status: DisputeStatus.CLOSED },
      });

      await disputeApi.closeDispute('pay_123', 'disp_123');
      expect(patchSpy).toHaveBeenCalledWith('/payments/pay_123/disputes/disp_123/close', {});
    });
  });

  describe('4. payoutApi HTTP Contract Tests', () => {
    it('checkEligibility sends GET /payments/:id/payout/eligibility', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 'ok',
        data: { isEligible: true, eligibleAmount: 8000 },
      });

      const res = await payoutApi.checkEligibility('pay_123');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_123/payout/eligibility');
      expect(res.data.isEligible).toBe(true);
    });

    it('processPayout sends POST /payments/:id/payout/process with optional idempotencyKey', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        status: 'ok',
        data: { payoutId: 'pout_123', status: PayoutStatus.PROCESSING },
      });

      await payoutApi.processPayout('pay_123', { idempotencyKey: 'idemp_key_1' });
      expect(postSpy).toHaveBeenCalledWith('/payments/pay_123/payout/process', {
        idempotencyKey: 'idemp_key_1',
      });
    });

    it('getSettlement sends GET /payments/:id/settlement', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        status: 'ok',
        data: {
          settlementId: 'stl_123',
          trainerAmount: 8000,
          platformAmount: 2000,
          currency: 'INR',
          settledAt: '2026-08-25T10:00:00.000Z',
        },
      });

      const res = await payoutApi.getSettlement('pay_123');
      expect(getSpy).toHaveBeenCalledWith('/payments/pay_123/settlement');
      expect(res.data.trainerAmount).toBe(8000);
    });
  });

  describe('5. PaymentMapper Domain Normalization Tests', () => {
    it('correctly maps raw backend PaymentDetailsResponseDTO into clean PaymentDetails domain model', () => {
      const rawDto = {
        paymentId: 'pay_123',
        offerId: 'off_123',
        clientId: 'cli_123',
        trainerId: 'trn_123',
        pricing: {
          trainerFee: 8000,
          platformFee: 2000,
          totalAmount: 10000,
          currency: 'INR',
          commissionRate: 0.2,
        },
        status: PaymentStatus.SUCCESS,
        providerOrderId: 'order_rzp_123',
        providerPaymentId: 'pay_rzp_123',
        transactions: [
          {
            transactionId: 'tx_1',
            providerTransactionId: 'pay_rzp_123',
            type: TransactionType.PAYMENT,
            amount: 10000,
            currency: 'INR',
            createdAt: '2026-08-25T10:00:00.000Z',
          },
        ],
        subscription: {
          subscriptionId: 'sub_1',
          status: SubscriptionStatus.ACTIVE,
          sessionsIncluded: 12,
          sessionsRemaining: 12,
        },
        refunds: [
          {
            refundId: 'ref_1',
            amount: 8000,
            currency: 'INR',
            type: RefundType.FULL_TRAINER_FEE_REFUND,
            status: RefundStatus.APPROVED,
            reason: 'Trainer service non-delivery',
            requestedBy: 'cli_123',
            requestedAt: '2026-08-25T11:00:00.000Z',
          },
        ],
        disputes: [
          {
            disputeId: 'disp_1',
            status: DisputeStatus.OPEN,
            reason: 'Inquiry',
            raisedBy: 'cli_123',
            createdAt: '2026-08-25T11:30:00.000Z',
            updatedAt: '2026-08-25T11:30:00.000Z',
          },
        ],
        payout: {
          payoutId: 'pout_1',
          amount: 8000,
          currency: 'INR',
          status: PayoutStatus.ON_HOLD,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T11:30:00.000Z',
        },
        settlement: null,
        hasActiveDispute: true,
        isLockedByDispute: true,
        eligiblePayoutAmount: 0,
        createdAt: '2026-08-25T10:00:00.000Z',
        updatedAt: '2026-08-25T11:30:00.000Z',
      };

      const domain = PaymentMapper.toPaymentDetailsDomain(rawDto);

      expect(domain.paymentId).toBe('pay_123');
      expect(domain.pricing.totalAmount).toBe(10000);
      expect(domain.pricing.trainerFee).toBe(8000);
      expect(domain.hasActiveDispute).toBe(true);
      expect(domain.refunds[0].type).toBe(RefundType.FULL_TRAINER_FEE_REFUND);
      expect(domain.disputes[0].status).toBe(DisputeStatus.OPEN);
      expect(domain.payout.status).toBe(PayoutStatus.ON_HOLD);
    });
  });

  describe('6. RazorpayCheckoutAdapter Security & Script Loader Tests', () => {
    let mockScripts: any[] = [];

    beforeEach(() => {
      mockScripts = [];
      (globalThis as any).window = {
        Razorpay: undefined,
      };
      (globalThis as any).document = {
        querySelector: vi.fn().mockImplementation((selector: string) => {
          return (
            mockScripts.find((s) => s.src === 'https://checkout.razorpay.com/v1/checkout.js') ||
            null
          );
        }),
        querySelectorAll: vi.fn().mockImplementation((selector: string) => {
          return mockScripts.filter(
            (s) => s.src === 'https://checkout.razorpay.com/v1/checkout.js',
          );
        }),
        createElement: vi.fn().mockImplementation((tag: string) => {
          const scriptEl: any = {
            src: '',
            async: false,
            onload: null,
            onerror: null,
            addEventListener: vi.fn((event: string, cb: () => void) => {
              if (event === 'load') scriptEl.onload = cb;
            }),
            remove: vi.fn(() => {
              const idx = mockScripts.indexOf(scriptEl);
              if (idx > -1) mockScripts.splice(idx, 1);
            }),
          };
          return scriptEl;
        }),
        body: {
          appendChild: vi.fn().mockImplementation((el: any) => {
            mockScripts.push(el);
          }),
        },
      };
    });

    afterEach(() => {
      delete (globalThis as any).window;
      delete (globalThis as any).document;
      (RazorpayCheckoutAdapter as any).scriptLoadingPromise = null;
    });

    it('should inject Razorpay checkout script only once', async () => {
      const loadPromise = RazorpayCheckoutAdapter.loadScript();

      // Trigger onload on created script
      const script = (globalThis as any).document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );
      expect(script).not.toBeNull();

      (globalThis as any).window.Razorpay = vi.fn();
      script.onload?.();

      const loaded = await loadPromise;
      expect(loaded).toBe(true);

      // Second load should resolve immediately without appending another script
      const scriptCountBefore = (globalThis as any).document.querySelectorAll(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      ).length;
      expect(scriptCountBefore).toBe(1);

      const secondLoad = await RazorpayCheckoutAdapter.loadScript();
      expect(secondLoad).toBe(true);
      expect(
        (globalThis as any).document.querySelectorAll(
          'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
        ).length,
      ).toBe(1);
    });

    it('should invoke window.Razorpay constructor with server-provided order credentials and call onSuccess handler', async () => {
      const mockRzpInstance = {
        open: vi.fn(),
        on: vi.fn(),
      };
      const mockRzpConstructor = vi.fn(function (this: any, options: any) {
        // simulate user completing payment in modal
        setTimeout(() => {
          options.handler({
            razorpay_payment_id: 'pay_rzp_mock_123',
            razorpay_order_id: 'order_rzp_mock_123',
            razorpay_signature: 'sig_mock_123',
          });
        }, 10);
        return mockRzpInstance;
      });
      (globalThis as any).window.Razorpay = mockRzpConstructor;

      const onSuccess = vi.fn();
      const onDismiss = vi.fn();

      await RazorpayCheckoutAdapter.openCheckout({
        keyId: 'rzp_test_public_key',
        providerOrderId: 'order_rzp_mock_123',
        amount: 10000,
        currency: 'INR',
        onSuccess,
        onDismiss,
      });

      expect(mockRzpConstructor).toHaveBeenCalledTimes(1);
      expect(mockRzpConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'rzp_test_public_key',
          order_id: 'order_rzp_mock_123',
          amount: 1000000, // in paise
          currency: 'INR',
        }),
      );
      expect(mockRzpInstance.open).toHaveBeenCalledTimes(1);

      // Wait for simulated handler callback
      await new Promise((r) => setTimeout(r, 20));
      expect(onSuccess).toHaveBeenCalledWith({
        providerPaymentId: 'pay_rzp_mock_123',
        providerOrderId: 'order_rzp_mock_123',
        signature: 'sig_mock_123',
      });
    });
  });
});
