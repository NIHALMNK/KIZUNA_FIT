import { Request, Response } from 'express';
import { RaiseDisputeUseCase } from '../../application/use-cases/raise-dispute.use-case';
import { GetDisputeUseCase } from '../../application/use-cases/get-dispute.use-case';
import { ListDisputesUseCase } from '../../application/use-cases/list-disputes.use-case';
import { InvestigateDisputeUseCase } from '../../application/use-cases/investigate-dispute.use-case';
import { ResolveDisputeUseCase } from '../../application/use-cases/resolve-dispute.use-case';
import { CloseDisputeUseCase } from '../../application/use-cases/close-dispute.use-case';

export class DisputeController {
  constructor(
    private readonly raiseDisputeUseCase: RaiseDisputeUseCase,
    private readonly getDisputeUseCase: GetDisputeUseCase,
    private readonly listDisputesUseCase: ListDisputesUseCase,
    private readonly investigateDisputeUseCase: InvestigateDisputeUseCase,
    private readonly resolveDisputeUseCase: ResolveDisputeUseCase,
    private readonly closeDisputeUseCase: CloseDisputeUseCase,
  ) {}

  public raiseDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const { reason, evidence } = req.body;
      const result = await this.raiseDisputeUseCase.execute({
        paymentId: req.params.id,
        reason,
        evidence,
        raisedBy: user.id || user.userId,
        requesterRole: user.role,
      });

      if (result.isFailure) {
        res.status(400).json({ error: result.error });
        return;
      }

      res.status(201).json({
        status: 'ok',
        data: result.getValue(),
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Internal server error';
      res.status(500).json({ error: message });
    }
  };

  public getDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User authentication required.' });
        return;
      }

      const result = await this.getDisputeUseCase.execute({
        paymentId: req.params.id,
        disputeId: req.params.disputeId,
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

  public listDisputes = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin access required to list all disputes.' });
        return;
      }

      const { status, clientId, trainerId } = req.query;
      const result = await this.listDisputesUseCase.execute({
        paymentId: req.params.id,
        status: status as string | undefined,
        clientId: clientId as string | undefined,
        trainerId: trainerId as string | undefined,
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

  public investigateDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res
          .status(403)
          .json({ error: 'Forbidden: Admin access required to investigate disputes.' });
        return;
      }

      const result = await this.investigateDisputeUseCase.execute({
        paymentId: req.params.id,
        disputeId: req.params.disputeId,
        adminId: user.id || user.userId,
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

  public resolveDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin access required to resolve disputes.' });
        return;
      }

      const { resolutionNotes } = req.body;
      const result = await this.resolveDisputeUseCase.execute({
        paymentId: req.params.id,
        disputeId: req.params.disputeId,
        adminId: user.id || user.userId,
        resolutionNotes,
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

  public closeDispute = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      if (!user || user.role?.toUpperCase() !== 'ADMIN') {
        res.status(403).json({ error: 'Forbidden: Admin access required to close disputes.' });
        return;
      }

      const result = await this.closeDisputeUseCase.execute({
        paymentId: req.params.id,
        disputeId: req.params.disputeId,
        adminId: user.id || user.userId,
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
}
