import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { RazorpayWebhookController } from '../../../../src/modules/payment/presentation/controllers/razorpay-webhook.controller';
import { ProcessRazorpayWebhookUseCase } from '../../../../src/modules/payment/application/use-cases/process-razorpay-webhook.use-case';
import { Result } from '../../../../src/shared/result/Result';

describe('RazorpayWebhookController Unit Tests', () => {
  let mockUseCase: ProcessRazorpayWebhookUseCase;
  let controller: RazorpayWebhookController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockRes = {
      status: statusMock,
      json: jsonMock,
    };

    mockUseCase = {
      execute: vi.fn(),
    } as unknown as ProcessRazorpayWebhookUseCase;

    controller = new RazorpayWebhookController(mockUseCase);
  });

  it('should return HTTP 200 on successful webhook processing', async () => {
    const rawBodyBuffer = Buffer.from(JSON.stringify({ event: 'payment.captured', id: 'evt_1' }));
    mockReq = {
      headers: { 'x-razorpay-signature': 'valid_sig_123' },
      body: { event: 'payment.captured', id: 'evt_1' },
      rawBody: rawBodyBuffer,
    } as any;

    vi.mocked(mockUseCase.execute).mockResolvedValue(
      Result.ok({ status: 'success', eventId: 'evt_1', paymentId: 'pay_123' }),
    );

    await controller.handle(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: { status: 'success', eventId: 'evt_1', paymentId: 'pay_123' },
    });
  });

  it('should return HTTP 400 when webhook signature is invalid', async () => {
    const rawBodyBuffer = Buffer.from(JSON.stringify({ event: 'payment.captured' }));
    mockReq = {
      headers: { 'x-razorpay-signature': 'bad_sig' },
      body: { event: 'payment.captured' },
      rawBody: rawBodyBuffer,
    } as any;

    vi.mocked(mockUseCase.execute).mockResolvedValue(
      Result.fail('Invalid Razorpay webhook cryptographic signature.'),
    );

    await controller.handle(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Invalid Razorpay webhook cryptographic signature.',
    });
  });
});
