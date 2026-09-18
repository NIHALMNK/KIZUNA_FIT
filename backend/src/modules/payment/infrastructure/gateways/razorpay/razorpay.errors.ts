import { AppError } from '../../../../../shared/exceptions/AppError';

export class RazorpayGatewayException extends AppError {
  constructor(message: string, originalCode?: string) {
    super(`Razorpay Gateway Error: ${message}`, originalCode || 'RAZORPAY_GATEWAY_ERROR', false);
  }
}

export class RazorpayAuthenticationException extends AppError {
  constructor(message = 'Invalid Razorpay API credentials configured.') {
    super(message, 'RAZORPAY_AUTH_ERROR', false);
  }
}

export class RazorpayVerificationException extends AppError {
  constructor(message: string) {
    super(
      `Razorpay Signature/Payment Verification Failed: ${message}`,
      'RAZORPAY_VERIFICATION_ERROR',
      true,
    );
  }
}
