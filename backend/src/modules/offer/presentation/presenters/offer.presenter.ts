import { Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

export class OfferPresenter {
  public static handleSuccess<T>(res: Response, data: T, statusCode: number = 200): void {
    ApiResponse.ok(res, data, statusCode);
  }

  public static handleCreated<T>(res: Response, data: T): void {
    ApiResponse.created(res, data);
  }

  public static handleError(res: Response, errorMessage: string): void {
    if (
      errorMessage.includes('OFFER_NOT_FOUND') ||
      errorMessage.includes('Consultation with ID') ||
      errorMessage.includes('was not found')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    if (
      errorMessage.includes('UNAUTHORIZED_OFFER_ACCESS') ||
      errorMessage.includes('FORBIDDEN') ||
      errorMessage.includes('not authorized')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.FORBIDDEN, 403);
      return;
    }

    if (
      errorMessage.includes('OFFER_ALREADY_EXISTS') ||
      errorMessage.includes('already exists') ||
      errorMessage.includes('CONSULTATION_NOT_COMPLETED') ||
      errorMessage.includes('INVALID_OFFER_STATE_TRANSITION') ||
      errorMessage.includes('OFFER_IMMUTABLE') ||
      errorMessage.includes('OFFER_EXPIRED')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.CONFLICT, 409);
      return;
    }

    if (
      errorMessage.includes('Validation failed') ||
      errorMessage.includes('must be') ||
      errorMessage.includes('durationDays') ||
      errorMessage.includes('trainerFee') ||
      errorMessage.includes('totalAmount')
    ) {
      ApiResponse.error(res, errorMessage, ApiErrorCode.VALIDATION_ERROR, 422);
      return;
    }

    // Default HTTP 400 Bad Request fallback
    ApiResponse.error(res, errorMessage, ApiErrorCode.BAD_REQUEST, 400);
  }
}
