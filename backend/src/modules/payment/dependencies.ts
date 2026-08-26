import { AwilixContainer, asClass, asFunction } from 'awilix';

// Infrastructure Repositories & Services
import { MongoPaymentRepository } from './infrastructure/persistence/mongoose/repositories/mongo-payment.repository';
import { MongoWebhookIdempotencyService } from './infrastructure/services/mongo-webhook-idempotency.service';
import { RazorpayAdapter } from './infrastructure/gateways/razorpay/razorpay.adapter';
import { RazorpayWebhookVerifier } from './infrastructure/gateways/razorpay/razorpay-webhook.verifier';

// Application Use Cases
import { InitiatePaymentUseCase } from './application/use-cases/initiate-payment.use-case';
import { GetPaymentUseCase } from './application/use-cases/get-payment.use-case';
import { ListPaymentsUseCase } from './application/use-cases/list-payments.use-case';
import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.use-case';
import { GetInvoiceUseCase } from './application/use-cases/get-invoice.use-case';
import { ProcessRazorpayWebhookUseCase } from './application/use-cases/process-razorpay-webhook.use-case';
import { RequestRefundUseCase } from './application/use-cases/request-refund.use-case';
import { GetRefundUseCase } from './application/use-cases/get-refund.use-case';
import { ListRefundsUseCase } from './application/use-cases/list-refunds.use-case';
import { ReviewRefundUseCase } from './application/use-cases/review-refund.use-case';
import { ApproveRefundUseCase } from './application/use-cases/approve-refund.use-case';
import { RejectRefundUseCase } from './application/use-cases/reject-refund.use-case';
import { ProcessApprovedRefundUseCase } from './application/use-cases/process-approved-refund.use-case';

// Dispute Use Cases
import { RaiseDisputeUseCase } from './application/use-cases/raise-dispute.use-case';
import { GetDisputeUseCase } from './application/use-cases/get-dispute.use-case';
import { ListDisputesUseCase } from './application/use-cases/list-disputes.use-case';
import { InvestigateDisputeUseCase } from './application/use-cases/investigate-dispute.use-case';
import { ResolveDisputeUseCase } from './application/use-cases/resolve-dispute.use-case';
import { CloseDisputeUseCase } from './application/use-cases/close-dispute.use-case';

// Payout & Settlement Use Cases
import { CheckPayoutEligibilityUseCase } from './application/use-cases/check-payout-eligibility.use-case';
import { GetPayoutUseCase } from './application/use-cases/get-payout.use-case';
import { ListPayoutsUseCase } from './application/use-cases/list-payouts.use-case';
import { ProcessPayoutUseCase } from './application/use-cases/process-payout.use-case';
import { RetryPayoutUseCase } from './application/use-cases/retry-payout.use-case';
import { GetSettlementUseCase } from './application/use-cases/get-settlement.use-case';

// Presentation Controller
import { PaymentController } from './presentation/controllers/payment.controller';
import { RazorpayWebhookController } from './presentation/controllers/razorpay-webhook.controller';
import { RefundController } from './presentation/controllers/refund.controller';
import { DisputeController } from './presentation/controllers/dispute.controller';
import { PayoutController } from './presentation/controllers/payout.controller';

export const registerPaymentDependencies = (container: AwilixContainer): void => {
  // Infrastructure (Scoped)
  container.register({
    paymentRepo: asClass(MongoPaymentRepository).scoped(),
    idempotencyService: asClass(MongoWebhookIdempotencyService).scoped(),
    paymentGateway: asFunction(() => new RazorpayAdapter()).scoped(),
    gatewayPort: asFunction((c: any) => c.paymentGateway).scoped(),
    verifier: asFunction(() => new RazorpayWebhookVerifier()).scoped(),
  });

  // Application Use Cases (Scoped)
  container.register({
    initiatePaymentUseCase: asClass(InitiatePaymentUseCase).scoped(),
    getPaymentUseCase: asClass(GetPaymentUseCase).scoped(),
    listPaymentsUseCase: asClass(ListPaymentsUseCase).scoped(),
    verifyPaymentUseCase: asClass(VerifyPaymentUseCase).scoped(),
    getInvoiceUseCase: asClass(GetInvoiceUseCase).scoped(),
    processWebhookUseCase: asClass(ProcessRazorpayWebhookUseCase).scoped(),
    processRazorpayWebhookUseCase: asClass(ProcessRazorpayWebhookUseCase).scoped(),
    requestRefundUseCase: asClass(RequestRefundUseCase).scoped(),
    getRefundUseCase: asClass(GetRefundUseCase).scoped(),
    listRefundsUseCase: asClass(ListRefundsUseCase).scoped(),
    reviewRefundUseCase: asClass(ReviewRefundUseCase).scoped(),
    approveRefundUseCase: asClass(ApproveRefundUseCase).scoped(),
    rejectRefundUseCase: asClass(RejectRefundUseCase).scoped(),
    processApprovedRefundUseCase: asClass(ProcessApprovedRefundUseCase).scoped(),
    raiseDisputeUseCase: asClass(RaiseDisputeUseCase).scoped(),
    getDisputeUseCase: asClass(GetDisputeUseCase).scoped(),
    listDisputesUseCase: asClass(ListDisputesUseCase).scoped(),
    investigateDisputeUseCase: asClass(InvestigateDisputeUseCase).scoped(),
    resolveDisputeUseCase: asClass(ResolveDisputeUseCase).scoped(),
    closeDisputeUseCase: asClass(CloseDisputeUseCase).scoped(),
    checkPayoutEligibilityUseCase: asClass(CheckPayoutEligibilityUseCase).scoped(),
    getPayoutUseCase: asClass(GetPayoutUseCase).scoped(),
    listPayoutsUseCase: asClass(ListPayoutsUseCase).scoped(),
    processPayoutUseCase: asClass(ProcessPayoutUseCase).scoped(),
    retryPayoutUseCase: asClass(RetryPayoutUseCase).scoped(),
    getSettlementUseCase: asClass(GetSettlementUseCase).scoped(),
  });

  // Presentation Controller (Scoped)
  container.register({
    paymentController: asClass(PaymentController).scoped(),
    razorpayWebhookController: asClass(RazorpayWebhookController).scoped(),
    refundController: asClass(RefundController).scoped(),
    disputeController: asClass(DisputeController).scoped(),
    payoutController: asClass(PayoutController).scoped(),
  });
};
