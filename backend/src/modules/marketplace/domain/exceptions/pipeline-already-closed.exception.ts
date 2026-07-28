import { AppError } from '../../../../shared/exceptions/AppError';

export class PipelineAlreadyClosedException extends AppError {
  constructor(pipelineId: string) {
    super(
      `AcquisitionPipeline ${pipelineId} is already closed or in terminal status`,
      'REQUEST_ALREADY_CLOSED',
      true,
    );
  }
}
