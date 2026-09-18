import { Request, Response } from 'express';
import { ListCoachingRelationshipsUseCase } from '../../application/use-cases/list-coaching-relationships.use-case';
import { GetActiveCoachingRelationshipUseCase } from '../../application/use-cases/get-active-coaching-relationship.use-case';
import { GetCoachingHistoryUseCase } from '../../application/use-cases/get-coaching-history.use-case';
import { GetCoachingRelationshipUseCase } from '../../application/use-cases/get-coaching-relationship.use-case';
import { ActivateCoachingRelationshipUseCase } from '../../application/use-cases/activate-coaching-relationship.use-case';
import { CompleteCoachingRelationshipUseCase } from '../../application/use-cases/complete-coaching-relationship.use-case';
import { CancelCoachingRelationshipUseCase } from '../../application/use-cases/cancel-coaching-relationship.use-case';
import {
  InvalidCoachingTransitionException,
  UnauthorizedCoachingActionException,
  CoachingRelationshipNotFoundException,
  CoachingRelationshipImmutableException,
} from '../../domain/exceptions/coaching-domain.exceptions';

export class CoachingRelationshipController {
  constructor(
    private readonly listCoachingRelationshipsUseCase: ListCoachingRelationshipsUseCase,
    private readonly getActiveCoachingRelationshipUseCase: GetActiveCoachingRelationshipUseCase,
    private readonly getCoachingHistoryUseCase: GetCoachingHistoryUseCase,
    private readonly getCoachingRelationshipUseCase: GetCoachingRelationshipUseCase,
    private readonly activateCoachingRelationshipUseCase: ActivateCoachingRelationshipUseCase,
    private readonly completeCoachingRelationshipUseCase: CompleteCoachingRelationshipUseCase,
    private readonly cancelCoachingRelationshipUseCase: CancelCoachingRelationshipUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof CoachingRelationshipNotFoundException) {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error instanceof UnauthorizedCoachingActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }
    if (
      error instanceof InvalidCoachingTransitionException ||
      error instanceof CoachingRelationshipImmutableException
    ) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    const message = (error as Error)?.message || 'An unexpected error occurred.';
    res.status(400).json({ success: false, message });
  }

  public listCoachingRelationships = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { page, limit, status, sort } = req.query;

      const result = await this.listCoachingRelationshipsUseCase.execute({
        actorId: user.id || user.userId,
        role: (user.role || '').toUpperCase(),
        status: status as any,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        sort: sort as any,
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationships retrieved successfully.',
        data: {
          relationships: result.items,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getActiveCoachingRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;

      const result = await this.getActiveCoachingRelationshipUseCase.execute({
        actorId: user.id || user.userId,
        role: (user.role || '').toUpperCase(),
      });

      res.status(200).json({
        success: true,
        message: 'Active coaching relationships retrieved successfully.',
        data: {
          relationships: Array.isArray(result) ? result : result ? [result] : [],
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getCoachingHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { page, limit, status } = req.query;

      const result = await this.getCoachingHistoryUseCase.execute({
        actorId: user.id || user.userId,
        role: (user.role || '').toUpperCase(),
        status: status as any,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationship history retrieved successfully.',
        data: {
          relationships: result.items,
          pagination: result.pagination,
        },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getCoachingRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { relationshipId } = req.params;

      if (!relationshipId) {
        res.status(400).json({ success: false, message: 'relationshipId is required.' });
        return;
      }

      const result = await this.getCoachingRelationshipUseCase.execute({
        relationshipId,
        actorId: user.id || user.userId,
        actorRole: (user.role || '').toUpperCase(),
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationship retrieved successfully.',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public activateCoachingRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { relationshipId } = req.params;

      const result = await this.activateCoachingRelationshipUseCase.execute({
        relationshipId,
        actorRole: (user.role || '').toUpperCase(),
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationship activated successfully.',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public completeCoachingRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { relationshipId } = req.params;

      const result = await this.completeCoachingRelationshipUseCase.execute({
        relationshipId,
        actorId: user.id || user.userId,
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationship completed successfully.',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public cancelCoachingRelationship = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as any).auth || (req as any).user;
      const { relationshipId } = req.params;
      const { reason } = req.body;

      if (!reason || typeof reason !== 'string' || reason.trim() === '') {
        res
          .status(400)
          .json({ success: false, message: 'A valid cancellation reason is required.' });
        return;
      }

      const role = (user.role || '').toUpperCase();
      const isAdmin = role === 'ADMIN';

      const result = await this.cancelCoachingRelationshipUseCase.execute({
        relationshipId,
        actorId: user.id || user.userId,
        reason: reason.trim(),
        isAdmin,
      });

      res.status(200).json({
        success: true,
        message: 'Coaching relationship cancelled successfully.',
        data: result,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
