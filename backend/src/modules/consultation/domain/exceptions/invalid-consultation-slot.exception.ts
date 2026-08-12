import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidConsultationSlotException extends AppError {
  constructor(message: string) {
    super(message, 'INVALID_CONSULTATION_SLOT', true);
  }
}
