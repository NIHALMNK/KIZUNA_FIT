import { AcquisitionPipelineStatus } from '../enums/acquisition-pipeline-status.enum';
import { ActivePipelineSpecification } from '../specifications/active-pipeline.specification';
import { DuplicateTrainerRequestException } from '../exceptions/duplicate-trainer-request.exception';

export interface PairPipelineSummary {
  clientId: string;
  trainerId: string;
  status: AcquisitionPipelineStatus;
}

/**
 * Policy enforcing that only ONE active or pending request can exist for a specific Client-Trainer pair.
 */
export class DuplicateTrainerRequestPolicy {
  private readonly activeSpec = new ActivePipelineSpecification();

  public validate(
    clientId: string,
    trainerId: string,
    existingPipelineForPair: PairPipelineSummary | null,
  ): void {
    if (existingPipelineForPair && this.activeSpec.isSatisfiedBy(existingPipelineForPair)) {
      throw new DuplicateTrainerRequestException(clientId, trainerId);
    }
  }
}
