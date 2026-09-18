import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidPipelineTransitionException extends AppError {
  constructor(currentStatus: string, targetAction: string) {
    super(
      `Cannot perform action '${targetAction}' on AcquisitionPipeline in current status '${currentStatus}'`,
      'REQUEST_ALREADY_PROCESSED',
      true,
    );
  }
}
