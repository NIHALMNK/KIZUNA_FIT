import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidPaymentTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid payment state transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_PAYMENT_STATE_TRANSITION',
      true,
    );
  }
}

export class DisputeActiveFreezeException extends AppError {
  constructor(paymentId: string, action: string) {
    super(
      `Cannot perform '${action}' on payment '${paymentId}' because there is an active dispute.`,
      'DISPUTE_ACTIVE_FREEZE',
      true,
    );
  }
}

export class PayoutNotEligibleException extends AppError {
  constructor(paymentId: string, reason: string) {
    super(
      `Payout for payment '${paymentId}' is not eligible: ${reason}`,
      'PAYOUT_NOT_ELIGIBLE',
      true,
    );
  }
}

export class RefundNotAllowedException extends AppError {
  constructor(paymentId: string, reason: string) {
    super(
      `Refund for payment '${paymentId}' is not allowed: ${reason}`,
      'REFUND_NOT_ALLOWED',
      true,
    );
  }
}

export class PaymentImmutableException extends AppError {
  constructor(paymentId: string, status: string) {
    super(
      `Payment '${paymentId}' is in terminal state '${status}' and cannot be modified.`,
      'PAYMENT_IMMUTABLE',
      true,
    );
  }
}

export class ConcurrencyConflictException extends AppError {
  constructor(paymentId: string) {
    super(
      `Concurrency conflict on payment '${paymentId}': Aggregate was modified by a concurrent operation. Please reload and retry.`,
      'CONCURRENCY_CONFLICT',
      true,
    );
  }
}
