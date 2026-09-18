import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidOfferStateTransitionException extends AppError {
  constructor(currentStatus: string, targetAction: string) {
    super(
      `Cannot perform action '${targetAction}' on CoachingOffer in current status '${currentStatus}'`,
      'INVALID_OFFER_STATE_TRANSITION',
      true,
    );
  }
}

export class OfferExpiredException extends AppError {
  constructor(offerId: string) {
    super(
      `CoachingOffer '${offerId}' has expired and can no longer be accepted.`,
      'OFFER_EXPIRED',
      true,
    );
  }
}

export class OfferImmutableException extends AppError {
  constructor(offerId: string, status: string) {
    super(
      `CoachingOffer '${offerId}' is in terminal status '${status}' and cannot be modified.`,
      'OFFER_IMMUTABLE',
      true,
    );
  }
}

export class OfferNotFoundException extends AppError {
  constructor(identifier: string) {
    super(`CoachingOffer '${identifier}' was not found.`, 'OFFER_NOT_FOUND', true);
  }
}

export class UnauthorizedOfferAccessException extends AppError {
  constructor(userId: string, offerId: string) {
    super(
      `User '${userId}' is not authorized to access or modify CoachingOffer '${offerId}'.`,
      'UNAUTHORIZED_OFFER_ACCESS',
      true,
    );
  }
}

export class ConsultationNotCompletedException extends AppError {
  constructor(consultationId: string, currentStatus: string) {
    super(
      `CoachingOffer can only be created for COMPLETED consultations. Consultation '${consultationId}' is currently '${currentStatus}'.`,
      'CONSULTATION_NOT_COMPLETED',
      true,
    );
  }
}

export class DuplicateOfferException extends AppError {
  constructor(referenceType: string, referenceId: string) {
    super(
      `A CoachingOffer already exists for ${referenceType} '${referenceId}'.`,
      'OFFER_ALREADY_EXISTS',
      true,
    );
  }
}
