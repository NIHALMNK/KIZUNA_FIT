import crypto from 'node:crypto';
import { getRazorpayConfig, RazorpayConfig } from './razorpay.config';

export class RazorpayWebhookVerifier {
  private readonly config: RazorpayConfig;

  constructor(config?: RazorpayConfig) {
    this.config = config || getRazorpayConfig();
  }

  /**
   * Verifies the Razorpay webhook signature against the raw request body Buffer or string.
   */
  public verify(rawBody: Buffer | string, signature: string): boolean {
    if (!signature || !rawBody) {
      return false;
    }

    if (!this.config.webhookSecret) {
      return false;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const providedBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== providedBuffer.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    } catch {
      return false;
    }
  }
}
