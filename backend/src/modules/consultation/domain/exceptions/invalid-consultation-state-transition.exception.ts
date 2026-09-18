import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidConsultationStateTransitionException extends AppError {
  constructor(currentStatus: string, targetAction: string) {
    super(
      `Cannot perform action '${targetAction}' on Consultation in current status '${currentStatus}'`,
      'INVALID_CONSULTATION_STATE_TRANSITION',
      true,
    );
  }
}
