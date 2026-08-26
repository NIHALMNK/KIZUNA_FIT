import { describe, it, expect } from 'vitest';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';
import { SubscriptionStatus } from '../../../../src/modules/payment/domain/enums/subscription-status.enum';
import { RefundStatus } from '../../../../src/modules/payment/domain/enums/refund-status.enum';
import { RefundType } from '../../../../src/modules/payment/domain/enums/refund-type.enum';
import { PayoutStatus } from '../../../../src/modules/payment/domain/enums/payout-status.enum';
import { TransactionType } from '../../../../src/modules/payment/domain/enums/transaction-type.enum';
import {
  InvalidPaymentTransitionException,
  DisputeActiveFreezeException,
  PayoutNotEligibleException,
  RefundNotAllowedException,
} from '../../../../src/modules/payment/domain/exceptions/payment-domain.exceptions';

describe('Payment Aggregate Domain Unit Tests', () => {
  const createTestPricing = () => {
    return PaymentPricing.create({
      trainerFee: 9000,
      platformFee: 1000,
      totalAmount: 10000,
      currency: 'INR',
    }).getValue()!;
  };

  const createTestPayment = () => {
    return Payment.create({
      offerId: 'off_test_123',
      acquisitionPipelineId: 'pipe_test_456',
      clientId: 'usr_client_001',
      trainerId: 'usr_trainer_002',
      pricing: createTestPricing(),
    }).getValue()!;
  };

  describe('Factory and Initial Invariants', () => {
    it('should create a payment in CREATED status with PaymentCreatedEvent', () => {
      const payment = createTestPayment();

      expect(payment.status).toBe(PaymentStatus.CREATED);
      expect(payment.pricing.totalAmount).toBe(10000);
      expect(payment.pricing.trainerFee).toBe(9000);
      expect(payment.pricing.platformFee).toBe(1000);
      expect(payment.subscription.status).toBe(SubscriptionStatus.PENDING);
      expect(payment.payout.amount).toBe(9000);
      expect(payment.payout.status).toBe(PayoutStatus.PENDING);
      expect(payment.invoice.totalAmount).toBe(10000);
      expect(payment.domainEvents.length).toBe(1);
      expect(payment.domainEvents[0].constructor.name).toBe('PaymentCreatedEvent');
    });

    it('should fail creation if mandatory fields are missing', () => {
      const result = Payment.create({
        offerId: '',
        acquisitionPipelineId: 'pipe_123',
        clientId: 'client_1',
        trainerId: 'trainer_1',
        pricing: createTestPricing(),
      });
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('offerId');
    });
  });

  describe('Payment Lifecycle Transitions', () => {
    it('should transition from CREATED to PROCESSING upon order creation', () => {
      const payment = createTestPayment();
      payment.clearEvents();

      payment.startProcessing('order_rzp_test_111');
      expect(payment.status).toBe(PaymentStatus.PROCESSING);
      expect(payment.providerOrderId).toBe('order_rzp_test_111');
      expect(payment.domainEvents[0].constructor.name).toBe('PaymentProcessingEvent');
    });

    it('should transition from PROCESSING to SUCCESS and create PAYMENT transaction', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_rzp_test_111');
      payment.clearEvents();

      payment.markSuccess('pay_rzp_test_999');

      expect(payment.status).toBe(PaymentStatus.SUCCESS);
      expect(payment.providerPaymentId).toBe('pay_rzp_test_999');
      expect(payment.transactions.length).toBe(1);
      expect(payment.transactions[0].type).toBe(TransactionType.PAYMENT);
      expect(payment.transactions[0].amount).toBe(10000);
      expect(payment.domainEvents[0].constructor.name).toBe('PaymentSucceededEvent');
    });

    it('should be idempotent if markSuccess is called multiple times', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_rzp_test_111');
      payment.markSuccess('pay_rzp_test_999');
      payment.clearEvents();

      // Second invocation
      payment.markSuccess('pay_rzp_test_999');
      expect(payment.status).toBe(PaymentStatus.SUCCESS);
      expect(payment.domainEvents.length).toBe(0);
      expect(payment.transactions.length).toBe(1);
    });

    it('should transition to FAILED upon provider failure', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_rzp_test_111');
      payment.clearEvents();

      payment.markFailed('Card expired');
      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(payment.domainEvents[0].constructor.name).toBe('PaymentFailedEvent');
    });

    it('should reject invalid state transitions from FAILED to SUCCESS', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_rzp_test_111');
      payment.markFailed('Insufficient funds');

      expect(() => payment.markSuccess('pay_rzp_invalid')).toThrow(
        InvalidPaymentTransitionException,
      );
    });
  });

  describe('Refund Governance (Admin Reviewed)', () => {
    it('should create an exceptional refund request with amount derived from trainerFee (platformFee non-refundable)', () => {
      const payment = createTestPayment(); // trainerFee: 9000, platformFee: 1000, total: 10000
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');
      payment.clearEvents();

      const refund = payment.requestRefund('Trainer ceased coaching service');
      expect(refund.amount).toBe(9000); // Equals trainerFee
      expect(refund.type).toBe(RefundType.FULL_TRAINER_FEE_REFUND);
      expect(refund.status).toBe(RefundStatus.PENDING);
      expect(payment.refunds.length).toBe(1);
      expect(payment.domainEvents[0].constructor.name).toBe('RefundRequestedEvent');
    });

    it('should reject duplicate refund request if an active refund already exists', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');
      payment.requestRefund('First refund request');

      expect(() => payment.requestRefund('Second refund request')).toThrow(
        RefundNotAllowedException,
      );
    });

    it('should process approved exceptional refund, transition payment to REFUNDED, and adjust payout to 0', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');
      payment.subscription.activate(new Date(), new Date(), 'rel_1');

      const refund = payment.requestRefund('Trainer missed scheduled sessions');
      refund.putUnderReview('admin_1');
      refund.approve('admin_1', 'Approved exceptional service-failure refund');

      payment.clearEvents();
      payment.processApprovedRefund(refund.refundId, 'rfnd_rzp_123');

      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(refund.status).toBe(RefundStatus.PROCESSED);
      expect(payment.subscription.status).toBe(SubscriptionStatus.REFUNDED);
      expect(payment.payout.amount).toBe(0);
      expect(payment.transactions.some((tx) => tx.type === TransactionType.REFUND)).toBe(true);
    });

    it('should reject refund request when payout has already been released (PAID)', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.startProcessingPayout();
      payment.recordSuccessfulPayout('pout_123');

      expect(() => payment.requestRefund('Late refund complaint')).toThrow(
        RefundNotAllowedException,
      );
    });

    it('should freeze refund requests when an active dispute exists', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');
      payment.raiseDispute('Trainer did not show up', 'usr_client_001');

      expect(() => payment.requestRefund('Refund attempt during dispute')).toThrow(
        DisputeActiveFreezeException,
      );
    });
  });

  describe('Dispute Lifecycle & Payout Freezing', () => {
    it('should freeze payout on hold when dispute is raised and release when resolved', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');

      const dispute = payment.raiseDispute('Service quality issue', 'usr_client_001');
      expect(dispute.isActive()).toBe(true);
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);

      payment.resolveDispute(dispute.disputeId, 'Resolved with client agreement');
      expect(dispute.status).toBe('RESOLVED');
      expect(payment.payout.status).toBe(PayoutStatus.PENDING);
    });
  });

  describe('Subscription Completion & 3-Day Escrow Payout Release', () => {
    it('should enforce 3-day review window before payout eligibility', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');

      // Activate subscription then complete today
      payment.subscription.activate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
      const now = new Date();
      payment.completeSubscription(now);
      expect(payment.subscription.status).toBe(SubscriptionStatus.COMPLETED);

      // Payout eligible date should be 3 days in future
      const expectedEligibleDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      expect(payment.payout.eligibleAt?.getTime()).toBe(expectedEligibleDate.getTime());

      // Attempting to release payout immediately should throw PayoutNotEligibleException
      expect(() => payment.processPayout('payout_test_gate')).toThrow(PayoutNotEligibleException);
    });

    it('should successfully release payout and create Settlement after 3-day review window has elapsed', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');

      // Activate subscription then completed 4 days ago
      payment.subscription.activate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      payment.completeSubscription(fourDaysAgo);

      payment.clearEvents();
      payment.processPayout('payout_rzp_987');

      expect(payment.payout.status).toBe(PayoutStatus.PAID);
      expect(payment.transactions.some((tx) => tx.type === TransactionType.PAYOUT)).toBe(true);
      expect(payment.settlement).toBeDefined();
      expect(payment.settlement?.trainerAmount).toBe(9000);
      expect(payment.settlement?.platformAmount).toBe(1000);
      expect(payment.domainEvents[0].constructor.name).toBe('PayoutPaidEvent');
    });

    it('should freeze payout release if there is an active dispute even if 3 days have elapsed', () => {
      const payment = createTestPayment();
      payment.startProcessing('order_1');
      payment.markSuccess('pay_1');

      payment.subscription.activate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());
      const fourDaysAgo = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000);
      payment.completeSubscription(fourDaysAgo);
      payment.raiseDispute('Late dispute raised', 'usr_client_001');

      expect(() => payment.processPayout('payout_rzp_987')).toThrow(DisputeActiveFreezeException);
    });
  });
});
