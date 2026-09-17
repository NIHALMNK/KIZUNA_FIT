import { Request, Response } from 'express';
import { CreateNutritionPlanUseCase } from '../../application/use-cases/plan/create-nutrition-plan.use-case';
import { UpdateNutritionPlanUseCase } from '../../application/use-cases/plan/update-nutrition-plan.use-case';
import { CreateNutritionPlanVersionUseCase } from '../../application/use-cases/plan/create-nutrition-plan-version.use-case';
import { ActivateNutritionPlanUseCase } from '../../application/use-cases/plan/activate-nutrition-plan.use-case';
import { CompleteNutritionPlanUseCase } from '../../application/use-cases/plan/complete-nutrition-plan.use-case';
import { DeleteDraftNutritionPlanUseCase } from '../../application/use-cases/plan/delete-draft-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '../../application/use-cases/plan/get-nutrition-plan.use-case';
import { GetActiveNutritionPlanUseCase } from '../../application/use-cases/plan/get-active-nutrition-plan.use-case';
import { ListNutritionPlansUseCase } from '../../application/use-cases/plan/list-nutrition-plans.use-case';
import { SubmitNutritionPlanUseCase } from '../../application/use-cases/plan/submit-nutrition-plan.use-case';
import { RecallNutritionPlanUseCase } from '../../application/use-cases/plan/recall-nutrition-plan.use-case';
import { AcceptNutritionPlanUseCase } from '../../application/use-cases/plan/accept-nutrition-plan.use-case';
import { RejectNutritionPlanUseCase } from '../../application/use-cases/plan/reject-nutrition-plan.use-case';
import { RequestNutritionPlanDeletionUseCase } from '../../application/use-cases/plan/request-nutrition-plan-deletion.use-case';
import { AcceptNutritionPlanDeletionUseCase } from '../../application/use-cases/plan/accept-nutrition-plan-deletion.use-case';
import { RejectNutritionPlanDeletionUseCase } from '../../application/use-cases/plan/reject-nutrition-plan-deletion.use-case';
import { GetPendingNutritionPlanUseCase } from '../../application/use-cases/plan/get-pending-nutrition-plan.use-case';
import {
  ActiveNutritionPlanAlreadyExistsException,
  ActiveNutritionPlanImmutableException,
  CancelledNutritionPlanImmutableException,
  CompletedNutritionPlanImmutableException,
  DuplicateNutritionCompletionException,
  EmptyMealsInNutritionDayException,
  EmptyNutritionDaysException,
  InitialNutritionPlanAlreadyExistsException,
  InvalidMealTypeException,
  InvalidNutritionDayNumberingException,
  InvalidNutritionDurationException,
  InvalidNutritionPlanTransitionException,
  NutritionConcurrencyConflictException,
  NutritionPlanDeletionPendingImmutableException,
  NutritionPlanNotFoundException,
  NutritionPlanPendingApprovalImmutableException,
  NutritionPlanVersionAlreadyExistsException,
  PendingNutritionPlanAlreadyExistsException,
  UnauthorizedNutritionActionException,
} from '../../domain/exceptions/nutrition-domain.exceptions';
import { AppError, NotFoundError } from '../../../../shared/exceptions/AppError';

export class NutritionPlanController {
  constructor(
    private readonly createNutritionPlanUseCase: CreateNutritionPlanUseCase,
    private readonly updateNutritionPlanUseCase: UpdateNutritionPlanUseCase,
    private readonly createNutritionPlanVersionUseCase: CreateNutritionPlanVersionUseCase,
    private readonly activateNutritionPlanUseCase: ActivateNutritionPlanUseCase,
    private readonly completeNutritionPlanUseCase: CompleteNutritionPlanUseCase,
    private readonly deleteDraftNutritionPlanUseCase: DeleteDraftNutritionPlanUseCase,
    private readonly getNutritionPlanUseCase: GetNutritionPlanUseCase,
    private readonly getActiveNutritionPlanUseCase: GetActiveNutritionPlanUseCase,
    private readonly listNutritionPlansUseCase: ListNutritionPlansUseCase,
    private readonly submitNutritionPlanUseCase: SubmitNutritionPlanUseCase,
    private readonly recallNutritionPlanUseCase: RecallNutritionPlanUseCase,
    private readonly acceptNutritionPlanUseCase: AcceptNutritionPlanUseCase,
    private readonly rejectNutritionPlanUseCase: RejectNutritionPlanUseCase,
    private readonly requestNutritionPlanDeletionUseCase: RequestNutritionPlanDeletionUseCase,
    private readonly acceptNutritionPlanDeletionUseCase: AcceptNutritionPlanDeletionUseCase,
    private readonly rejectNutritionPlanDeletionUseCase: RejectNutritionPlanDeletionUseCase,
    private readonly getPendingNutritionPlanUseCase: GetPendingNutritionPlanUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof NutritionPlanNotFoundException || error instanceof NotFoundError) {
      res.status(404).json({ success: false, message: (error as Error).message });
      return;
    }

    if (error instanceof UnauthorizedNutritionActionException) {
      res.status(403).json({ success: false, message: error.message });
      return;
    }

    if (
      error instanceof ActiveNutritionPlanAlreadyExistsException ||
      error instanceof DuplicateNutritionCompletionException ||
      error instanceof NutritionConcurrencyConflictException ||
      error instanceof InitialNutritionPlanAlreadyExistsException ||
      error instanceof PendingNutritionPlanAlreadyExistsException ||
      error instanceof NutritionPlanVersionAlreadyExistsException
    ) {
      res.status(409).json({ success: false, message: (error as Error).message });
      return;
    }

    if (
      error instanceof ActiveNutritionPlanImmutableException ||
      error instanceof CompletedNutritionPlanImmutableException ||
      error instanceof CancelledNutritionPlanImmutableException ||
      error instanceof NutritionPlanPendingApprovalImmutableException ||
      error instanceof NutritionPlanDeletionPendingImmutableException ||
      error instanceof InvalidNutritionPlanTransitionException
    ) {
      res.status(422).json({ success: false, message: (error as Error).message });
      return;
    }

    if (
      error instanceof InvalidNutritionDurationException ||
      error instanceof InvalidNutritionDayNumberingException ||
      error instanceof EmptyNutritionDaysException ||
      error instanceof EmptyMealsInNutritionDayException ||
      error instanceof InvalidMealTypeException
    ) {
      res.status(400).json({ success: false, message: (error as Error).message });
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

  public createPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const plan = await this.createNutritionPlanUseCase.execute(req.body, callerId);
      res.status(201).json({ success: true, data: plan });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public updatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.updateNutritionPlanUseCase.execute(
        {
          planId,
          ...(req.body || {}),
        },
        callerId,
      );
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan updated.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public createVersion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.createNutritionPlanVersionUseCase.execute(
        {
          planId,
          ...(req.body || {}),
        },
        callerId,
      );
      res.status(201).json({
        success: true,
        data: plan,
        message: 'New nutrition plan version created.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public activatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.activateNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan activated.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public completePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.completeNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan completed.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public deleteDraft = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      await this.deleteDraftNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        message: 'Draft nutrition plan deleted.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getAssignedPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const plan = await this.getActiveNutritionPlanUseCase.execute(callerId);
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.getNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({ success: true, data: plan });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public listPlans = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { coachingRelationshipId } = req.query;

      if (!coachingRelationshipId) {
        res.status(400).json({
          success: false,
          message: 'coachingRelationshipId query parameter is required to list nutrition plans.',
        });
        return;
      }

      const plans = await this.listNutritionPlansUseCase.execute(
        coachingRelationshipId as string,
        callerId,
      );

      res.status(200).json({
        success: true,
        data: plans,
        meta: { total: plans.length },
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public submitPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.submitNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan submitted to client for approval.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public recallPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.recallNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan submission recalled.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public acceptPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.acceptNutritionPlanUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan accepted and activated.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public rejectPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const { reason } = req.body || {};
      const plan = await this.rejectNutritionPlanUseCase.execute({ planId, reason }, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan revision requested.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public requestDeletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.requestNutritionPlanDeletionUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan retirement requested.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public acceptDeletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.acceptNutritionPlanDeletionUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan retirement accepted and plan cancelled.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public rejectDeletion = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { planId } = req.params;
      const plan = await this.rejectNutritionPlanDeletionUseCase.execute(planId, callerId);
      res.status(200).json({
        success: true,
        data: plan,
        message: 'Nutrition plan retirement declined.',
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getPendingPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const { relationshipId } = req.params;
      const plan = await this.getPendingNutritionPlanUseCase.execute(callerId, relationshipId);
      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getPendingPlanForClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const callerId = this.getAuthenticatedUserId(req);
      const plan = await this.getPendingNutritionPlanUseCase.execute(callerId);
      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
