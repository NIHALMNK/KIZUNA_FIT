import { Result } from '../../../../shared/result/Result';
import { AcquisitionPipeline } from '../aggregates/acquisition-pipeline.aggregate';
import { TrainerRequest } from '../entities/trainer-request.entity';
import {
  TrainerSnapshot,
  TrainerSnapshotProps,
} from '../value-objects/trainer-snapshot.value-object';

export interface CreateAcquisitionPipelineInput {
  clientId: string;
  trainerId: string;
  clientGoal: string;
  clientMessage?: string;
  trainerSnapshot: TrainerSnapshotProps;
}

/**
 * Domain Factory for constructing fully initialized AcquisitionPipeline Aggregate Roots
 * with validated child entities and value objects.
 */
export class AcquisitionPipelineFactory {
  public static createNewPipeline(
    input: CreateAcquisitionPipelineInput,
  ): Result<AcquisitionPipeline> {
    const requestResult = TrainerRequest.create({
      clientGoal: input.clientGoal,
      clientMessage: input.clientMessage,
    });

    if (requestResult.isFailure) {
      return Result.fail<AcquisitionPipeline>(
        `Failed to create TrainerRequest: ${requestResult.error}`,
      );
    }

    const snapshotResult = TrainerSnapshot.create(input.trainerSnapshot);

    if (snapshotResult.isFailure) {
      return Result.fail<AcquisitionPipeline>(
        `Failed to create TrainerSnapshot: ${snapshotResult.error}`,
      );
    }

    return AcquisitionPipeline.create({
      clientId: input.clientId,
      trainerId: input.trainerId,
      trainerRequest: requestResult.getValue(),
      trainerSnapshot: snapshotResult.getValue(),
    });
  }
}
