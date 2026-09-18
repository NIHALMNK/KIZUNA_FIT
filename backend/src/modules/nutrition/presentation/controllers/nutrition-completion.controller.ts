import { Request, Response } from 'express';
import { StartNutritionCompletionUseCase } from '../../application/use-cases/completion/start-nutrition-completion.use-case';
import { UpdateNutritionCompletionUseCase } from '../../application/use-cases/completion/update-nutrition-completion.use-case';
import { CompleteNutritionCompletionUseCase } from '../../application/use-cases/completion/complete-nutrition-completion.use-case';
import { GetNutritionCompletionUseCase } from '../../application/use-cases/completion/get-nutrition-completion.use-case';
import { ListNutritionCompletionsUseCase } from '../../application/use-cases/completion/list-nutrition-completions.use-case';
import {
  DuplicateNutritionCompletionException,
  InvalidNutritionCompletionTransitionException,
  NutritionCompletionImmutableException,
  NutritionCompletionNotFoundException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../domain/exceptions/nutrition-domain.exceptions';
import { AppError, NotFoundError } from '../../../../shared/exceptions/AppError';

export class NutritionCompletionController {
  constructor(
    private readonly startNutritionCompletionUseCase: StartNutritionCompletionUseCase,
    private readonly updateNutritionCompletionUseCase: UpdateNutritionCompletionUseCase,
    private readonly completeNutritionCompletionUseCase: CompleteNutritionCompletionUseCase,
    private readonly getNutritionCompletionUseCase: GetNutritionCompletionUseCase,
    private readonly listNutritionCompletionsUseCase: ListNutritionCompletionsUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (
      error instanceof NutritionCompletionNotFoundException ||
      error instanceof NutritionPlanNotFoundException ||
      error instanceof NotFoundError
    ) {
      res.status(404).json({ success: false, message: (error as Error).message });
      return;
    }

    if (error instanceof UnauthorizedNutritionActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }

    if (error instanceof DuplicateNutritionCompletionException) {
      res.status(409).json({ success: false, message: error.message });
      return;
    }

    if (
      error instanceof NutritionCompletionImmutableException ||
      error instanceof InvalidNutritionCompletionTransitionException
    ) {
      res.status(422).json({ success: false, message: error.message });
      return;
    }

    if (error instanceof AppError) {
      res.status(400).json({ success: false, message: error.message, code: error.code });
      return;
    }

    const message = (error as Error)?.message || 'An unexpected error occurred.';
    res.status(500).json({ success: false, message });
  }

  private getAuthenticatedUserId(req: Request): string {
    const user = (req as any).auth || (req as any).user;
    return user?.id || user?.userId || user?.sub || '';
  }

  public startCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const completion = await this.startNutritionCompletionUseCase.execute(req.body, callerId);
      res.status(201).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updateCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { completionId } = req.params;
      const completion = await this.updateNutritionCompletionUseCase.execute(
        completionId,
        req.body,
        callerId,
      );
      res.status(200).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public completeCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { completionId } = req.params;
      const completion = await this.completeNutritionCompletionUseCase.execute(
        completionId,
        callerId,
        req.body,
      );
      res.status(200).json({
        success: true,
        data: completion,
        message: 'Nutrition day marked as completed!',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getCompletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { completionId } = req.params;
      const completion = await this.getNutritionCompletionUseCase.execute(completionId, callerId);
      res.status(200).json({ success: true, data: completion });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public listCompletions = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { coachingRelationshipId, limit, skip } = req.query;

      const completions = await this.listNutritionCompletionsUseCase.execute(
        coachingRelationshipId as string | undefined,
        callerId,
        limit ? parseInt(limit as string, 10) : 50,
        skip ? parseInt(skip as string, 10) : 0,
      );

      res.status(200).json({
        success: true,
        data: completions,
        meta: { total: completions.length },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
