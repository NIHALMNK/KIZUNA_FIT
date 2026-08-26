import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { RazorpayWebhookVerifier } from '../../../../src/modules/payment/infrastructure/gateways/razorpay/razorpay-webhook.verifier';

describe('RazorpayWebhookVerifier Unit Tests', () => {
  const secret = 'webhook_secret_xyz123';
  const verifier = new RazorpayWebhookVerifier({
    keyId: 'dummy',
    keySecret: 'dummy',
    webhookSecret: secret,
  });

  it('should return true for a valid cryptographic HMAC SHA-256 signature', () => {
    const rawBody = Buffer.from(JSON.stringify({ event: 'payment.captured', id: 'evt_123' }));
    const signature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    const isValid = verifier.verify(rawBody, signature);
    expect(isValid).toBe(true);
  });

  it('should return false if payload bytes are modified after signature creation', () => {
    const originalBody = Buffer.from(JSON.stringify({ event: 'payment.captured', amount: 1000 }));
    const signature = crypto.createHmac('sha256', secret).update(originalBody).digest('hex');

    const tamperedBody = Buffer.from(JSON.stringify({ event: 'payment.captured', amount: 9999 }));

    const isValid = verifier.verify(tamperedBody, signature);
    expect(isValid).toBe(false);
  });

  it('should return false if signature is missing or empty', () => {
    const rawBody = Buffer.from(JSON.stringify({ event: 'payment.captured' }));
    expect(verifier.verify(rawBody, '')).toBe(false);
  });

  it('should return false if signature is forged / wrong length', () => {
    const rawBody = Buffer.from(JSON.stringify({ event: 'payment.captured' }));
    expect(verifier.verify(rawBody, 'invalid_signature_hash')).toBe(false);
  });
});
