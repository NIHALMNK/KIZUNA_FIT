import { AppError } from '../../../../shared/exceptions/AppError';

export class DuplicateTrainerRequestException extends AppError {
  constructor(clientId: string, trainerId: string) {
    super(
      `An active or pending acquisition pipeline already exists between client ${clientId} and trainer ${trainerId}`,
      'REQUEST_ALREADY_EXISTS',
      true,
    );
  }
}
