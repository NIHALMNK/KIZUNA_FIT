import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { PaymentController } from '../../../../src/modules/payment/presentation/controllers/payment.controller';
import { Result } from '../../../../src/shared/result/Result';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';

describe('PaymentController Unit Tests', () => {
  let controller: PaymentController;
  let mockInitiatePaymentUseCase: any;
  let mockVerifyPaymentUseCase: any;
  let mockGetPaymentUseCase: any;
  let mockListPaymentsUseCase: any;
  let mockGetInvoiceUseCase: any;

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

    mockInitiatePaymentUseCase = { execute: vi.fn() };
    mockVerifyPaymentUseCase = { execute: vi.fn() };
    mockGetPaymentUseCase = { execute: vi.fn() };
    mockListPaymentsUseCase = { execute: vi.fn() };
    mockGetInvoiceUseCase = { execute: vi.fn() };

    controller = new PaymentController(
      mockInitiatePaymentUseCase,
      mockVerifyPaymentUseCase,
      mockGetPaymentUseCase,
      mockListPaymentsUseCase,
      mockGetInvoiceUseCase,
    );
  });

  describe('1. initiatePayment', () => {
    it('should return HTTP 201 when Client initiates payment for accepted offer', async () => {
      mockReq = {
        body: { offerId: 'off_123' },
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      mockInitiatePaymentUseCase.execute.mockResolvedValue(
        Result.ok({
          paymentId: 'pay_123',
          offerId: 'off_123',
          providerOrderId: 'order_rzp_123',
          keyId: 'rzp_test_key',
          totalAmount: 10000,
          currency: 'INR',
          status: PaymentStatus.PROCESSING,
        }),
      );

      await controller.initiatePayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'ok',
        data: expect.objectContaining({ paymentId: 'pay_123', providerOrderId: 'order_rzp_123' }),
      });
    });

    it('should return HTTP 403 when non-Client attempts to initiate payment', async () => {
      mockReq = {
        body: { offerId: 'off_123' },
        user: { id: 'trainer_1', role: 'TRAINER' },
      } as any;

      await controller.initiatePayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('Only Clients can initiate payment'),
      });
      expect(mockInitiatePaymentUseCase.execute).not.toHaveBeenCalled();
    });

    it('should return HTTP 400 if offerId is missing in body', async () => {
      mockReq = {
        body: {},
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      await controller.initiatePayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('offerId is required'),
      });
    });
  });

  describe('2. verifyPayment', () => {
    it('should return HTTP 200 when signature verification succeeds', async () => {
      mockReq = {
        params: { id: 'pay_123' },
        body: {
          providerOrderId: 'order_rzp_123',
          providerPaymentId: 'pay_rzp_123',
          providerSignature: 'sig_valid_123',
        },
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      mockVerifyPaymentUseCase.execute.mockResolvedValue(
        Result.ok({
          paymentId: 'pay_123',
          status: PaymentStatus.SUCCESS,
          totalAmount: 10000,
          currency: 'INR',
        }),
      );

      await controller.verifyPayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'ok',
        data: expect.objectContaining({ paymentId: 'pay_123', status: PaymentStatus.SUCCESS }),
      });
    });

    it('should return HTTP 400 if verification parameters are missing', async () => {
      mockReq = {
        params: { id: 'pay_123' },
        body: { providerOrderId: 'order_rzp_123' }, // missing signature
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      await controller.verifyPayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('required'),
      });
    });
  });

  describe('3. getPayment', () => {
    it('should return HTTP 200 with payment details', async () => {
      mockReq = {
        params: { id: 'pay_123' },
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      mockGetPaymentUseCase.execute.mockResolvedValue(
        Result.ok({ paymentId: 'pay_123', status: PaymentStatus.SUCCESS }),
      );

      await controller.getPayment(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'ok',
        data: expect.objectContaining({ paymentId: 'pay_123' }),
      });
    });
  });

  describe('4. listPayments', () => {
    it('should return HTTP 200 with list of payments', async () => {
      mockReq = {
        query: { limit: '10', offset: '0' },
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      mockListPaymentsUseCase.execute.mockResolvedValue(
        Result.ok({
          payments: [{ paymentId: 'pay_123', status: PaymentStatus.SUCCESS }],
          total: 1,
          limit: 10,
          offset: 0,
        }),
      );

      await controller.listPayments(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'ok',
        data: expect.objectContaining({ total: 1 }),
      });
    });
  });

  describe('5. getInvoice', () => {
    it('should return HTTP 200 with invoice data', async () => {
      mockReq = {
        params: { id: 'pay_123' },
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      mockGetInvoiceUseCase.execute.mockResolvedValue(
        Result.ok({
          invoiceId: 'inv_123',
          paymentId: 'pay_123',
          invoiceNumber: 'INV-2026-001',
          totalAmount: 10000,
        }),
      );

      await controller.getInvoice(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        status: 'ok',
        data: expect.objectContaining({ invoiceNumber: 'INV-2026-001' }),
      });
    });
  });
});
