import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RequestRefundUseCase } from '../../../../src/modules/payment/application/use-cases/request-refund.use-case';
import { ReviewRefundUseCase } from '../../../../src/modules/payment/application/use-cases/review-refund.use-case';
import { ApproveRefundUseCase } from '../../../../src/modules/payment/application/use-cases/approve-refund.use-case';
import { RejectRefundUseCase } from '../../../../src/modules/payment/application/use-cases/reject-refund.use-case';
import { ProcessApprovedRefundUseCase } from '../../../../src/modules/payment/application/use-cases/process-approved-refund.use-case';
import { GetRefundUseCase } from '../../../../src/modules/payment/application/use-cases/get-refund.use-case';
import { ListRefundsUseCase } from '../../../../src/modules/payment/application/use-cases/list-refunds.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../../../../src/modules/payment/application/ports/payment-gateway.port';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';
import { RefundStatus } from '../../../../src/modules/payment/domain/enums/refund-status.enum';
import { RefundType } from '../../../../src/modules/payment/domain/enums/refund-type.enum';
import { TransactionType } from '../../../../src/modules/payment/domain/enums/transaction-type.enum';

describe('Phase 10.1: Exceptional Service-Failure Refund Use Cases Tests', () => {
  let paymentRepo: IPaymentRepository;
  let gatewayPort: IPaymentGatewayPort;

  let requestRefundUseCase: RequestRefundUseCase;
  let reviewRefundUseCase: ReviewRefundUseCase;
  let approveRefundUseCase: ApproveRefundUseCase;
  let rejectRefundUseCase: RejectRefundUseCase;
  let processApprovedRefundUseCase: ProcessApprovedRefundUseCase;
  let getRefundUseCase: GetRefundUseCase;
  let listRefundsUseCase: ListRefundsUseCase;

  const createSuccessfulPayment = (amount = 10000, currency = 'INR') => {
    const pricing = PaymentPricing.create({
      trainerFee: amount * 0.8, // 8,000
      platformFee: amount * 0.2, // 2,000
      totalAmount: amount,
      currency,
    }).getValue()!;

    const payment = Payment.create(
      {
        offerId: 'off_ref_1',
        acquisitionPipelineId: 'pipe_ref_1',
        clientId: 'client_ref_1',
        trainerId: 'trainer_ref_1',
        pricing,
      },
      'pay_ref_1',
    ).getValue()!;

    payment.startProcessing('order_rzp_ref_999');
    payment.markSuccess('pay_rzp_ref_888');
    payment.subscription.activate(new Date(), new Date(), 'rel_1');
    payment.clearEvents();
    return payment;
  };

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

    gatewayPort = {
      createOrder: vi.fn(),
      verifyPayment: vi.fn(),
      fetchPayment: vi.fn(),
      processRefund: vi.fn().mockResolvedValue({
        gatewayRefundId: 'rfnd_rzp_test_123',
        amount: 8000,
        status: 'processed',
      }),
      processPayout: vi.fn(),
    };

    requestRefundUseCase = new RequestRefundUseCase(paymentRepo);
    reviewRefundUseCase = new ReviewRefundUseCase(paymentRepo);
    approveRefundUseCase = new ApproveRefundUseCase(paymentRepo);
    rejectRefundUseCase = new RejectRefundUseCase(paymentRepo);
    processApprovedRefundUseCase = new ProcessApprovedRefundUseCase(paymentRepo, gatewayPort);
    getRefundUseCase = new GetRefundUseCase(paymentRepo);
    listRefundsUseCase = new ListRefundsUseCase(paymentRepo);
  });

  describe('1. Request Exceptional Service-Failure Refund', () => {
    it('should derive refund amount strictly from trainerFee (platformFee non-refundable)', async () => {
      const payment = createSuccessfulPayment(10000); // trainer: 8000, platform: 2000
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Trainer stopped communication after first week',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.PENDING);
      expect(result.getValue().amount).toBe(8000); // Derived trainerFee
      expect(result.getValue().type).toBe(RefundType.FULL_TRAINER_FEE_REFUND);
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should reject unauthorized refund request if client does not own the payment', async () => {
      const payment = createSuccessfulPayment(10000);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'wrong_client_999',
        requesterRole: 'CLIENT',
        reason: 'Unauthorized attempt',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Forbidden');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('should reject Trainer attempting to request a refund', async () => {
      const payment = createSuccessfulPayment(10000);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'trainer_ref_1',
        requesterRole: 'TRAINER',
        reason: 'Trainer attempt',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Trainers are not authorized');
      expect(paymentRepo.save).not.toHaveBeenCalled();
    });

    it('should fail if Payment is not found', async () => {
      vi.mocked(paymentRepo.findById).mockResolvedValue(null);

      const result = await requestRefundUseCase.execute({
        paymentId: 'non_existent_pay',
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Payment missing',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('was not found');
    });

    it('should fail if Payment is not in a refundable status (e.g. FAILED)', async () => {
      const pricing = PaymentPricing.create({
        trainerFee: 8000,
        platformFee: 2000,
        totalAmount: 10000,
        currency: 'INR',
      }).getValue()!;
      const payment = Payment.create(
        {
          offerId: 'off_1',
          acquisitionPipelineId: 'pipe_1',
          clientId: 'client_ref_1',
          trainerId: 'trainer_1',
          pricing,
        },
        'pay_failed_1',
      ).getValue()!;
      payment.startProcessing('order_1');
      payment.markFailed('Declined by bank');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Refund failed payment',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('not eligible for refund');
    });

    it('should reject refund request when payout has already been released (PAID)', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.startProcessingPayout();
      payment.recordSuccessfulPayout('pout_123');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Late post-payout refund request',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('already been released');
    });

    it('should block refund request if an active dispute exists', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.raiseDispute('Service not delivered', 'client_ref_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Disputed payment refund',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('active dispute is open');
    });

    it('should handle duplicate refund requests idempotently without creating duplicate entities', async () => {
      const payment = createSuccessfulPayment(10000);
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      // First request
      const res1 = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Trainer vanished',
      });
      expect(res1.isSuccess).toBe(true);
      expect(payment.refunds.length).toBe(1);

      // Duplicate second request
      const res2 = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
        reason: 'Trainer vanished',
      });
      expect(res2.isSuccess).toBe(true);
      expect(res2.getValue().refundId).toBe(res1.getValue().refundId);
      expect(payment.refunds.length).toBe(1); // No duplicate created
    });
  });

  describe('2. Admin Review & Approval Lifecycle', () => {
    it('should allow Admin to place refund UNDER_REVIEW', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Need review');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await reviewRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_usr_1',
        notes: 'Reviewing client claim',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.UNDER_REVIEW);
      expect(result.getValue().adminNotes).toBe('Reviewing client claim');
    });

    it('should allow Admin to APPROVE an exceptional refund', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Approve this');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await approveRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_usr_1',
        notes: 'Approved exceptional refund of trainerFee',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.APPROVED);
      expect(result.getValue().amount).toBe(8000);
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should allow Admin to REJECT a refund request', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('False claim');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await rejectRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_usr_1',
        reason: 'Sessions were fully delivered per attendance logs',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.REJECTED);
      expect(result.getValue().adminNotes).toBe(
        'Sessions were fully delivered per attendance logs',
      );
    });
  });

  describe('3. Gateway Execution & Financial Aggregate Transitions', () => {
    it('should execute Razorpay refund, record REFUND Transaction, and transition Payment to REFUNDED', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Full exceptional refund');
      refund.approve('admin_1', 'Exceptional service failure verified');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await processApprovedRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.PROCESSED);
      expect(result.getValue().gatewayRefundId).toBe('rfnd_rzp_test_123');

      // Verify Gateway called with trainerFee (8,000)
      expect(gatewayPort.processRefund).toHaveBeenCalledWith({
        providerPaymentId: 'pay_rzp_ref_888',
        amount: 8000,
        currency: 'INR',
        reason: 'Full exceptional refund',
        notes: expect.any(Object),
      });

      // Verify Payment Aggregate State
      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(payment.subscription.status).toBe('REFUNDED');
      expect(payment.payout.amount).toBe(0); // Zero trainer payout!
      expect(payment.transactions.length).toBe(2); // 1 PAYMENT + 1 REFUND
      const refundTx = payment.transactions.find((t) => t.type === TransactionType.REFUND);
      expect(refundTx).toBeDefined();
      expect(refundTx?.amount).toBe(8000);
      expect(refundTx?.providerTransactionId).toBe('rfnd_rzp_test_123');

      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should NOT mutate financial state to PROCESSED if Razorpay gateway fails', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Should fail at gateway');
      refund.approve('admin_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      vi.mocked(gatewayPort.processRefund).mockRejectedValue(
        new Error('Razorpay API timeout: Insufficient merchant balance'),
      );

      const result = await processApprovedRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Insufficient merchant balance');
      expect(refund.status).toBe(RefundStatus.APPROVED); // Still APPROVED, not PROCESSED
      expect(payment.status).toBe(PaymentStatus.SUCCESS); // Still SUCCESS, not REFUNDED
      expect(payment.transactions.length).toBe(1); // No REFUND transaction recorded
    });

    it('should be retry-safe when processing an already processed refund', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Already processed test');
      refund.approve('admin_1');
      payment.processApprovedRefund(refund.refundId, 'rfnd_existing_123');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await processApprovedRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(RefundStatus.PROCESSED);
      expect(gatewayPort.processRefund).not.toHaveBeenCalled(); // Skipped redundant gateway call
    });
  });

  describe('4. Query & List Refunds', () => {
    it('should allow Client to get specific refund for own payment', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Get query test');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await getRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        requesterId: 'client_ref_1',
        requesterRole: 'CLIENT',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().refundId).toBe(refund.refundId);
      expect(result.getValue().amount).toBe(8000);
    });

    it('should allow Admin to list all refunds across payments', async () => {
      const payment1 = createSuccessfulPayment(10000);
      payment1.requestRefund('Refund 1');

      const payment2 = createSuccessfulPayment(20000);
      payment2.requestRefund('Refund 2');

      vi.mocked(paymentRepo.listAll).mockResolvedValue([payment1, payment2]);

      const result = await listRefundsUseCase.execute({
        requesterId: 'admin_user',
        requesterRole: 'ADMIN',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().length).toBe(2);
    });
  });
});
