export interface PipelineParticipants {
  clientId: string;
  trainerId: string;
}

/**
 * Specification verifying if a specific user is an authorized participant
 * (either the Client or Trainer) of an AcquisitionPipeline.
 */
export class PipelineOwnershipSpecification {
  public isSatisfiedBy(pipeline: PipelineParticipants, userId: string): boolean {
    if (!pipeline || !userId) {
      return false;
    }

    return pipeline.clientId === userId || pipeline.trainerId === userId;
  }

  public isClient(pipeline: PipelineParticipants, userId: string): boolean {
    return pipeline?.clientId === userId;
  }

  public isTrainer(pipeline: PipelineParticipants, userId: string): boolean {
    return pipeline?.trainerId === userId;
  }
}
