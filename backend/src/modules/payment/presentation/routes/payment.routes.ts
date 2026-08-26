import { Router, Request, Response } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { RazorpayWebhookController } from '../controllers/razorpay-webhook.controller';
import { RefundController } from '../controllers/refund.controller';
import { DisputeController } from '../controllers/dispute.controller';
import { PayoutController } from '../controllers/payout.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';

export const paymentRouter = (): Router => {
  const router = Router();

  const resolvePaymentController = (req: Request): PaymentController =>
    req.scope.resolve<PaymentController>('paymentController');

  const resolveWebhookController = (req: Request): RazorpayWebhookController =>
    req.scope.resolve<RazorpayWebhookController>('razorpayWebhookController');

  const resolveRefundController = (req: Request): RefundController =>
    req.scope.resolve<RefundController>('refundController');

  const resolveDisputeController = (req: Request): DisputeController =>
    req.scope.resolve<DisputeController>('disputeController');

  const resolvePayoutController = (req: Request): PayoutController =>
    req.scope.resolve<PayoutController>('payoutController');

  // ==========================================
  // 1. COLLECTION & WEBHOOK ROUTES (STATIC)
  // ==========================================

  // Webhook Route (HMAC Signature Verified inside Use Case)
  router.post(
    '/webhook/razorpay',
    asyncHandler((req: Request, res: Response) => resolveWebhookController(req).handle(req, res)),
  );

  // Initiate Payment (Client Only)
  router.post(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePaymentController(req).initiatePayment(req, res),
    ),
  );

  // List Payments (Client sees own, Trainer sees own, Admin sees all)
  router.get(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePaymentController(req).listPayments(req, res),
    ),
  );

  // List Refunds (Client sees own, Trainer sees related, Admin sees all)
  router.get(
    '/refunds',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).listRefunds(req, res),
    ),
  );

  // List Disputes (Admin Only across all payments)
  router.get(
    '/disputes',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).listDisputes(req, res),
    ),
  );

  // List Payouts (Trainers see own, Admins see all)
  router.get(
    '/payouts',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePayoutController(req).listPayouts(req, res),
    ),
  );

  // ==========================================
  // 2. PARAMETERIZED ROUTES (/:id/...)
  // ==========================================

  // Verify Payment (Client Only)
  router.post(
    '/:id/verify',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePaymentController(req).verifyPayment(req, res),
    ),
  );

  // Get Invoice by Payment ID
  router.get(
    '/:id/invoice',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePaymentController(req).getInvoice(req, res),
    ),
  );

  // Check Payout Eligibility (3-day window, dispute freeze, refund state)
  router.get(
    '/:id/payout/eligibility',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePayoutController(req).checkEligibility(req, res),
    ),
  );

  // Get Payout Details
  router.get(
    '/:id/payout',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolvePayoutController(req).getPayout(req, res)),
  );

  // Process Payout (Admin Only)
  router.post(
    '/:id/payout/process',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolvePayoutController(req).processPayout(req, res),
    ),
  );

  // Retry Failed Payout (Admin Only)
  router.post(
    '/:id/payout/retry',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolvePayoutController(req).retryPayout(req, res),
    ),
  );

  // Get Settlement Snapshot (After PAID)
  router.get(
    '/:id/settlement',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePayoutController(req).getSettlement(req, res),
    ),
  );

  // Request Refund (Client or Admin)
  router.post(
    '/:id/refunds',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).requestRefund(req, res),
    ),
  );

  // Get Specific Refund
  router.get(
    '/:id/refunds/:refundId',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveRefundController(req).getRefund(req, res)),
  );

  // Review Refund (Admin Only)
  router.patch(
    '/:id/refunds/:refundId/review',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).reviewRefund(req, res),
    ),
  );

  // Approve Refund (Admin Only)
  router.patch(
    '/:id/refunds/:refundId/approve',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).approveRefund(req, res),
    ),
  );

  // Reject Refund (Admin Only)
  router.patch(
    '/:id/refunds/:refundId/reject',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).rejectRefund(req, res),
    ),
  );

  // Process Approved Refund (Admin Only)
  router.post(
    '/:id/refunds/:refundId/process',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveRefundController(req).processApprovedRefund(req, res),
    ),
  );

  // Raise Dispute (Client or Admin)
  router.post(
    '/:id/disputes',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).raiseDispute(req, res),
    ),
  );

  // Get Dispute Details
  router.get(
    '/:id/disputes/:disputeId',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).getDispute(req, res),
    ),
  );

  // Put Dispute Under Investigation (Admin Only)
  router.patch(
    '/:id/disputes/:disputeId/investigate',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).investigateDispute(req, res),
    ),
  );

  // Resolve Dispute (Admin Only)
  router.patch(
    '/:id/disputes/:disputeId/resolve',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).resolveDispute(req, res),
    ),
  );

  // Close Dispute (Admin Only)
  router.patch(
    '/:id/disputes/:disputeId/close',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveDisputeController(req).closeDispute(req, res),
    ),
  );

  // Get Payment by ID (Mounted after specific sub-routes)
  router.get(
    '/:id',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolvePaymentController(req).getPayment(req, res),
    ),
  );

  return router;
};
