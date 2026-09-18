import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheckPayoutEligibilityUseCase } from '../../../../src/modules/payment/application/use-cases/check-payout-eligibility.use-case';
import { GetPayoutUseCase } from '../../../../src/modules/payment/application/use-cases/get-payout.use-case';
import { ListPayoutsUseCase } from '../../../../src/modules/payment/application/use-cases/list-payouts.use-case';
import { ProcessPayoutUseCase } from '../../../../src/modules/payment/application/use-cases/process-payout.use-case';
import { RetryPayoutUseCase } from '../../../../src/modules/payment/application/use-cases/retry-payout.use-case';
import { GetSettlementUseCase } from '../../../../src/modules/payment/application/use-cases/get-settlement.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../../../../src/modules/payment/application/ports/payment-gateway.port';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PayoutStatus } from '../../../../src/modules/payment/domain/enums/payout-status.enum';
import { TransactionType } from '../../../../src/modules/payment/domain/enums/transaction-type.enum';

describe('Phase 9: Payout & Settlement Engine Comprehensive Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let gatewayPort: IPaymentGatewayPort;

  let checkEligibilityUseCase: CheckPayoutEligibilityUseCase;
  let getPayoutUseCase: GetPayoutUseCase;
  let listPayoutsUseCase: ListPayoutsUseCase;
  let processPayoutUseCase: ProcessPayoutUseCase;
  let retryPayoutUseCase: RetryPayoutUseCase;
  let getSettlementUseCase: GetSettlementUseCase;

  const createSuccessfulPayment = (amount: number = 10000): Payment => {
    const pricing = PaymentPricing.create({
      trainerFee: amount * 0.8, // 8,000
      platformFee: amount * 0.2, // 2,000
      totalAmount: amount, // 10,000
      currency: 'INR',
    }).getValue()!;

    const payment = Payment.create({
      offerId: 'offer_payout_1',
      acquisitionPipelineId: 'pipe_payout_1',
      clientId: 'client_payout_1',
      trainerId: 'trainer_payout_1',
      pricing,
    }).getValue()!;

    payment.startProcessing('order_rzp_po_1');
    payment.markSuccess('pay_rzp_po_1');
    return payment;
  };

  beforeEach(() => {
    paymentRepo = {
      findById: vi.fn(),
      findByProviderOrderId: vi.fn(),
      findByProviderPaymentId: vi.fn(),
      findByOfferId: vi.fn(),
      listByClientId: vi.fn(),
      listByTrainerId: vi.fn(),
      listAll: vi.fn(),
      existsForOffer: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
    };

    gatewayPort = {
      createOrder: vi.fn(),
      verifyPaymentSignature: vi.fn(),
      fetchPayment: vi.fn(),
      processRefund: vi.fn(),
      processPayout: vi.fn().mockResolvedValue({
        gatewayPayoutId: 'pout_rzp_test_123',
        amount: 8000,
        currency: 'INR',
        status: 'PAID',
      }),
    };

    checkEligibilityUseCase = new CheckPayoutEligibilityUseCase(paymentRepo);
    getPayoutUseCase = new GetPayoutUseCase(paymentRepo);
    listPayoutsUseCase = new ListPayoutsUseCase(paymentRepo);
    processPayoutUseCase = new ProcessPayoutUseCase(paymentRepo, gatewayPort);
    retryPayoutUseCase = new RetryPayoutUseCase(paymentRepo, gatewayPort);
    getSettlementUseCase = new GetSettlementUseCase(paymentRepo);
  });

  describe('1. Payout Invariants & 3-Day Review Window Eligibility', () => {
    it('1. Payout exists after Payment creation with correct trainer fee', () => {
      const payment = createSuccessfulPayment(10000);
      expect(payment.payout).toBeDefined();
      expect(payment.payout.status).toBe(PayoutStatus.PENDING);
      expect(payment.payout.amount).toBe(8000);
      expect(payment.payout.currency).toBe('INR');
      expect(payment.settlement).toBeNull();
    });

    it('2. Blocked if Subscription is not COMPLETED (e.g. PENDING or ACTIVE)', async () => {
      const payment = createSuccessfulPayment(10000);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(false);
      expect(check.getValue().reason).toContain('Subscription is');

      const processRes = await processPayoutUseCase.execute({ paymentId: payment.paymentId });
      expect(processRes.isFailure).toBe(true);
      expect(processRes.error).toContain('Payout is not eligible');
    });

    it('3. Blocked if subscription completion timestamp is missing', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      // Not completed yet -> eligibleAt is null
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(false);
      expect(check.getValue().eligibleAt).toBeNull();
    });

    it('4. Blocked before 3-day review window elapses (e.g. 1 day after completion)', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
      payment.completeSubscription(oneDayAgo);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(false);
      expect(check.getValue().reason).toContain('3-Day Review Window has not expired');
    });

    it('5. Exactly at eligibility boundary (3 days later) -> ELIGIBLE', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      payment.completeSubscription(threeDaysAgo);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(true);
      expect(check.getValue().eligibleAmount).toBe(8000);
    });

    it('6. After 3 days (e.g. 5 days later) -> ELIGIBLE', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
      payment.completeSubscription(fiveDaysAgo);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(true);
      expect(check.getValue().eligibleAmount).toBe(8000);
    });
  });

  describe('2. Active Dispute Freeze & Hold Handling', () => {
    it('7. Active Dispute (OPEN) places payout ON_HOLD and blocks payout processing', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      payment.raiseDispute('Service dispute', 'client_payout_1');
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.getValue().isEligible).toBe(false);
      expect(check.getValue().reason).toContain('active dispute');

      const processRes = await processPayoutUseCase.execute({ paymentId: payment.paymentId });
      expect(processRes.isFailure).toBe(true);
      expect(processRes.error).toContain('ON_HOLD');
      expect(gatewayPort.processPayout).not.toHaveBeenCalled();
    });

    it('8. Multiple active disputes maintain payout ON_HOLD', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      payment.raiseDispute('Dispute 1', 'client_1');
      payment.raiseDispute('Dispute 2', 'admin_1');
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
      expect(payment.hasActiveDispute()).toBe(true);
    });

    it('9. Resolving one dispute while another remains active maintains ON_HOLD', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      const d1 = payment.raiseDispute('Dispute 1', 'client_1');
      payment.raiseDispute('Dispute 2', 'admin_1');

      payment.resolveDispute(d1.disputeId, 'Resolved d1');
      expect(payment.hasActiveDispute()).toBe(true);
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
    });

    it('10. Once all disputes are resolved/closed, payout hold is released and becomes ELIGIBLE', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      const d1 = payment.raiseDispute('Dispute 1', 'client_1');
      payment.resolveDispute(d1.disputeId, 'Resolved d1');

      expect(payment.hasActiveDispute()).toBe(false);
      expect(payment.payout.status).toBe(PayoutStatus.PENDING);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.getValue().isEligible).toBe(true);
    });
  });

  describe('3. Refund Interactions & Financial Amount Authority', () => {
    it('11. Approved exceptional refund zeroes eligible payout amount and cancels payout', async () => {
      const payment = createSuccessfulPayment(10000); // 8,000 trainer fee
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      // Exceptional service-failure refund processed
      const refund = payment.requestRefund('Trainer abandoned client');
      refund.approve('admin_1');
      payment.processApprovedRefund(refund.refundId, 'rfnd_123');

      expect(payment.getEligiblePayoutAmount()).toBe(0);
      expect(payment.payout.amount).toBe(0);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const check = await checkEligibilityUseCase.execute({ paymentId: payment.paymentId });
      expect(check.isSuccess).toBe(true);
      expect(check.getValue().isEligible).toBe(false);
      expect(check.getValue().eligibleAmount).toBe(0);
    });

    it('12. Full exceptional refund blocks processing payout', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));

      const refund = payment.requestRefund('Service failure full refund');
      refund.approve('admin_1');
      payment.processApprovedRefund(refund.refundId, 'rfnd_full');

      expect(payment.getEligiblePayoutAmount()).toBe(0);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await processPayoutUseCase.execute({
        paymentId: payment.paymentId,
        adminId: 'admin_1',
      });
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Payout is not eligible');
    });
  });

  describe('4. Payout Execution, Transactions & Immutable Settlement', () => {
    it('13. Successful provider payout transitions to PAID, creates Transaction, and creates immutable Settlement', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await processPayoutUseCase.execute({
        paymentId: payment.paymentId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(PayoutStatus.PAID);
      expect(result.getValue().gatewayPayoutId).toBe('pout_rzp_test_123');
      expect(payment.payout.status).toBe(PayoutStatus.PAID);

      // Verify PAYOUT Transaction
      const payoutTx = payment.transactions.find((t) => t.type === TransactionType.PAYOUT);
      expect(payoutTx).toBeDefined();
      expect(payoutTx?.amount).toBe(8000);
      expect(payoutTx?.currency).toBe('INR');

      // Verify Settlement Value Object
      expect(payment.settlement).toBeDefined();
      expect(payment.settlement?.trainerAmount).toBe(8000);
      expect(payment.settlement?.platformAmount).toBe(2000);
      expect(payment.settlement?.currency).toBe('INR');
      expect(payment.settlement?.settledAt).toBeDefined();
    });

    it('14. Cannot process an already PAID payout (idempotent return without gateway re-call)', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.processPayout('pout_rzp_test_existing');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await processPayoutUseCase.execute({
        paymentId: payment.paymentId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(PayoutStatus.PAID);
      expect(gatewayPort.processPayout).not.toHaveBeenCalled();
    });

    it('15. Provider gateway failure marks payout FAILED with reason (never fake PAID)', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      vi.mocked(gatewayPort.processPayout).mockRejectedValue(
        new Error('Razorpay provider bank account invalid'),
      );

      const result = await processPayoutUseCase.execute({
        paymentId: payment.paymentId,
        adminId: 'admin_1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Razorpay provider bank account invalid');
      expect(payment.payout.status).toBe(PayoutStatus.FAILED);
      expect(payment.payout.failureReason).toContain('Razorpay provider bank account invalid');
      expect(payment.settlement).toBeNull(); // No settlement on failure!
    });

    it('16. Rejects direct retry of FAILED payout to preserve terminal state machine invariant', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.payout.startProcessing();
      payment.payout.markFailed('Temporary network failure');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const retryRes = await retryPayoutUseCase.execute({
        paymentId: payment.paymentId,
        adminId: 'admin_1',
      });

      expect(retryRes.isFailure).toBe(true);
      expect(retryRes.error).toContain('terminal FAILED status');
      expect(payment.payout.status).toBe(PayoutStatus.FAILED);
      expect(payment.settlement).toBeNull();
    });
  });

  describe('5. Queries, Authorizations & Settlement Retrieval', () => {
    it('17. Settlement cannot be retrieved before payout is PAID', async () => {
      const payment = createSuccessfulPayment(10000);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await getSettlementUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'trainer_payout_1',
        requesterRole: 'TRAINER',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('has not been settled yet');
    });

    it('18. Settlement is retrievable after payout is PAID', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.processPayout('pout_rzp_done');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await getSettlementUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'trainer_payout_1',
        requesterRole: 'TRAINER',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().trainerAmount).toBe(8000);
      expect(result.getValue().platformAmount).toBe(2000);
      expect(result.getValue().currency).toBe('INR');
    });

    it('19. Trainer cannot access another trainers settlement', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.processPayout('pout_rzp_done');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await getSettlementUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'trainer_intruder',
        requesterRole: 'TRAINER',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Forbidden');
    });

    it('20. List payouts filters by trainer and status', async () => {
      const payment1 = createSuccessfulPayment(10000);
      const payment2 = createSuccessfulPayment(10000);
      payment2.payout.startProcessing();
      payment2.payout.markPaid('pout_1');

      vi.mocked(paymentRepo.listByTrainerId).mockResolvedValue([payment1, payment2]);

      const result = await listPayoutsUseCase.execute({
        trainerId: 'trainer_payout_1',
        status: PayoutStatus.PAID,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().length).toBe(1);
      expect(result.getValue()[0].status).toBe(PayoutStatus.PAID);
    });
  });
});
