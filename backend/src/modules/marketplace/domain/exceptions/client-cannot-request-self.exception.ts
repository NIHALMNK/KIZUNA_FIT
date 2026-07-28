import { AppError } from '../../../../shared/exceptions/AppError';

export class ClientCannotRequestSelfException extends AppError {
  constructor(userId: string) {
    super(`User ${userId} cannot submit a coaching request to themselves`, 'FORBIDDEN', true);
  }
}
