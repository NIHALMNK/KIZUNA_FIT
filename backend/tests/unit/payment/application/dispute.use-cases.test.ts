import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RaiseDisputeUseCase } from '../../../../src/modules/payment/application/use-cases/raise-dispute.use-case';
import { InvestigateDisputeUseCase } from '../../../../src/modules/payment/application/use-cases/investigate-dispute.use-case';
import { ResolveDisputeUseCase } from '../../../../src/modules/payment/application/use-cases/resolve-dispute.use-case';
import { CloseDisputeUseCase } from '../../../../src/modules/payment/application/use-cases/close-dispute.use-case';
import { GetDisputeUseCase } from '../../../../src/modules/payment/application/use-cases/get-dispute.use-case';
import { ListDisputesUseCase } from '../../../../src/modules/payment/application/use-cases/list-disputes.use-case';
import { RequestRefundUseCase } from '../../../../src/modules/payment/application/use-cases/request-refund.use-case';
import { ApproveRefundUseCase } from '../../../../src/modules/payment/application/use-cases/approve-refund.use-case';
import { ProcessApprovedRefundUseCase } from '../../../../src/modules/payment/application/use-cases/process-approved-refund.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../../../../src/modules/payment/application/ports/payment-gateway.port';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { DisputeStatus } from '../../../../src/modules/payment/domain/enums/dispute-status.enum';
import { PayoutStatus } from '../../../../src/modules/payment/domain/enums/payout-status.enum';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';

describe('Phase 8: Dispute / Chargeback & Freeze Handling Comprehensive Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let gatewayPort: IPaymentGatewayPort;

  let raiseDisputeUseCase: RaiseDisputeUseCase;
  let investigateDisputeUseCase: InvestigateDisputeUseCase;
  let resolveDisputeUseCase: ResolveDisputeUseCase;
  let closeDisputeUseCase: CloseDisputeUseCase;
  let getDisputeUseCase: GetDisputeUseCase;
  let listDisputesUseCase: ListDisputesUseCase;

  // Cross-domain freeze verification use cases
  let requestRefundUseCase: RequestRefundUseCase;
  let approveRefundUseCase: ApproveRefundUseCase;
  let processApprovedRefundUseCase: ProcessApprovedRefundUseCase;

  const createSuccessfulPayment = (amount: number = 10000): Payment => {
    const pricing = PaymentPricing.create({
      trainerFee: amount * 0.8,
      platformFee: amount * 0.2,
      totalAmount: amount,
      currency: 'INR',
    }).getValue()!;

    const payment = Payment.create({
      offerId: 'offer_disp_1',
      acquisitionPipelineId: 'pipeline_disp_1',
      clientId: 'client_disp_1',
      trainerId: 'trainer_disp_1',
      pricing,
    }).getValue()!;

    payment.startProcessing('order_disp_rzp_1');
    payment.markSuccess('pay_disp_rzp_1');
    return payment;
  };

  beforeEach(() => {
    paymentRepo = {
      findById: vi.fn(),
      findByProviderOrderId: vi.fn(),
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
      processRefund: vi.fn().mockResolvedValue('rfnd_disp_rzp_1'),
    };

    raiseDisputeUseCase = new RaiseDisputeUseCase(paymentRepo);
    investigateDisputeUseCase = new InvestigateDisputeUseCase(paymentRepo);
    resolveDisputeUseCase = new ResolveDisputeUseCase(paymentRepo);
    closeDisputeUseCase = new CloseDisputeUseCase(paymentRepo);
    getDisputeUseCase = new GetDisputeUseCase(paymentRepo);
    listDisputesUseCase = new ListDisputesUseCase(paymentRepo);

    requestRefundUseCase = new RequestRefundUseCase(paymentRepo);
    approveRefundUseCase = new ApproveRefundUseCase(paymentRepo);
    processApprovedRefundUseCase = new ProcessApprovedRefundUseCase(paymentRepo, gatewayPort);
  });

  describe('1. Raising Disputes & State Transitions', () => {
    it('should allow Client to raise a dispute on their own successful payment', async () => {
      const payment = createSuccessfulPayment();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Trainer never showed up for scheduled sessions',
        evidence: 'https://storage.kizunafit.com/evidence1.png',
        raisedBy: 'client_disp_1',
        requesterRole: 'CLIENT',
      });

      expect(result.isSuccess).toBe(true);
      const disputeDto = result.getValue();
      expect(disputeDto.status).toBe(DisputeStatus.OPEN);
      expect(disputeDto.reason).toBe('Trainer never showed up for scheduled sessions');
      expect(disputeDto.raisedBy).toBe('client_disp_1');
      expect(payment.hasActiveDispute()).toBe(true);
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
      expect(paymentRepo.save).toHaveBeenCalledWith(payment);
    });

    it('should allow Admin to raise a dispute on any payment', async () => {
      const payment = createSuccessfulPayment();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Provider chargeback notification received from bank',
        raisedBy: 'admin_1',
        requesterRole: 'ADMIN',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(DisputeStatus.OPEN);
      expect(payment.hasActiveDispute()).toBe(true);
    });

    it('should allow Trainer to raise a dispute on their own coaching payment', async () => {
      const payment = createSuccessfulPayment();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Client abusive behavior and breach of terms',
        raisedBy: 'trainer_disp_1',
        requesterRole: 'TRAINER',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(DisputeStatus.OPEN);
      expect(result.getValue().raisedBy).toBe('trainer_disp_1');
      expect(payment.hasActiveDispute()).toBe(true);
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
    });

    it('should reject Trainer attempting to raise a dispute on another trainers payment', async () => {
      const payment = createSuccessfulPayment();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Unauthorized dispute attempt',
        raisedBy: 'trainer_intruder',
        requesterRole: 'TRAINER',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Forbidden');
      expect(payment.disputes.length).toBe(0);
    });

    it('should reject raising a dispute if Payout has already been PAID', async () => {
      const payment = createSuccessfulPayment();
      payment.subscription.activate(new Date(), new Date(), 'rel_disp_1');
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000));
      payment.payout.startProcessing();
      payment.payout.markPaid('pout_123');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Client post-payout complaint',
        raisedBy: 'client_disp_1',
        requesterRole: 'CLIENT',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('already been released');
    });

    it('should reject Client attempting to raise dispute on someone elses payment', async () => {
      const payment = createSuccessfulPayment();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Unauthorized payment attempt',
        raisedBy: 'client_intruder',
        requesterRole: 'CLIENT',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Forbidden');
      expect(payment.disputes.length).toBe(0);
    });

    it('should reject raising a dispute on a FAILED payment', async () => {
      const pricing = PaymentPricing.create({
        trainerFee: 8000,
        platformFee: 2000,
        totalAmount: 10000,
        currency: 'INR',
      }).getValue()!;
      const payment = Payment.create({
        offerId: 'offer_1',
        acquisitionPipelineId: 'pipe_1',
        clientId: 'client_disp_1',
        trainerId: 'trainer_1',
        pricing,
      }).getValue()!;
      payment.startProcessing('ord_1');
      payment.markFailed('Payment authentication failed');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await raiseDisputeUseCase.execute({
        paymentId: payment.paymentId,
        reason: 'Failed payment issue',
        raisedBy: 'client_disp_1',
        requesterRole: 'CLIENT',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Cannot raise dispute on payment in state');
    });
  });

  describe('2. Dispute Lifecycle: OPEN -> UNDER_INVESTIGATION -> RESOLVED -> CLOSED', () => {
    it('should transition dispute from OPEN to UNDER_INVESTIGATION by Admin', async () => {
      const payment = createSuccessfulPayment();
      const dispute = payment.raiseDispute('Service dispute', 'client_disp_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await investigateDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: dispute.disputeId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(DisputeStatus.UNDER_INVESTIGATION);
      expect(payment.hasActiveDispute()).toBe(true); // Still active!
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
    });

    it('should transition dispute from UNDER_INVESTIGATION to RESOLVED and release payout hold', async () => {
      const payment = createSuccessfulPayment();
      const dispute = payment.raiseDispute('Service dispute', 'client_disp_1');
      dispute.investigate();
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await resolveDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: dispute.disputeId,
        adminId: 'admin_1',
        resolutionNotes: 'Trainer provided makeup session; client satisfied.',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(DisputeStatus.RESOLVED);
      expect(result.getValue().resolutionNotes).toContain('makeup session');
      expect(payment.hasActiveDispute()).toBe(false); // Unfrozen!
      expect(payment.payout.status).toBe(PayoutStatus.PENDING); // Hold released!
    });

    it('should transition dispute from RESOLVED to CLOSED by Admin', async () => {
      const payment = createSuccessfulPayment();
      const dispute = payment.raiseDispute('Service dispute', 'client_disp_1');
      dispute.resolve('Resolved notes');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await closeDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: dispute.disputeId,
        adminId: 'admin_1',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().status).toBe(DisputeStatus.CLOSED);
      expect(payment.hasActiveDispute()).toBe(false);
    });

    it('should reject closing an unresolved dispute (must be RESOLVED before CLOSED)', async () => {
      const payment = createSuccessfulPayment();
      const dispute = payment.raiseDispute('Open dispute', 'client_disp_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await closeDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: dispute.disputeId,
        adminId: 'admin_1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Dispute must be RESOLVED before closing');
      expect(dispute.status).toBe(DisputeStatus.OPEN);
    });
  });

  describe('3. Active Dispute Freeze Enforcement (The Financial Invariant)', () => {
    it('CRITICAL: should strictly BLOCK refund requests when dispute is OPEN', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.raiseDispute('Chargeback initiated', 'admin_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await requestRefundUseCase.execute({
        paymentId: payment.paymentId,
        requesterId: 'client_disp_1',
        requesterRole: 'CLIENT',
        reason: 'I want a refund instead',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('active dispute');
      expect(payment.refunds.length).toBe(0);
    });

    it('CRITICAL: should strictly BLOCK refund approval when dispute is raised after request', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Original refund request');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      // Dispute raised while refund was pending
      payment.raiseDispute('Chargeback alert from bank', 'admin_1');

      const result = await approveRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('active dispute');
      expect(refund.status).toBe('PENDING'); // Not approved!
    });

    it('CRITICAL: should strictly BLOCK gateway refund processing when dispute is UNDER_INVESTIGATION', async () => {
      const payment = createSuccessfulPayment(10000);
      const refund = payment.requestRefund('Original refund request');
      refund.approve('admin_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      // Dispute raised and placed under investigation
      const dispute = payment.raiseDispute('Dispute investigation', 'admin_1');
      dispute.investigate();

      const result = await processApprovedRefundUseCase.execute({
        paymentId: payment.paymentId,
        refundId: refund.refundId,
        adminId: 'admin_1',
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('active dispute');
      expect(gatewayPort.processRefund).not.toHaveBeenCalled();
      expect(payment.status).toBe(PaymentStatus.SUCCESS); // Still SUCCESS, no refund executed
    });

    it('CRITICAL: should strictly BLOCK payout release when dispute is active', async () => {
      const payment = createSuccessfulPayment(10000);
      payment.subscription.activate(new Date(), new Date(), 'rel_disp_1');
      payment.raiseDispute('Active dispute blocks payout', 'client_disp_1');

      // Attempt to complete subscription
      payment.completeSubscription(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)); // 4 days ago

      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);
      expect(payment.hasActiveDispute()).toBe(true);
    });

    it('should maintain payout hold if multiple disputes exist and only one is resolved', async () => {
      const payment = createSuccessfulPayment(10000);
      const d1 = payment.raiseDispute('Dispute 1', 'client_disp_1');
      const d2 = payment.raiseDispute('Dispute 2', 'admin_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);

      // Resolve dispute 1
      await resolveDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: d1.disputeId,
        adminId: 'admin_1',
        resolutionNotes: 'Resolved d1',
      });

      // Still frozen because d2 is active!
      expect(payment.hasActiveDispute()).toBe(true);
      expect(payment.payout.status).toBe(PayoutStatus.ON_HOLD);

      // Resolve dispute 2
      await resolveDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: d2.disputeId,
        adminId: 'admin_1',
        resolutionNotes: 'Resolved d2',
      });

      // Now all disputes resolved -> hold released!
      expect(payment.hasActiveDispute()).toBe(false);
      expect(payment.payout.status).toBe(PayoutStatus.PENDING);
    });
  });

  describe('4. Dispute Query & Retrieval', () => {
    it('should allow Client to get specific dispute details for own payment', async () => {
      const payment = createSuccessfulPayment();
      const dispute = payment.raiseDispute('Session mismatch', 'client_disp_1');
      vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

      const result = await getDisputeUseCase.execute({
        paymentId: payment.paymentId,
        disputeId: dispute.disputeId,
        requesterId: 'client_disp_1',
        requesterRole: 'CLIENT',
      });

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().disputeId).toBe(dispute.disputeId);
      expect(result.getValue().reason).toBe('Session mismatch');
    });

    it('should allow Admin to list all disputes across payments', async () => {
      const payment1 = createSuccessfulPayment();
      payment1.raiseDispute('Dispute 1', 'client_1');
      const payment2 = createSuccessfulPayment();
      payment2.raiseDispute('Dispute 2', 'client_2');

      vi.mocked(paymentRepo.listAll).mockResolvedValue([payment1, payment2]);

      const result = await listDisputesUseCase.execute({});

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().length).toBe(2);
    });
  });
});
