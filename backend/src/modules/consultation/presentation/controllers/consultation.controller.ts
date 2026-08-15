import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

import { CreateConsultationUseCase } from '../../application/use-cases/create-consultation.use-case';
import { BookConsultationSlotUseCase } from '../../application/use-cases/book-consultation-slot.use-case';
import { ScheduleConsultationUseCase } from '../../application/use-cases/schedule-consultation.use-case';
import { ConfirmConsultationScheduleUseCase } from '../../application/use-cases/confirm-consultation-schedule.use-case';
import { RescheduleConsultationUseCase } from '../../application/use-cases/reschedule-consultation.use-case';
import { CancelConsultationUseCase } from '../../application/use-cases/cancel-consultation.use-case';
import { CompleteConsultationUseCase } from '../../application/use-cases/complete-consultation.use-case';
import { MarkConsultationNoShowUseCase } from '../../application/use-cases/mark-consultation-no-show.use-case';
import { GetConsultationUseCase } from '../../application/use-cases/get-consultation.use-case';
import { GetConsultationByPipelineUseCase } from '../../application/use-cases/get-consultation-by-pipeline.use-case';
import { GetUpcomingConsultationsUseCase } from '../../application/use-cases/get-upcoming-consultations.use-case';
import { GetConsultationHistoryUseCase } from '../../application/use-cases/get-consultation-history.use-case';
import { GetConsultationByRoomIdUseCase } from '../../application/use-cases/get-consultation-by-room-id.use-case';

import { ConsultationPresenter } from '../presenters/consultation.presenter';
import { CancellationActor } from '../../domain/enums/cancellation-actor.enum';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';

export class ConsultationController {
  constructor(
    private readonly createConsultationUseCase: CreateConsultationUseCase,
    private readonly bookConsultationSlotUseCase: BookConsultationSlotUseCase,
    private readonly scheduleConsultationUseCase: ScheduleConsultationUseCase,
    private readonly confirmConsultationScheduleUseCase: ConfirmConsultationScheduleUseCase,
    private readonly cancelConsultationUseCase: CancelConsultationUseCase,
    private readonly completeConsultationUseCase: CompleteConsultationUseCase,
    private readonly markConsultationNoShowUseCase: MarkConsultationNoShowUseCase,
    private readonly getConsultationUseCase: GetConsultationUseCase,
    private readonly getConsultationByPipelineUseCase: GetConsultationByPipelineUseCase,
    private readonly getUpcomingConsultationsUseCase: GetUpcomingConsultationsUseCase,
    private readonly getConsultationHistoryUseCase: GetConsultationHistoryUseCase,
    private readonly getConsultationByRoomIdUseCase: GetConsultationByRoomIdUseCase,
    private readonly rescheduleConsultationUseCase: RescheduleConsultationUseCase,
  ) {}

  public async create(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.createConsultationUseCase.execute({
      acquisitionPipelineId: req.body.acquisitionPipelineId,
      userId,
      scheduledStartAt: new Date(req.body.scheduledStartAt),
      scheduledEndAt: new Date(req.body.scheduledEndAt),
      timezone: req.body.timezone,
      platform: req.body.platform,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleCreated(res, result.getValue());
  }

  public async bookSlot(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.bookConsultationSlotUseCase.execute({
      consultationId,
      clientId: userId,
      scheduledStartAt: new Date(req.body.scheduledStartAt),
      scheduledEndAt: new Date(req.body.scheduledEndAt),
      timezone: req.body.timezone,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async schedule(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.scheduleConsultationUseCase.execute({
      consultationId,
      userId,
      scheduledStartAt: new Date(req.body.scheduledStartAt),
      scheduledEndAt: new Date(req.body.scheduledEndAt),
      timezone: req.body.timezone,
      platform: req.body.platform,
      meetingDetails: req.body.meetingDetails,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async confirmSchedule(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.confirmConsultationScheduleUseCase.execute({
      consultationId,
      trainerId: userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async reschedule(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.rescheduleConsultationUseCase.execute({
      consultationId,
      userId,
      scheduledStartAt: new Date(req.body.scheduledStartAt),
      scheduledEndAt: new Date(req.body.scheduledEndAt),
      timezone: req.body.timezone,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async cancel(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;
    const cancelledBy =
      userRole === 'CLIENT' ? CancellationActor.CLIENT : CancellationActor.TRAINER;

    const result = await this.cancelConsultationUseCase.execute({
      consultationId,
      userId,
      cancelledBy,
      reason: req.body.reason,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async complete(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.completeConsultationUseCase.execute({
      consultationId,
      trainerId: userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async markNoShow(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.markConsultationNoShowUseCase.execute({
      consultationId,
      trainerId: userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.getConsultationUseCase.execute({
      consultationId,
      userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async getByPipelineId(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const pipelineId = req.params.pipelineId;

    const result = await this.getConsultationByPipelineUseCase.execute({
      acquisitionPipelineId: pipelineId,
      userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async getByRoomId(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const roomId = req.params.roomId;

    const result = await this.getConsultationByRoomIdUseCase.execute({
      roomId,
      userId,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async listUpcoming(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const isTrainer = userRole === 'TRAINER';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as ConsultationStatus) : undefined;
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await this.getUpcomingConsultationsUseCase.execute({
      userId,
      isTrainer,
      status,
      page,
      limit,
      sort,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }

  public async listHistory(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const isTrainer = userRole === 'TRAINER';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as ConsultationStatus) : undefined;
    const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

    const result = await this.getConsultationHistoryUseCase.execute({
      userId,
      isTrainer,
      status,
      page,
      limit,
      sort,
    });

    if (result.isFailure) {
      ConsultationPresenter.handleError(res, result.error);
      return;
    }

    ConsultationPresenter.handleSuccess(res, result.getValue());
  }
}
