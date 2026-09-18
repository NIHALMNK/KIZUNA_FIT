import { AppError } from '../../../../shared/exceptions/AppError';

export class RequestNotAcceptedException extends AppError {
  constructor(pipelineId: string, currentStatus: string) {
    super(
      `Cannot close AcquisitionPipeline ${pipelineId} because it is in status '${currentStatus}' instead of 'ACCEPTED'`,
      'REQUEST_NOT_ACCEPTED',
      true,
    );
  }
}
