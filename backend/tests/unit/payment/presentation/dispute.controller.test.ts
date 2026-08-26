import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { DisputeController } from '../../../../src/modules/payment/presentation/controllers/dispute.controller';
import { Result } from '../../../../src/shared/result/Result';

describe('DisputeController Presentation Unit Tests', () => {
  let controller: DisputeController;
  let mockRaiseDisputeUseCase: any;
  let mockGetDisputeUseCase: any;
  let mockListDisputesUseCase: any;
  let mockInvestigateDisputeUseCase: any;
  let mockResolveDisputeUseCase: any;
  let mockCloseDisputeUseCase: any;

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

    mockRaiseDisputeUseCase = { execute: vi.fn() };
    mockGetDisputeUseCase = { execute: vi.fn() };
    mockListDisputesUseCase = { execute: vi.fn() };
    mockInvestigateDisputeUseCase = { execute: vi.fn() };
    mockResolveDisputeUseCase = { execute: vi.fn() };
    mockCloseDisputeUseCase = { execute: vi.fn() };

    controller = new DisputeController(
      mockRaiseDisputeUseCase,
      mockGetDisputeUseCase,
      mockListDisputesUseCase,
      mockInvestigateDisputeUseCase,
      mockResolveDisputeUseCase,
      mockCloseDisputeUseCase,
    );
  });

  it('should return HTTP 201 when raising a dispute is successful', async () => {
    mockReq = {
      params: { id: 'pay_disp_1' },
      body: { reason: 'Trainer did not attend', evidence: 'http://img.png' },
      user: { id: 'client_1', role: 'CLIENT' },
    } as any;

    mockRaiseDisputeUseCase.execute.mockResolvedValue(
      Result.ok({ disputeId: 'dsp_123', reason: 'Trainer did not attend', status: 'OPEN' }),
    );

    await controller.raiseDispute(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ disputeId: 'dsp_123' }),
    });
  });

  it('should return HTTP 403 when non-admin attempts to put dispute under investigation', async () => {
    mockReq = {
      params: { id: 'pay_disp_1', disputeId: 'dsp_123' },
      user: { id: 'client_1', role: 'CLIENT' },
    } as any;

    await controller.investigateDispute(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining('Admin access required'),
    });
    expect(mockInvestigateDisputeUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return HTTP 200 when admin resolves a dispute', async () => {
    mockReq = {
      params: { id: 'pay_disp_1', disputeId: 'dsp_123' },
      body: { resolutionNotes: 'Resolved mutually' },
      user: { id: 'admin_1', role: 'ADMIN' },
    } as any;

    mockResolveDisputeUseCase.execute.mockResolvedValue(
      Result.ok({ disputeId: 'dsp_123', status: 'RESOLVED' }),
    );

    await controller.resolveDispute(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ status: 'RESOLVED' }),
    });
  });
});
