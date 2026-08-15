import { AppError } from '../../../../shared/exceptions/AppError';

export class TrainerRequestNotFoundException extends AppError {
  constructor(requestId: string) {
    super(
      `Trainer request/pipeline with ID '${requestId}' was not found`,
      'TRAINER_REQUEST_NOT_FOUND',
      true,
    );
  }
}

export class UnauthorizedParticipantException extends AppError {
  constructor(userId: string, requestId: string) {
    super(
      `User '${userId}' is not an authorized participant on trainer request '${requestId}'`,
      'FORBIDDEN',
      true,
    );
  }
}
