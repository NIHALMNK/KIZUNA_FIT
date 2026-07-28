import { AcquisitionPipelineStatus } from '../enums/acquisition-pipeline-status.enum';

export interface PipelineStateCandidate {
  status: AcquisitionPipelineStatus;
}

/**
 * Specification verifying whether an AcquisitionPipeline is currently in an active (non-terminal) state.
 */
export class ActivePipelineSpecification {
  private static readonly TERMINAL_STATES = new Set<AcquisitionPipelineStatus>([
    AcquisitionPipelineStatus.REJECTED,
    AcquisitionPipelineStatus.WITHDRAWN,
    AcquisitionPipelineStatus.OFFER_DECLINED,
    AcquisitionPipelineStatus.CONVERTED,
    AcquisitionPipelineStatus.CLOSED,
  ]);

  public isSatisfiedBy(candidate: PipelineStateCandidate): boolean {
    if (!candidate || !candidate.status) {
      return false;
    }

    return !ActivePipelineSpecification.TERMINAL_STATES.has(candidate.status);
  }
}
