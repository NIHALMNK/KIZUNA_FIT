import { Request, Response } from 'express';
import { GetClientOverallProgressUseCase } from '../../application/use-cases/get-client-overall-progress.use-case';
import { GetRelationshipProgressUseCase } from '../../application/use-cases/get-relationship-progress.use-case';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  AppError,
} from '../../../../shared/exceptions/AppError';
import { ProgressGranularity } from '../../application/dtos/progress-analytics.dto';

export class ProgressController {
  constructor(
    private readonly getClientOverallProgressUseCase: GetClientOverallProgressUseCase,
    private readonly getRelationshipProgressUseCase: GetRelationshipProgressUseCase,
  ) {}

  private handleError(error: unknown, res: Response): void {
    if (error instanceof NotFoundError) {
      ApiResponse.error(res, error.message, ApiErrorCode.NOT_FOUND, 404);
      return;
    }
    if (error instanceof ForbiddenError) {
      ApiResponse.error(res, error.message, ApiErrorCode.FORBIDDEN, 403);
      return;
    }
    if (error instanceof ValidationError) {
      ApiResponse.error(res, error.message, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }
    if (error instanceof AppError) {
      ApiResponse.error(res, error.message, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    const message = (error as Error)?.message || 'An unexpected error occurred.';
    ApiResponse.error(res, message, ApiErrorCode.INTERNAL_SERVER_ERROR, 500);
  }

  public getMyProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const clientId = req.auth?.userId;

      if (!clientId) {
        ApiResponse.error(res, 'User not authenticated', ApiErrorCode.UNAUTHORIZED, 401);
        return;
      }

      const { fromDate, toDate, granularity } = req.query;

      const data = await this.getClientOverallProgressUseCase.execute(clientId, {
        fromDate: typeof fromDate === 'string' ? fromDate : undefined,
        toDate: typeof toDate === 'string' ? toDate : undefined,
        granularity:
          typeof granularity === 'string' ? (granularity as ProgressGranularity) : undefined,
      });

      ApiResponse.ok(res, data);
    } catch (error) {
      this.handleError(error, res);
    }
  };

  public getRelationshipProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.auth?.userId;

      if (!userId) {
        ApiResponse.error(res, 'User not authenticated', ApiErrorCode.UNAUTHORIZED, 401);
        return;
      }

      const relationshipId = req.params.relationshipId as string;
      if (!relationshipId) {
        ApiResponse.error(res, 'Relationship ID is required', ApiErrorCode.BAD_REQUEST, 400);
        return;
      }

      const { fromDate, toDate, granularity } = req.query;

      const data = await this.getRelationshipProgressUseCase.execute(relationshipId, userId, {
        fromDate: typeof fromDate === 'string' ? fromDate : undefined,
        toDate: typeof toDate === 'string' ? toDate : undefined,
        granularity:
          typeof granularity === 'string' ? (granularity as ProgressGranularity) : undefined,
      });

      ApiResponse.ok(res, data);
    } catch (error) {
      this.handleError(error, res);
    }
  };
}
