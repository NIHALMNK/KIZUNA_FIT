import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { RefundController } from '../../../../src/modules/payment/presentation/controllers/refund.controller';
import { Result } from '../../../../src/shared/result/Result';

describe('RefundController Presentation Tests', () => {
  let controller: RefundController;
  let mockRequestRefundUseCase: any;
  let mockGetRefundUseCase: any;
  let mockListRefundsUseCase: any;
  let mockReviewRefundUseCase: any;
  let mockApproveRefundUseCase: any;
  let mockRejectRefundUseCase: any;
  let mockProcessApprovedRefundUseCase: any;

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

    mockRequestRefundUseCase = { execute: vi.fn() };
    mockGetRefundUseCase = { execute: vi.fn() };
    mockListRefundsUseCase = { execute: vi.fn() };
    mockReviewRefundUseCase = { execute: vi.fn() };
    mockApproveRefundUseCase = { execute: vi.fn() };
    mockRejectRefundUseCase = { execute: vi.fn() };
    mockProcessApprovedRefundUseCase = { execute: vi.fn() };

    controller = new RefundController(
      mockRequestRefundUseCase,
      mockGetRefundUseCase,
      mockListRefundsUseCase,
      mockReviewRefundUseCase,
      mockApproveRefundUseCase,
      mockRejectRefundUseCase,
      mockProcessApprovedRefundUseCase,
    );
  });

  it('should return HTTP 201 when client requests a refund successfully', async () => {
    mockReq = {
      params: { id: 'pay_123' },
      body: { amount: 5000, reason: 'Scheduling conflict' },
      user: { id: 'client_1', role: 'CLIENT' },
    } as any;

    mockRequestRefundUseCase.execute.mockResolvedValue(
      Result.ok({ refundId: 'ref_123', amount: 5000, status: 'PENDING' }),
    );

    await controller.requestRefund(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ refundId: 'ref_123' }),
    });
  });

  it('should return HTTP 403 when a non-admin attempts to approve a refund', async () => {
    mockReq = {
      params: { id: 'pay_123', refundId: 'ref_123' },
      body: { notes: 'Self approve attempt' },
      user: { id: 'client_1', role: 'CLIENT' },
    } as any;

    await controller.approveRefund(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining('Admin access required'),
    });
    expect(mockApproveRefundUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return HTTP 200 when admin processes an approved refund', async () => {
    mockReq = {
      params: { id: 'pay_123', refundId: 'ref_123' },
      user: { id: 'admin_1', role: 'ADMIN' },
    } as any;

    mockProcessApprovedRefundUseCase.execute.mockResolvedValue(
      Result.ok({ refundId: 'ref_123', status: 'PROCESSED', gatewayRefundId: 'rfnd_1' }),
    );

    await controller.processApprovedRefund(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ status: 'PROCESSED' }),
    });
  });
});
