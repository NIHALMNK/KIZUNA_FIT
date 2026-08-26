import { Result } from '../../../../shared/result/Result';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { IWebhookIdempotencyPort } from '../ports/webhook-idempotency.port';
import { RazorpayWebhookVerifier } from '../../infrastructure/gateways/razorpay/razorpay-webhook.verifier';
import { RazorpayWebhookEventMapper } from '../../infrastructure/gateways/razorpay/razorpay-webhook-event.mapper';
import { PaymentStatus } from '../../domain/enums/payment-status.enum';
import {
  WebhookSignatureInvalidException,
  PaymentNotFoundException,
  WebhookPayloadInvalidException,
} from '../exceptions/payment-application.exceptions';

export interface ProcessRazorpayWebhookCommand {
  rawBody: Buffer | string;
  signature: string;
  payload: Record<string, unknown>;
}

export interface ProcessRazorpayWebhookResponse {
  status: 'success' | 'ignored';
  reason?: string;
  eventId?: string;
  paymentId?: string;
}

const SUPPORTED_EVENTS = new Set([
  'payment.captured',
  'payment.failed',
  'transfer.processed',
  'transfer.failed',
]);

export class ProcessRazorpayWebhookUseCase {
  constructor(
    private readonly paymentRepo: IPaymentRepository,
    private readonly idempotencyService: IWebhookIdempotencyPort,
    private readonly verifier: RazorpayWebhookVerifier,
  ) {}

  public async execute(
    command: ProcessRazorpayWebhookCommand,
  ): Promise<Result<ProcessRazorpayWebhookResponse>> {
    // 1. Strict Cryptographic Signature Verification
    const isSignatureValid = this.verifier.verify(command.rawBody, command.signature);
    if (!isSignatureValid) {
      return Result.fail(new WebhookSignatureInvalidException().message);
    }

    // 2. Parse and normalize webhook payload
    const event = RazorpayWebhookEventMapper.map(command.payload);

    // 3. Supported Event Filter
    if (!SUPPORTED_EVENTS.has(event.eventType)) {
      return Result.ok({
        status: 'ignored',
        reason: `unsupported_event: ${event.eventType}`,
        eventId: event.eventId,
      });
    }

    // 4. Concurrency-Safe Database-Backed Idempotency Lock
    const acquired = await this.idempotencyService.acquire(event.eventId, event.eventType);
    if (!acquired) {
      return Result.ok({
        status: 'ignored',
        reason: 'already_processed',
        eventId: event.eventId,
      });
    }

    try {
      // 5. Payment Matching via Trusted Provider References
      let payment = null;

      if (event.providerOrderId) {
        payment = await this.paymentRepo.findByProviderOrderId(event.providerOrderId);
      }

      if (!payment && event.providerPaymentId) {
        payment = await this.paymentRepo.findByProviderPaymentId(event.providerPaymentId);
      }

      if (!payment && event.paymentId) {
        payment = await this.paymentRepo.findById(event.paymentId);
      }

      if (!payment) {
        // Release idempotency lock so subsequent retries can find payment if created with delay
        await this.idempotencyService.release(event.eventId);
        return Result.fail(
          new PaymentNotFoundException(
            event.providerOrderId || event.providerPaymentId || event.paymentId || 'unknown',
          ).message,
        );
      }

      // 6. Handle Specific Events
      if (event.eventType === 'payment.captured') {
        // Security checks: Validate Amount and Currency
        if (
          event.amount !== undefined &&
          Math.abs(payment.pricing.totalAmount - event.amount) > 0.01
        ) {
          await this.idempotencyService.release(event.eventId);
          return Result.fail(
            new WebhookPayloadInvalidException(
              `Amount mismatch: expected ${payment.pricing.totalAmount}, got ${event.amount}`,
            ).message,
          );
        }

        if (
          event.currency &&
          payment.pricing.currency.toUpperCase() !== event.currency.toUpperCase()
        ) {
          await this.idempotencyService.release(event.eventId);
          return Result.fail(
            new WebhookPayloadInvalidException(
              `Currency mismatch: expected ${payment.pricing.currency}, got ${event.currency}`,
            ).message,
          );
        }

        // Idempotency: If already SUCCESS, return gracefully
        if (payment.status === PaymentStatus.SUCCESS) {
          return Result.ok({
            status: 'success',
            paymentId: payment.paymentId,
            eventId: event.eventId,
            reason: 'payment_already_success',
          });
        }

        // State Machine Transition to SUCCESS
        payment.markSuccess(
          event.providerPaymentId || 'pay_webhook_captured',
          event.providerOrderId || payment.providerOrderId || undefined,
        );

        // Atomic Persistence & Event Dispatching
        await this.paymentRepo.save(payment);

        return Result.ok({
          status: 'success',
          paymentId: payment.paymentId,
          eventId: event.eventId,
        });
      }

      if (event.eventType === 'payment.failed') {
        // If payment is already in terminal SUCCESS, do NOT transition to FAILED
        if (payment.status === PaymentStatus.SUCCESS) {
          return Result.ok({
            status: 'ignored',
            paymentId: payment.paymentId,
            eventId: event.eventId,
            reason: 'cannot_fail_completed_payment',
          });
        }

        if (payment.status === PaymentStatus.FAILED) {
          return Result.ok({
            status: 'success',
            paymentId: payment.paymentId,
            eventId: event.eventId,
            reason: 'payment_already_failed',
          });
        }

        payment.markFailed(event.errorDescription || 'Gateway payment failed');
        await this.paymentRepo.save(payment);

        return Result.ok({
          status: 'success',
          paymentId: payment.paymentId,
          eventId: event.eventId,
        });
      }

      if (event.eventType === 'transfer.processed') {
        if (payment.payout.status === 'PAID') {
          return Result.ok({
            status: 'success',
            paymentId: payment.paymentId,
            eventId: event.eventId,
            reason: 'payout_already_paid',
          });
        }

        payment.recordSuccessfulPayout(event.providerPaymentId || `pout_wh_${Date.now()}`);
        await this.paymentRepo.save(payment);

        return Result.ok({
          status: 'success',
          paymentId: payment.paymentId,
          eventId: event.eventId,
        });
      }

      if (event.eventType === 'transfer.failed') {
        if (payment.payout.status === 'PAID') {
          return Result.ok({
            status: 'ignored',
            paymentId: payment.paymentId,
            eventId: event.eventId,
            reason: 'cannot_fail_paid_payout',
          });
        }

        payment.failPayout(event.errorDescription || 'Provider transfer failed');
        await this.paymentRepo.save(payment);

        return Result.ok({
          status: 'success',
          paymentId: payment.paymentId,
          eventId: event.eventId,
        });
      }

      return Result.ok({
        status: 'ignored',
        reason: 'unhandled_path',
        eventId: event.eventId,
      });
    } catch (error: unknown) {
      // Release lock on unexpected failure to allow reprocessing
      await this.idempotencyService.release(event.eventId);
      const message = error instanceof Error ? error.message : 'Unknown webhook processing error';
      return Result.fail(message);
    }
  }
}
