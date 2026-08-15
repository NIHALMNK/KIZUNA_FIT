import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';
import { CreateTrainerRequestUseCase } from '../../application/use-cases/create-trainer-request/create-trainer-request.use-case';
import { GetTrainerRequestsUseCase } from '../../application/use-cases/get-trainer-requests/get-trainer-requests.use-case';
import { GetTrainerRequestUseCase } from '../../application/use-cases/get-trainer-request/get-trainer-request.use-case';
import { GetPendingTrainerRequestsUseCase } from '../../application/use-cases/get-pending-trainer-requests/get-pending-trainer-requests.use-case';
import { GetTrainerRequestHistoryUseCase } from '../../application/use-cases/get-trainer-request-history/get-trainer-request-history.use-case';
import { AcceptTrainerRequestUseCase } from '../../application/use-cases/accept-trainer-request/accept-trainer-request.use-case';
import { RejectTrainerRequestUseCase } from '../../application/use-cases/reject-trainer-request/reject-trainer-request.use-case';
import { WithdrawTrainerRequestUseCase } from '../../application/use-cases/withdraw-trainer-request/withdraw-trainer-request.use-case';
import { CloseTrainerRequestUseCase } from '../../application/use-cases/close-trainer-request/close-trainer-request.use-case';
import { SwitchTrainerUseCase } from '../../application/use-cases/switch-trainer/switch-trainer.use-case';
import { TrainerRequestPresenter } from '../presenters/trainer-request.presenter';
import { AcquisitionPipelineStatus } from '../../domain/enums/acquisition-pipeline-status.enum';

export class TrainerRequestController {
  constructor(
    private readonly createTrainerRequestUseCase: CreateTrainerRequestUseCase,
    private readonly getTrainerRequestsUseCase: GetTrainerRequestsUseCase,
    private readonly getTrainerRequestUseCase: GetTrainerRequestUseCase,
    private readonly getPendingTrainerRequestsUseCase: GetPendingTrainerRequestsUseCase,
    private readonly getTrainerRequestHistoryUseCase: GetTrainerRequestHistoryUseCase,
    private readonly acceptTrainerRequestUseCase: AcceptTrainerRequestUseCase,
    private readonly rejectTrainerRequestUseCase: RejectTrainerRequestUseCase,
    private readonly withdrawTrainerRequestUseCase: WithdrawTrainerRequestUseCase,
    private readonly closeTrainerRequestUseCase: CloseTrainerRequestUseCase,
    private readonly switchTrainerUseCase: SwitchTrainerUseCase,
  ) {}

  public async create(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.createTrainerRequestUseCase.execute({
      clientId: userId,
      trainerId: req.body.trainerId,
      goal: req.body.goal,
      message: req.body.message,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleCreated(res, result.getValue());
  }

  public async list(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const isTrainer = userRole === 'TRAINER';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as AcquisitionPipelineStatus) : undefined;
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await this.getTrainerRequestsUseCase.execute({
      userId,
      isTrainer,
      status,
      page,
      limit,
      sort,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const requestId = req.params.requestId || req.params.id;

    const result = await this.getTrainerRequestUseCase.execute({
      requestId,
      userId,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async getPending(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const isTrainer = userRole === 'TRAINER';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await this.getPendingTrainerRequestsUseCase.execute({
      userId,
      isTrainer,
      page,
      limit,
      sort,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async getHistory(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const isTrainer = userRole === 'TRAINER';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as AcquisitionPipelineStatus) : undefined;
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await this.getTrainerRequestHistoryUseCase.execute({
      userId,
      isTrainer,
      status,
      page,
      limit,
      sort,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async accept(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const requestId = req.params.requestId || req.params.id;

    const result = await this.acceptTrainerRequestUseCase.execute({
      requestId,
      trainerId: userId,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async reject(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const requestId = req.params.requestId || req.params.id;

    const result = await this.rejectTrainerRequestUseCase.execute({
      requestId,
      trainerId: userId,
      reason: req.body.reason,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async withdraw(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const requestId = req.params.requestId || req.params.id;

    const result = await this.withdrawTrainerRequestUseCase.execute({
      requestId,
      clientId: userId,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async close(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const requestId = req.params.requestId || req.params.id;

    const result = await this.closeTrainerRequestUseCase.execute({
      requestId,
      trainerId: userId,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    TrainerRequestPresenter.handleSuccess(res, result.getValue());
  }

  public async switchTrainer(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.switchTrainerUseCase.execute({
      clientId: userId,
      reason: req.body?.reason,
    });

    if (result.isFailure) {
      TrainerRequestPresenter.handleError(res, result.error);
      return;
    }

    ApiResponse.ok(res, result.getValue());
  }
}
