import { Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

export class ConsultationPresenter {
  public static handleSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    ApiResponse.ok(res, data, statusCode);
  }

  public static handleCreated<T>(res: Response, data: T): void {
    ApiResponse.created(res, data);
  }

  public static handleError(res: Response, errorMessage: string): void {
    if (
      errorMessage.includes('CONSULTATION_NOT_FOUND') ||
      errorMessage.includes('PIPELINE_NOT_FOUND') ||
      errorMessage.includes('was not found')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    if (
      errorMessage.includes('FORBIDDEN') ||
      errorMessage.includes('UNAUTHORIZED') ||
      errorMessage.includes('not an authorized participant')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.FORBIDDEN, 403);
      return;
    }

    if (
      errorMessage.includes('CONSULTATION_ALREADY_EXISTS') ||
      errorMessage.includes('already exists for acquisition pipeline') ||
      errorMessage.includes('PIPELINE_NOT_ACCEPTED') ||
      errorMessage.includes('Cannot transition consultation state') ||
      errorMessage.includes('Invalid consultation state transition')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.CONFLICT, 409);
      return;
    }

    if (
      errorMessage.includes('INVALID_SLOT') ||
      errorMessage.includes('Validation failed') ||
      errorMessage.includes('duration')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.VALIDATION_ERROR, 422);
      return;
    }

    // Default HTTP 400 Bad Request fallback
    ApiResponse.error(res, errorMessage, ApiErrorCode.BAD_REQUEST, 400);
  }
}
