import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { PayoutController } from '../../../../src/modules/payment/presentation/controllers/payout.controller';
import { Result } from '../../../../src/shared/result/Result';

describe('PayoutController Presentation Unit Tests', () => {
  let controller: PayoutController;
  let mockCheckEligibilityUseCase: any;
  let mockGetPayoutUseCase: any;
  let mockListPayoutsUseCase: any;
  let mockProcessPayoutUseCase: any;
  let mockRetryPayoutUseCase: any;
  let mockGetSettlementUseCase: any;

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

    mockCheckEligibilityUseCase = { execute: vi.fn() };
    mockGetPayoutUseCase = { execute: vi.fn() };
    mockListPayoutsUseCase = { execute: vi.fn() };
    mockProcessPayoutUseCase = { execute: vi.fn() };
    mockRetryPayoutUseCase = { execute: vi.fn() };
    mockGetSettlementUseCase = { execute: vi.fn() };

    controller = new PayoutController(
      mockCheckEligibilityUseCase,
      mockGetPayoutUseCase,
      mockListPayoutsUseCase,
      mockProcessPayoutUseCase,
      mockRetryPayoutUseCase,
      mockGetSettlementUseCase,
    );
  });

  it('should return HTTP 200 with eligibility check result', async () => {
    mockReq = {
      params: { id: 'pay_po_1' },
      user: { id: 'trainer_1', role: 'TRAINER' },
    } as any;

    mockCheckEligibilityUseCase.execute.mockResolvedValue(
      Result.ok({
        paymentId: 'pay_po_1',
        isEligible: true,
        eligibleAmount: 8000,
        currency: 'INR',
        eligibleAt: new Date().toISOString(),
      }),
    );

    await controller.checkEligibility(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ isEligible: true, eligibleAmount: 8000 }),
    });
  });

  it('should return HTTP 403 when non-admin attempts to process payout', async () => {
    mockReq = {
      params: { id: 'pay_po_1' },
      body: {},
      user: { id: 'trainer_1', role: 'TRAINER' },
    } as any;

    await controller.processPayout(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({
      error: expect.stringContaining('Admin access required'),
    });
    expect(mockProcessPayoutUseCase.execute).not.toHaveBeenCalled();
  });

  it('should return HTTP 200 when admin processes payout successfully', async () => {
    mockReq = {
      params: { id: 'pay_po_1' },
      body: { idempotencyKey: 'idemp_123' },
      user: { id: 'admin_1', role: 'ADMIN' },
    } as any;

    mockProcessPayoutUseCase.execute.mockResolvedValue(
      Result.ok({
        payoutId: 'po_123',
        status: 'PAID',
        gatewayPayoutId: 'pout_rzp_1',
        amount: 8000,
      }),
    );

    await controller.processPayout(mockReq as Request, mockRes as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'ok',
      data: expect.objectContaining({ status: 'PAID' }),
    });
  });

  describe('listPayouts Authorization & IDOR Protections', () => {
    it('1. Admin can filter payouts by trainerId query parameter', async () => {
      mockReq = {
        query: { trainerId: 'trainer_456', status: 'PENDING' },
        user: { id: 'admin_1', role: 'ADMIN' },
      } as any;

      mockListPayoutsUseCase.execute.mockResolvedValue(
        Result.ok([{ payoutId: 'po_1', trainerId: 'trainer_456' }]),
      );

      await controller.listPayouts(mockReq as Request, mockRes as Response);

      expect(mockListPayoutsUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ trainerId: 'trainer_456', status: 'PENDING' }),
      );
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('2. Trainer without query uses authenticated trainer ID', async () => {
      mockReq = {
        query: {},
        user: { id: 'trainer_my_id', role: 'TRAINER' },
      } as any;

      mockListPayoutsUseCase.execute.mockResolvedValue(
        Result.ok([{ payoutId: 'po_2', trainerId: 'trainer_my_id' }]),
      );

      await controller.listPayouts(mockReq as Request, mockRes as Response);

      expect(mockListPayoutsUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ trainerId: 'trainer_my_id' }),
      );
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('3. Trainer passing ?trainerId=OTHER_TRAINER is ignored and strictly restricted to authenticated trainer ID', async () => {
      mockReq = {
        query: { trainerId: 'other_trainer_999' },
        user: { id: 'trainer_authenticated_id', role: 'TRAINER' },
      } as any;

      mockListPayoutsUseCase.execute.mockResolvedValue(
        Result.ok([{ payoutId: 'po_3', trainerId: 'trainer_authenticated_id' }]),
      );

      await controller.listPayouts(mockReq as Request, mockRes as Response);

      expect(mockListPayoutsUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({ trainerId: 'trainer_authenticated_id' }),
      );
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it('4. Client is strictly rejected from listing payouts with HTTP 403', async () => {
      mockReq = {
        query: {},
        user: { id: 'client_1', role: 'CLIENT' },
      } as any;

      await controller.listPayouts(mockReq as Request, mockRes as Response);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        error: expect.stringContaining('Only Trainers and Admins can list payouts'),
      });
      expect(mockListPayoutsUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
