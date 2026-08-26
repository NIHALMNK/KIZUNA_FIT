import { Request, Response } from 'express';
import { RequestRefundUseCase } from '../../application/use-cases/request-refund.use-case';
import { GetRefundUseCase } from '../../application/use-cases/get-refund.use-case';
import { ListRefundsUseCase } from '../../application/use-cases/list-refunds.use-case';
import { ReviewRefundUseCase } from '../../application/use-cases/review-refund.use-case';
import { ApproveRefundUseCase } from '../../application/use-cases/approve-refund.use-case';
import { RejectRefundUseCase } from '../../application/use-cases/reject-refund.use-case';
import { ProcessApprovedRefundUseCase } from '../../application/use-cases/process-approved-refund.use-case';

export class RefundController {
  constructor(
    private readonly requestRefundUseCase: RequestRefundUseCase,
    private readonly getRefundUseCase: GetRefundUseCase,
    private readonly listRefundsUseCase: ListRefundsUseCase,
    private readonly reviewRefundUseCase: ReviewRefundUseCase,
    private readonly approveRefundUseCase: ApproveRefundUseCase,
    private readonly rejectRefundUseCase: RejectRefundUseCase,
    private readonly processApprovedRefundUseCase: ProcessApprovedRefundUseCase,
  ) {}

  public async requestRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const paymentId = req.params.id;
    const { reason } = req.body;

    const result = await this.requestRefundUseCase.execute({
      paymentId,
      requesterId: user?.id || user?.userId,
      requesterRole: user?.role || 'CLIENT',
      reason,
    });

    if (result.isFailure) {
      const errorMsg = result.error as string;
      const status = errorMsg.includes('Forbidden') || errorMsg.includes('authorized') ? 403 : 400;
      res.status(status).json({ error: errorMsg });
      return;
    }

    res.status(201).json({ status: 'ok', data: result.getValue() });
  }

  public async getRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const { id: paymentId, refundId } = req.params;

    const result = await this.getRefundUseCase.execute({
      paymentId,
      refundId,
      requesterId: user?.id || user?.userId,
      requesterRole: user?.role || 'CLIENT',
    });

    if (result.isFailure) {
      const errorMsg = result.error as string;
      const status = errorMsg.includes('not found')
        ? 404
        : errorMsg.includes('Forbidden')
          ? 403
          : 400;
      res.status(status).json({ error: errorMsg });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }

  public async listRefunds(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const status = req.query.status as string | undefined;

    const result = await this.listRefundsUseCase.execute({
      requesterId: user?.id || user?.userId,
      requesterRole: user?.role || 'CLIENT',
      status,
    });

    if (result.isFailure) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }

  public async reviewRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const { id: paymentId, refundId } = req.params;
    const { notes } = req.body;

    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Admin access required.' });
      return;
    }

    const result = await this.reviewRefundUseCase.execute({
      paymentId,
      refundId,
      adminId: user?.id || user?.userId || 'admin_user',
      notes,
    });

    if (result.isFailure) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }

  public async approveRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const { id: paymentId, refundId } = req.params;
    const { notes } = req.body;

    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Admin access required.' });
      return;
    }

    const result = await this.approveRefundUseCase.execute({
      paymentId,
      refundId,
      adminId: user?.id || user?.userId || 'admin_user',
      notes,
    });

    if (result.isFailure) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }

  public async rejectRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const { id: paymentId, refundId } = req.params;
    const { reason } = req.body;

    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Admin access required.' });
      return;
    }

    const result = await this.rejectRefundUseCase.execute({
      paymentId,
      refundId,
      adminId: user?.id || user?.userId || 'admin_user',
      reason,
    });

    if (result.isFailure) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }

  public async processApprovedRefund(req: Request, res: Response): Promise<void> {
    const user = (req as any).auth || (req as any).user;
    const { id: paymentId, refundId } = req.params;

    if (user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Admin access required.' });
      return;
    }

    const result = await this.processApprovedRefundUseCase.execute({
      paymentId,
      refundId,
      adminId: user?.id || user?.userId || 'admin_user',
    });

    if (result.isFailure) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(200).json({ status: 'ok', data: result.getValue() });
  }
}
