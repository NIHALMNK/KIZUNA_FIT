import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';
import { SubscriptionStatus } from '../../../../src/modules/payment/domain/enums/subscription-status.enum';
import { RefundStatus } from '../../../../src/modules/payment/domain/enums/refund-status.enum';
import { RefundType } from '../../../../src/modules/payment/domain/enums/refund-type.enum';
import { PayoutStatus } from '../../../../src/modules/payment/domain/enums/payout-status.enum';
import { TransactionType } from '../../../../src/modules/payment/domain/enums/transaction-type.enum';
import { MongoPaymentRepository } from '../../../../src/modules/payment/infrastructure/persistence/mongoose/repositories/mongo-payment.repository';
import { PaymentModel } from '../../../../src/modules/payment/infrastructure/persistence/mongoose/schemas/payment.schema';
import { ProcessedWebhookEventModel } from '../../../../src/modules/payment/infrastructure/persistence/mongoose/schemas/processed-webhook-event.schema';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';

describe('MongoPaymentRepository Persistence Tests', () => {
  let mongoServer: MongoMemoryReplSet;
  let mockDispatcher: DomainEventDispatcher;
  let repo: MongoPaymentRepository;

  beforeAll(async () => {
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
    await PaymentModel.createCollection();
    await ProcessedWebhookEventModel.createCollection();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState !== 0) {
      await PaymentModel.deleteMany({});
      await ProcessedWebhookEventModel.deleteMany({});
    }

    mockDispatcher = {
      dispatchAll: vi.fn().mockResolvedValue(undefined),
    } as unknown as DomainEventDispatcher;

    repo = new MongoPaymentRepository(mockDispatcher);
  });

  const createTestPricing = () => {
    return PaymentPricing.create({
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
    }).getValue()!;
  };

  const createTestPayment = (
    offerId = 'off_repo_001',
    clientId = 'client_100',
    trainerId = 'trainer_200',
  ) => {
    return Payment.create({
      offerId,
      acquisitionPipelineId: 'pipe_repo_100',
      clientId,
      trainerId,
      pricing: createTestPricing(),
    }).getValue()!;
  };

  describe('Save and Hydration', () => {
    it('should save a new Payment aggregate and hydrate correctly via findById', async () => {
      const payment = createTestPayment('off_save_1');
      await repo.save(payment);

      const found = await repo.findById(payment.paymentId);
      expect(found).not.toBeNull();
      expect(found!.paymentId).toBe(payment.paymentId);
      expect(found!.offerId).toBe('off_save_1');
      expect(found!.clientId).toBe('client_100');
      expect(found!.trainerId).toBe('trainer_200');
      expect(found!.status).toBe(PaymentStatus.CREATED);

      // Verify Value Objects & Sub-documents
      expect(found!.pricing.trainerFee).toBe(8000);
      expect(found!.pricing.platformFee).toBe(2000);
      expect(found!.pricing.totalAmount).toBe(10000);
      expect(found!.pricing.currency).toBe('INR');

      expect(found!.subscription.status).toBe(SubscriptionStatus.PENDING);
      expect(found!.payout.amount).toBe(8000);
      expect(found!.payout.status).toBe(PayoutStatus.PENDING);
      expect(found!.invoice.invoiceNumber).toBeDefined();
      expect(found!.invoice.totalAmount).toBe(10000);

      // Verify event dispatch and cleanup
      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
      expect(payment.domainEvents.length).toBe(0);
    });

    it('should persist complete lifecycle: transactions, exceptional refunds, disputes, and versioning', async () => {
      const payment = createTestPayment('off_full_cycle');
      payment.startProcessing('order_rzp_full');
      payment.markSuccess('pay_rzp_full');
      payment.subscription.activate(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), new Date());

      const dispute = payment.raiseDispute('Minor dispute', 'client_100');
      payment.resolveDispute(dispute.disputeId, 'Resolved mutually');

      const refund = payment.requestRefund('Service failure after dispute');
      refund.putUnderReview('admin_007');
      refund.approve('admin_007');
      payment.processApprovedRefund(refund.refundId, 'rfnd_rzp_full');

      await repo.save(payment);

      const found = await repo.findById(payment.paymentId);
      expect(found).not.toBeNull();
      expect(found!.status).toBe(PaymentStatus.REFUNDED);
      expect(found!.providerOrderId).toBe('order_rzp_full');
      expect(found!.providerPaymentId).toBe('pay_rzp_full');

      // Transactions
      expect(found!.transactions.length).toBe(2); // PAYMENT, REFUND
      expect(found!.transactions.map((t) => t.type)).toEqual([
        TransactionType.PAYMENT,
        TransactionType.REFUND,
      ]);

      // Refund
      expect(found!.refunds.length).toBe(1);
      expect(found!.refunds[0].status).toBe(RefundStatus.PROCESSED);
      expect(found!.refunds[0].amount).toBe(8000); // trainerFee
      expect(found!.refunds[0].type).toBe(RefundType.FULL_TRAINER_FEE_REFUND);

      // Dispute
      expect(found!.disputes.length).toBe(1);
      expect(found!.disputes[0].status).toBe('RESOLVED');

      // Payout & Subscription zeroed/refunded
      expect(found!.payout.amount).toBe(0);
      expect(found!.subscription.status).toBe(SubscriptionStatus.REFUNDED);
    });
  });

  describe('Uniqueness and Query Operations', () => {
    it('should enforce unique offerId constraint', async () => {
      const payment1 = createTestPayment('off_dup_check');
      await repo.save(payment1);

      const payment2 = createTestPayment('off_dup_check');
      await expect(repo.save(payment2)).rejects.toThrow(/already exists for offer/);
    });

    it('should find by providerOrderId and providerPaymentId', async () => {
      const payment = createTestPayment('off_prov_queries');
      payment.startProcessing('order_find_111');
      payment.markSuccess('pay_find_222');
      await repo.save(payment);

      const byOrder = await repo.findByProviderOrderId('order_find_111');
      expect(byOrder).not.toBeNull();
      expect(byOrder!.paymentId).toBe(payment.paymentId);

      const byPay = await repo.findByProviderPaymentId('pay_find_222');
      expect(byPay).not.toBeNull();
      expect(byPay!.paymentId).toBe(payment.paymentId);
    });

    it('should list payments by clientId and trainerId with pagination', async () => {
      const p1 = createTestPayment('off_list_1', 'client_A', 'trainer_X');
      const p2 = createTestPayment('off_list_2', 'client_A', 'trainer_Y');
      const p3 = createTestPayment('off_list_3', 'client_B', 'trainer_X');

      await repo.save(p1);
      await repo.save(p2);
      await repo.save(p3);

      const clientList = await repo.listByClientId('client_A');
      expect(clientList.length).toBe(2);

      const trainerList = await repo.listByTrainerId('trainer_X');
      expect(trainerList.length).toBe(2);

      const allList = await repo.listAll(2, 0);
      expect(allList.length).toBe(2);
    });

    it('should correctly check existsForOffer', async () => {
      const payment = createTestPayment('off_exists_check');
      await repo.save(payment);

      expect(await repo.existsForOffer('off_exists_check')).toBe(true);
      expect(await repo.existsForOffer('off_non_existent')).toBe(false);
    });
  });

  describe('ProcessedWebhookEvent Idempotency Persistence', () => {
    it('should persist processed webhook events to prevent duplicates', async () => {
      const eventDoc = await ProcessedWebhookEventModel.create({
        _id: 'evt_rzp_webhook_123',
        provider: 'RAZORPAY',
        eventType: 'payment.captured',
        processedAt: new Date(),
      });

      expect(eventDoc._id).toBe('evt_rzp_webhook_123');

      // Duplicate attempt should reject with duplicate key error
      await expect(
        ProcessedWebhookEventModel.create({
          _id: 'evt_rzp_webhook_123',
          provider: 'RAZORPAY',
          eventType: 'payment.captured',
          processedAt: new Date(),
        }),
      ).rejects.toThrow();
    });

    it('should throw ConcurrencyConflictException when saving a stale aggregate version', async () => {
      const payment = createTestPayment('off_occ_test');
      await repo.save(payment); // version: 0 -> 1

      // Load two copies of the same aggregate
      const copy1 = await repo.findById(payment.paymentId);
      const copy2 = await repo.findById(payment.paymentId);

      expect(copy1).not.toBeNull();
      expect(copy2).not.toBeNull();

      // Copy 1 modifies and saves successfully
      copy1!.startProcessing('order_occ_1');
      await repo.save(copy1!); // version: 1 -> 2

      // Copy 2 attempts to save with stale version (version: 1)
      copy2!.startProcessing('order_occ_2');
      await expect(repo.save(copy2!)).rejects.toThrow(/Concurrency conflict/);
    });
  });
});
