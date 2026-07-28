import { AppError } from '../../../../shared/exceptions/AppError';

export class TrainerNotEligibleException extends AppError {
  constructor(trainerId: string, reason: string, code: string = 'TRAINER_NOT_VERIFIED') {
    super(`Trainer ${trainerId} is not eligible to receive requests: ${reason}`, code, true);
  }
}
