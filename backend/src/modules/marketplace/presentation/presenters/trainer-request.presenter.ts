import { Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

export class TrainerRequestPresenter {
  public static handleSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    ApiResponse.ok(res, data, statusCode);
  }

  public static handleCreated<T>(res: Response, data: T): void {
    ApiResponse.created(res, data);
  }

  public static handleError(res: Response, errorMessage: string): void {
    if (
      errorMessage.includes('TRAINER_NOT_FOUND') ||
      errorMessage.includes('TRAINER_REQUEST_NOT_FOUND')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    if (errorMessage.includes('TRAINER_NOT_AVAILABLE')) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    if (errorMessage.includes('TRAINER_NOT_VERIFIED')) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.VALIDATION_ERROR, 422);
      return;
    }

    if (
      errorMessage.includes('REQUEST_ALREADY_EXISTS') ||
      errorMessage.includes('ACTIVE_COACHING_RELATIONSHIP_EXISTS') ||
      errorMessage.includes('REQUEST_ALREADY_PROCESSED') ||
      errorMessage.includes('REQUEST_NOT_ACCEPTED') ||
      errorMessage.includes('REQUEST_ALREADY_CLOSED')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.CONFLICT, 409);
      return;
    }

    if (errorMessage.includes('FORBIDDEN') || errorMessage.includes('UNAUTHORIZED')) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.FORBIDDEN, 403);
      return;
    }

    // Default HTTP 400 Bad Request fallback
    ApiResponse.error(res, errorMessage, ApiErrorCode.BAD_REQUEST, 400);
  }
}
