import { AppError } from '../../../../shared/exceptions/AppError';

export class PaymentNotFoundException extends AppError {
  constructor(identifier: string) {
    super(`Payment with identifier '${identifier}' was not found.`, 'PAYMENT_NOT_FOUND', true);
  }
}

export class OfferNotFoundException extends AppError {
  constructor(offerId: string) {
    super(`Offer with ID '${offerId}' was not found.`, 'OFFER_NOT_FOUND', true);
  }
}

export class OfferNotAcceptedException extends AppError {
  constructor(offerId: string, currentStatus: string) {
    super(
      `Offer '${offerId}' is in status '${currentStatus}'. Payment can only be initiated for 'ACCEPTED' offers.`,
      'OFFER_NOT_ACCEPTED',
      true,
    );
  }
}

export class UnauthorizedPaymentException extends AppError {
  constructor(userId: string, paymentOrOfferId: string) {
    super(
      `User '${userId}' is not authorized to perform actions on payment/offer '${paymentOrOfferId}'.`,
      'UNAUTHORIZED_PAYMENT_ACCESS',
      true,
    );
  }
}

export class PaymentAlreadyExistsException extends AppError {
  constructor(offerId: string) {
    super(
      `A payment record already exists for offer '${offerId}'.`,
      'PAYMENT_ALREADY_EXISTS',
      true,
    );
  }
}

export class PaymentVerificationFailedException extends AppError {
  constructor(paymentId: string, reason: string) {
    super(
      `Payment verification failed for payment '${paymentId}': ${reason}`,
      'PAYMENT_VERIFICATION_FAILED',
      true,
    );
  }
}

export class WebhookSignatureInvalidException extends AppError {
  constructor(message = 'Invalid Razorpay webhook cryptographic signature.') {
    super(message, 'WEBHOOK_SIGNATURE_INVALID', true);
  }
}

export class WebhookPayloadInvalidException extends AppError {
  constructor(reason: string) {
    super(`Invalid webhook payload: ${reason}`, 'WEBHOOK_PAYLOAD_INVALID', true);
  }
}
