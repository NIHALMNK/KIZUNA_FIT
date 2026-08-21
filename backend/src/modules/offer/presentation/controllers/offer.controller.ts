import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

import { CreateOfferUseCase } from '../../application/use-cases/create-offer.use-case';
import { SendOfferUseCase } from '../../application/use-cases/send-offer.use-case';
import { AcceptOfferUseCase } from '../../application/use-cases/accept-offer.use-case';
import { DeclineOfferUseCase } from '../../application/use-cases/decline-offer.use-case';
import { ExpireOfferUseCase } from '../../application/use-cases/expire-offer.use-case';
import { GetOfferUseCase } from '../../application/use-cases/get-offer.use-case';
import { GetOfferByConsultationUseCase } from '../../application/use-cases/get-offer-by-consultation.use-case';
import { GetOfferByPipelineUseCase } from '../../application/use-cases/get-offer-by-pipeline.use-case';
import { ListSentOffersUseCase } from '../../application/use-cases/list-sent-offers.use-case';
import { ListReceivedOffersUseCase } from '../../application/use-cases/list-received-offers.use-case';
import { OfferPresenter } from '../presenters/offer.presenter';
import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';

export class OfferController {
  constructor(
    private readonly createOfferUseCase: CreateOfferUseCase,
    private readonly sendOfferUseCase: SendOfferUseCase,
    private readonly acceptOfferUseCase: AcceptOfferUseCase,
    private readonly declineOfferUseCase: DeclineOfferUseCase,
    private readonly expireOfferUseCase: ExpireOfferUseCase,
    private readonly getOfferUseCase: GetOfferUseCase,
    private readonly getOfferByConsultationUseCase: GetOfferByConsultationUseCase,
    private readonly getOfferByPipelineUseCase: GetOfferByPipelineUseCase,
    private readonly listSentOffersUseCase: ListSentOffersUseCase,
    private readonly listReceivedOffersUseCase: ListReceivedOffersUseCase,
  ) {}

  public async create(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.createOfferUseCase.execute({
      consultationId: req.body.consultationId,
      trainerId: userId,
      planType: req.body.planType,
      trainerFee: req.body.trainerFee,
      currency: req.body.currency,
      trainerNotes: req.body.trainerNotes,
      sendImmediately: req.body.sendImmediately,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleCreated(res, result.getValue());
  }

  public async send(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const offerId = req.params.offerId;

    const result = await this.sendOfferUseCase.execute({
      offerId,
      trainerId: userId,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async accept(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const offerId = req.params.offerId;

    const result = await this.acceptOfferUseCase.execute({
      offerId,
      clientId: userId,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async decline(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const offerId = req.params.offerId;

    const result = await this.declineOfferUseCase.execute({
      offerId,
      clientId: userId,
      reason: req.body?.reason,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async expire(req: Request, res: Response): Promise<void> {
    const offerId = req.params.offerId;

    const result = await this.expireOfferUseCase.execute({
      offerId,
      requestedBy: req.auth?.userId,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async getById(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const offerId = req.params.offerId;

    const result = await this.getOfferUseCase.execute(offerId, userId, userRole);

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async getByConsultationId(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const consultationId = req.params.consultationId;

    const result = await this.getOfferByConsultationUseCase.execute(
      consultationId,
      userId,
      userRole,
    );

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async getByPipelineId(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const pipelineId = req.params.pipelineId;

    const result = await this.getOfferByPipelineUseCase.execute(pipelineId, userId, userRole);

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async listSent(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as CoachingOfferStatus) : undefined;
    const sort = req.query.sort as 'newest' | 'oldest' | 'expiring' | undefined;

    const result = await this.listSentOffersUseCase.execute({
      userId,
      userRole: userRole as 'CLIENT' | 'TRAINER' | 'ADMIN',
      page,
      limit,
      status,
      sort,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }

  public async listReceived(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    const userRole = req.auth?.role;
    if (!userId || !userRole) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const status = req.query.status ? (req.query.status as CoachingOfferStatus) : undefined;
    const sort = req.query.sort as 'newest' | 'oldest' | 'expiring' | undefined;

    const result = await this.listReceivedOffersUseCase.execute({
      userId,
      userRole: userRole as 'CLIENT' | 'TRAINER' | 'ADMIN',
      page,
      limit,
      status,
      sort,
    });

    if (result.isFailure) {
      OfferPresenter.handleError(res, result.error);
      return;
    }

    OfferPresenter.handleSuccess(res, result.getValue());
  }
}
