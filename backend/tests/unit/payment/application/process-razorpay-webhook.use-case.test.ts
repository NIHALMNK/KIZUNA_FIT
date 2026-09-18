import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import { ProcessRazorpayWebhookUseCase } from '../../../../src/modules/payment/application/use-cases/process-razorpay-webhook.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { IWebhookIdempotencyPort } from '../../../../src/modules/payment/application/ports/webhook-idempotency.port';
import { RazorpayWebhookVerifier } from '../../../../src/modules/payment/infrastructure/gateways/razorpay/razorpay-webhook.verifier';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';
import { PayoutStatus } from '../../../../src/modules/payment/domain/enums/payout-status.enum';
import { TransactionType } from '../../../../src/modules/payment/domain/enums/transaction-type.enum';

describe('ProcessRazorpayWebhookUseCase Comprehensive Tests', () => {
  let paymentRepo: IPaymentRepository;
  let idempotencyService: IWebhookIdempotencyPort;
  let verifier: RazorpayWebhookVerifier;
  let useCase: ProcessRazorpayWebhookUseCase;

  const webhookSecret = 'test_webhook_secret_key_123';

  beforeEach(() => {
    paymentRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByOfferId: vi.fn(),
      findByProviderOrderId: vi.fn(),
      findByProviderPaymentId: vi.fn(),
      listByClientId: vi.fn(),
      listByTrainerId: vi.fn(),
      listAll: vi.fn(),
      existsForOffer: vi.fn(),
    };

    idempotencyService = {
      acquire: vi.fn().mockResolvedValue(true),
      release: vi.fn().mockResolvedValue(undefined),
    };

    verifier = new RazorpayWebhookVerifier({
      keyId: 'dummy_key',
      keySecret: 'dummy_secret',
      webhookSecret,
    });

    useCase = new ProcessRazorpayWebhookUseCase(paymentRepo, idempotencyService, verifier);
  });

  const createProcessingPayment = (amount = 10000, currency = 'INR') => {
    const pricing = PaymentPricing.create({
      trainerFee: amount * 0.8,
      platformFee: amount * 0.2,
      totalAmount: amount,
      currency,
    }).getValue()!;

    const payment = Payment.create(
      {
        offerId: 'off_hook_1',
        acquisitionPipelineId: 'pipe_hook_1',
        clientId: 'client_hook_1',
        trainerId: 'trainer_hook_1',
        pricing,
      },
      'pay_hook_1',
    ).getValue()!;

    payment.startProcessing('order_rzp_order_999');
    payment.clearEvents();
    return payment;
  };

  const createSignedPayload = (payloadObj: Record<string, unknown>) => {
    const rawBody = Buffer.from(JSON.stringify(payloadObj));
    const signature = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    return { rawBody, signature, payload: payloadObj };
  };

  describe('1. Signature Verification & Security', () => {
    it('should reject webhook with invalid signature without mutating payment', async () => {
      const payload = { event: 'payment.captured', id: 'evt_1' };
      const rawBody = Buffer.from(JSON.stringify(payload));
      const invalidSignature = 'bad_forged_signature_hex';

      const result = await useCase.execute({
        rawBody,
        signature: invalidSignature,
        payload,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('signature');
      expect(idempotencyService.acquire).not.toHaveBeenCalled();
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('should reject if payload was modified after signature creation', async () => {
      const originalPayload = { event: 'payment.captured', amount: 1000000 };
      const { signature } = createSignedPayload(originalPayload);

      const tamperedPayload = { event: 'payment.captured', amount: 500000 };
      const tamperedRawBody = Buffer.from(JSON.stringify(tamperedPayload));

      const result = await useCase.execute({
        rawBody: tamperedRawBody,
        signature,
        payload: tamperedPayload,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('signature');
      expect(idempotencyService.acquire).not.toHaveBeenCalled();
    });
  });

  describe('2. Supported Event Filtering', () => {
    it('should safely ignore unsupported events (e.g. refund.processed) without state changes', async () => {
      const { rawBody, signature, payload } = createSignedPayload({
        event: 'virtual_account.credited',
        id: 'evt_unsupported_001',
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('ignored');
      expect(result.getValue().reason).toContain('unsupported_event');
      expect(idempotencyService.acquire).not.toHaveBeenCalled();
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('3. Concurrency-Safe Idempotency Handling', () => {
    it('should ignore duplicate webhook delivery if eventId was already processed', async () => {
      vi.mocked(idempotencyService.acquire).mockResolvedValue(false); // Collision

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.captured',
        id: 'evt_duplicate_001',
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('ignored');
      expect(result.getValue().reason).toBe('already_processed');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('4. payment.captured Lifecycle & Financial Integrity', () => {
    it('should transition Payment to SUCCESS, create discrete PAYMENT transaction, and persist aggregate', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.captured',
        id: 'evt_captured_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_rzp_captured_111',
              order_id: 'order_rzp_order_999',
              amount: 1000000, // 10,000 INR in paise
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('success');
      expect(result.getValue().paymentId).toBe(payment.paymentId);

      // Verify aggregate mutations
      expect(payment.status).toBe(PaymentStatus.SUCCESS);
      expect(payment.providerPaymentId).toBe('pay_rzp_captured_111');
      expect(payment.transactions.length).toBe(1);
      expect(payment.transactions[0].type).toBe(TransactionType.PAYMENT);
      expect(payment.transactions[0].amount).toBe(10000);

      // Verify repository save called with aggregate
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should reject payment.captured if amount does not match financial snapshot', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.captured',
        id: 'evt_amount_mismatch',
        payload: {
          payment: {
            entity: {
              id: 'pay_rzp_bad_amount',
              order_id: 'order_rzp_order_999',
              amount: 500000, // 5,000 INR instead of 10,000 INR
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Amount mismatch');
      expect(payment.status).toBe(PaymentStatus.PROCESSING); // untouched
      expect(idempotencyService.release).toHaveBeenCalledWith('evt_amount_mismatch');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('should reject payment.captured if currency does not match financial snapshot', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.captured',
        id: 'evt_curr_mismatch',
        payload: {
          payment: {
            entity: {
              id: 'pay_rzp_bad_curr',
              order_id: 'order_rzp_order_999',
              amount: 1000000,
              currency: 'USD', // USD instead of INR
              status: 'captured',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Currency mismatch');
      expect(payment.status).toBe(PaymentStatus.PROCESSING);
      expect(idempotencyService.release).toHaveBeenCalledWith('evt_curr_mismatch');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('should release idempotency lock and fail if matching Payment is not found', async () => {
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(null);
      vi.mocked(paymentRepo.findByProviderPaymentId).mockResolvedValue(null);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.captured',
        id: 'evt_orphan_payment',
        payload: {
          payment: {
            entity: {
              id: 'pay_orphan_123',
              order_id: 'order_orphan_456',
              amount: 1000000,
              currency: 'INR',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('was not found');
      expect(idempotencyService.release).toHaveBeenCalledWith('evt_orphan_payment');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('5. payment.failed Lifecycle', () => {
    it('should transition Payment to FAILED and persist', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.failed',
        id: 'evt_failed_001',
        payload: {
          payment: {
            entity: {
              id: 'pay_failed_123',
              order_id: 'order_rzp_order_999',
              amount: 1000000,
              currency: 'INR',
              error_description: 'Card declined by issuing bank',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should NOT transition an already completed SUCCESS payment to FAILED', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      payment.markSuccess('pay_success_prior');
      vi.mocked(paymentRepo.findByProviderOrderId).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'payment.failed',
        id: 'evt_late_failed',
        payload: {
          payment: {
            entity: {
              id: 'pay_late_fail',
              order_id: 'order_rzp_order_999',
              amount: 1000000,
              currency: 'INR',
              error_description: 'Late decline notification',
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('ignored');
      expect(result.getValue().reason).toBe('cannot_fail_completed_payment');
      expect(payment.status).toBe(PaymentStatus.SUCCESS); // Preserved SUCCESS
    });
  });

  describe('5. Razorpay Route Transfer Webhook Processing', () => {
    it('should transition Payout to PAID upon transfer.processed event', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      payment.markSuccess('pay_success_1');
      payment.subscription.activate(new Date(), new Date(), 'rel_wh_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.payout.startProcessing();

      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'transfer.processed',
        id: 'evt_trf_proc_001',
        payload: {
          transfer: {
            entity: {
              id: 'trf_rzp_999',
              amount: 800000,
              currency: 'INR',
              notes: {
                paymentId: payment.paymentId,
              },
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('success');
      expect(payment.payout.status).toBe(PayoutStatus.PAID);
      expect(payment.settlement).toBeDefined();
    });

    it('should transition Payout to FAILED upon transfer.failed event', async () => {
      const payment = createProcessingPayment(10000, 'INR');
      payment.markSuccess('pay_success_1');
      payment.subscription.activate(new Date(), new Date(), 'rel_wh_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.payout.startProcessing();

      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const { rawBody, signature, payload } = createSignedPayload({
        event: 'transfer.failed',
        id: 'evt_trf_failed_001',
        payload: {
          transfer: {
            entity: {
              id: 'trf_rzp_fail_888',
              amount: 800000,
              currency: 'INR',
              error_description: 'Trainer bank account closed',
              notes: {
                paymentId: payment.paymentId,
              },
            },
          },
        },
      });

      const result = await useCase.execute({ rawBody, signature, payload });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe('success');
      expect(payment.payout.status).toBe(PayoutStatus.FAILED);
      expect(payment.payout.failureReason).toContain('Trainer bank account closed');
      expect(payment.settlement).toBeNull();
    });
  });
});
