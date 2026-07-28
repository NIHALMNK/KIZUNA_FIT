import { AcquisitionPipelineStatus } from '../enums/acquisition-pipeline-status.enum';
import { ActivePipelineSpecification } from '../specifications/active-pipeline.specification';
import { DuplicateTrainerRequestException } from '../exceptions/duplicate-trainer-request.exception';

export interface PipelineSummary {
  clientId: string;
  trainerId: string;
  status: AcquisitionPipelineStatus;
}

/**
 * Policy enforcing that a Client can have only ONE active AcquisitionPipeline at a time.
 */
export class SingleActivePipelinePolicy {
  private readonly activeSpec = new ActivePipelineSpecification();

  public validate(clientId: string, trainerId: string, existingPipelines: PipelineSummary[]): void {
    for (const pipeline of existingPipelines) {
      if (pipeline.clientId === clientId && this.activeSpec.isSatisfiedBy(pipeline)) {
        throw new DuplicateTrainerRequestException(clientId, trainerId);
      }
    }
  }
}
