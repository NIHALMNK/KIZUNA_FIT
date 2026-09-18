import { Request, Response } from 'express';
import { CheckPayoutEligibilityUseCase } from '../../application/use-cases/check-payout-eligibility.use-case';
import { GetPayoutUseCase } from '../../application/use-cases/get-payout.use-case';
import { ListPayoutsUseCase } from '../../application/use-cases/list-payouts.use-case';
import { ProcessPayoutUseCase } from '../../application/use-cases/process-payout.use-case';
import { RetryPayoutUseCase } from '../../application/use-cases/retry-payout.use-case';
import { GetSettlementUseCase } from '../../application/use-cases/get-settlement.use-case';

export class PayoutController {
  constructor(
    private readonly checkPayoutEligibilityUseCase: CheckPayoutEligibilityUseCase,
    private readonly getPayoutUseCase: GetPayoutUseCase,
    private readonly listPayoutsUseCase: ListPayoutsUseCase,
    private readonly processPayoutUseCase: ProcessPayoutUseCase,
    private readonly retryPayoutUseCase: RetryPayoutUseCase,
    private readonly getSettlementUseCase: GetSettlementUseCase,
  ) {}

  public checkEligibility = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const result = await this.checkPayoutEligibilityUseCase.execute({
        paymentId: req.params.id,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public getPayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const result = await this.getPayoutUseCase.execute({
        paymentId: req.params.id,
        requesterId: user.id || user.userId,
        requesterRole: user.role,
      });

      if (result.isFailure) {
        const isForbidden = result.error?.includes('Forbidden');
        res.status(isForbidden ? 403 : 404).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public listPayouts = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const role = (user.role || '').toUpperCase();
      let trainerId: string | undefined = undefined;

      if (role === 'ADMIN') {
        trainerId = (req.query.trainerId as string) || undefined;
      } else if (role === 'TRAINER') {
        trainerId = user.id || user.userId;
      } else {
        res.status(403).json({ error: 'Forbidden: Only Trainers and Admins can list payouts.' });
        return;
      }

      const { status, limit, offset } = req.query;
      const result = await this.listPayoutsUseCase.execute({
        status: status as string | undefined,
        trainerId,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public processPayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin access required to process payouts.' });
        return;
      }

      const { idempotencyKey } = req.body;
      const result = await this.processPayoutUseCase.execute({
        paymentId: req.params.id,
        adminId: user.id || user.userId,
        idempotencyKey,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public retryPayout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin access required to retry payouts.' });
        return;
      }

      const { idempotencyKey } = req.body;
      const result = await this.retryPayoutUseCase.execute({
        paymentId: req.params.id,
        adminId: user.id || user.userId,
        idempotencyKey,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public getSettlement = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const result = await this.getSettlementUseCase.execute({
        paymentId: req.params.id,
        requesterId: user.id || user.userId,
        requesterRole: user.role,
      });

      if (result.isFailure) {
        const isForbidden = result.error?.includes('Forbidden');
        res.status(isForbidden ? 403 : 404).json({ error: result.error });
        return;
      }

      res.status(200).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };
}
