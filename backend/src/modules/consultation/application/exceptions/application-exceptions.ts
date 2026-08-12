import { AppError } from '../../../../shared/exceptions/AppError';

export class ConsultationNotFoundException extends AppError {
  constructor(consultationId: string) {
    super(`Consultation with ID '${consultationId}' was not found`, 'CONSULTATION_NOT_FOUND', true);
  }
}

export class UnauthorizedConsultationParticipantException extends AppError {
  constructor(userId: string, consultationId: string) {
    super(
      `User '${userId}' is not an authorized participant on consultation '${consultationId}'`,
      'FORBIDDEN',
      true,
    );
  }
}

export class ConsultationAlreadyExistsException extends AppError {
  constructor(pipelineId: string) {
    super(
      `A consultation already exists for acquisition pipeline '${pipelineId}'`,
      'CONSULTATION_ALREADY_EXISTS',
      true,
    );
  }
}

export class PipelineNotFoundException extends AppError {
  constructor(pipelineId: string) {
    super(`Acquisition pipeline with ID '${pipelineId}' was not found`, 'PIPELINE_NOT_FOUND', true);
  }
}

export class PipelineNotAcceptedException extends AppError {
  constructor(pipelineId: string, status: string) {
    super(
      `Cannot create consultation for acquisition pipeline '${pipelineId}' in status '${status}'. Pipeline must be ACCEPTED.`,
      'PIPELINE_NOT_ACCEPTED',
      true,
    );
  }
}
