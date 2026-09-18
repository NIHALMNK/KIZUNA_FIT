import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { RazorpayAdapter } from '../../../../src/modules/payment/infrastructure/gateways/razorpay/razorpay.adapter';
import { RazorpayCurrencyHelper } from '../../../../src/modules/payment/infrastructure/gateways/razorpay/razorpay-currency.helper';
import {
  RazorpayAuthenticationException,
  RazorpayGatewayException,
} from '../../../../src/modules/payment/infrastructure/gateways/razorpay/razorpay.errors';

describe('RazorpayAdapter Infrastructure Unit Tests', () => {
  let mockRazorpayClient: any;
  let adapter: RazorpayAdapter;

  const testConfig = {
    keyId: 'rzp_test_mockKey123',
    keySecret: 'mockSecret456',
    webhookSecret: 'mockWebhook789',
  };

  beforeEach(() => {
    mockRazorpayClient = {
      orders: {
        create: vi.fn(),
      },
      payments: {
        fetch: vi.fn(),
        refund: vi.fn(),
      },
    };

    adapter = new RazorpayAdapter(testConfig, mockRazorpayClient as unknown as Razorpay);
  });

  describe('Initialization and Configuration', () => {
    it('should throw RazorpayAuthenticationException if keys are missing', () => {
      expect(() => new RazorpayAdapter({ keyId: '', keySecret: '', webhookSecret: '' })).toThrow(
        RazorpayAuthenticationException,
      );
    });
  });

  describe('Currency & Minor-Unit Conversion', () => {
    it('should correctly convert 2-decimal currencies (INR, USD, EUR) to minor units', () => {
      expect(RazorpayCurrencyHelper.toMinorUnit(100, 'INR')).toBe(10000);
      expect(RazorpayCurrencyHelper.toMinorUnit(49.99, 'USD')).toBe(4999);
      expect(RazorpayCurrencyHelper.toMajorUnit(10000, 'INR')).toBe(100);
      expect(RazorpayCurrencyHelper.toMajorUnit(4999, 'USD')).toBe(49.99);
    });

    it('should correctly convert 0-decimal currencies (JPY, KRW) without scaling', () => {
      expect(RazorpayCurrencyHelper.toMinorUnit(5000, 'JPY')).toBe(5000);
      expect(RazorpayCurrencyHelper.toMajorUnit(5000, 'JPY')).toBe(5000);
    });

    it('should correctly convert 3-decimal currencies (KWD, BHD) with 1000x scaling', () => {
      expect(RazorpayCurrencyHelper.toMinorUnit(12.5, 'KWD')).toBe(12500);
      expect(RazorpayCurrencyHelper.toMajorUnit(12500, 'KWD')).toBe(12.5);
    });
  });

  describe('Order Creation', () => {
    it('should create a Razorpay Test order with minor-unit amount and metadata', async () => {
      mockRazorpayClient.orders.create.mockResolvedValue({
        id: 'order_rzp_mock_123',
        entity: 'order',
        amount: 1000000,
        currency: 'INR',
        receipt: 'pay_test_001',
        status: 'created',
      });

      const result = await adapter.createOrder({
        paymentId: 'pay_test_001',
        amount: 10000,
        currency: 'INR',
        metadata: {
          offerId: 'off_123',
          clientId: 'client_456',
        },
      });

      expect(result.providerOrderId).toBe('order_rzp_mock_123');
      expect(result.amount).toBe(10000);
      expect(result.currency).toBe('INR');
      expect(result.keyId).toBe('rzp_test_mockKey123');

      expect(mockRazorpayClient.orders.create).toHaveBeenCalledWith({
        amount: 1000000, // 10000 INR = 1,000,000 paise
        currency: 'INR',
        receipt: 'pay_test_001',
        notes: {
          offerId: 'off_123',
          clientId: 'client_456',
        },
      });
    });

    it('should map Razorpay network / API error to RazorpayGatewayException', async () => {
      mockRazorpayClient.orders.create.mockRejectedValue(new Error('Network connection timeout'));

      await expect(
        adapter.createOrder({
          paymentId: 'pay_test_001',
          amount: 5000,
          currency: 'INR',
        }),
      ).rejects.toThrow(RazorpayGatewayException);
    });

    it('should throw if Razorpay returns a malformed response without order ID', async () => {
      mockRazorpayClient.orders.create.mockResolvedValue({});

      await expect(
        adapter.createOrder({
          paymentId: 'pay_test_001',
          amount: 5000,
          currency: 'INR',
        }),
      ).rejects.toThrow(/Malformed response/);
    });
  });

  describe('Server-Side Signature & Payment Verification', () => {
    it('should successfully verify valid HMAC SHA-256 signature and fetched payment', async () => {
      const orderId = 'order_test_123';
      const paymentId = 'pay_test_456';

      // Generate valid signature using test secret
      const validSignature = crypto
        .createHmac('sha256', testConfig.keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      mockRazorpayClient.payments.fetch.mockResolvedValue({
        id: paymentId,
        order_id: orderId,
        amount: 1000000,
        currency: 'INR',
        status: 'captured',
        method: 'card',
      });

      const result = await adapter.verifyPayment({
        paymentId: 'local_pay_001',
        providerOrderId: orderId,
        providerPaymentId: paymentId,
        providerSignature: validSignature,
      });

      expect(result.isValid).toBe(true);
      expect(result.providerPaymentId).toBe(paymentId);
      expect(result.providerOrderId).toBe(orderId);
      expect(result.amount).toBe(10000);
      expect(result.currency).toBe('INR');
      expect(result.status).toBe('captured');
    });

    it('should fail verification if signature is invalid / tampered', async () => {
      const result = await adapter.verifyPayment({
        paymentId: 'local_pay_001',
        providerOrderId: 'order_test_123',
        providerPaymentId: 'pay_test_456',
        providerSignature: 'forged_or_invalid_signature_hash',
      });

      expect(result.isValid).toBe(false);
      expect(result.status).toBe('signature_verification_failed');
      expect(mockRazorpayClient.payments.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Payment Fetching and Refund Processing', () => {
    it('should fetch payment details and convert minor units to major units', async () => {
      mockRazorpayClient.payments.fetch.mockResolvedValue({
        id: 'pay_fetch_123',
        order_id: 'order_fetch_456',
        amount: 500000, // 5000 INR in paise
        currency: 'INR',
        status: 'authorized',
        method: 'upi',
      });

      const details = await adapter.fetchPayment('pay_fetch_123');
      expect(details.providerPaymentId).toBe('pay_fetch_123');
      expect(details.amount).toBe(5000);
      expect(details.currency).toBe('INR');
      expect(details.status).toBe('authorized');
      expect(details.method).toBe('upi');
    });

    it('should process refund on Razorpay and return normalized result', async () => {
      mockRazorpayClient.payments.refund.mockResolvedValue({
        id: 'rfnd_rzp_789',
        amount: 200000, // 2000 INR in paise
        status: 'processed',
      });

      const refundResult = await adapter.processRefund({
        providerPaymentId: 'pay_fetch_123',
        amount: 2000,
        currency: 'INR',
        reason: 'Customer requested refund',
      });

      expect(refundResult.gatewayRefundId).toBe('rfnd_rzp_789');
      expect(refundResult.amount).toBe(2000);
      expect(refundResult.status).toBe('processed');

      expect(mockRazorpayClient.payments.refund).toHaveBeenCalledWith('pay_fetch_123', {
        amount: 200000,
        notes: undefined,
      });
    });

    it('should process payout/transfer and return normalized result', async () => {
      const payoutResult = await adapter.processPayout({
        paymentId: 'pay_123',
        payoutId: 'po_123',
        trainerId: 'trainer_123',
        amount: 8000,
        currency: 'INR',
      });

      expect(payoutResult.gatewayPayoutId).toContain('pout_rzp_test_po_123');
      expect(payoutResult.amount).toBe(8000);
      expect(payoutResult.currency).toBe('INR');
      expect(payoutResult.status).toBe('PAID');
    });
  });
});
