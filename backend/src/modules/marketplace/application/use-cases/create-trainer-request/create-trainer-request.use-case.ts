import { Result } from '../../../../../shared/result/Result';
import { IAcquisitionPipelineRepository } from '../../../domain/repositories/acquisition-pipeline.repository';
import { ProfileGateway } from '../../ports/profile-gateway.port';
import { CoachingGateway } from '../../ports/coaching-gateway.port';
import { TrainerEligibilityPolicy } from '../../../domain/policies/trainer-eligibility.policy';
import { DuplicateTrainerRequestPolicy } from '../../../domain/policies/duplicate-trainer-request.policy';
import { SingleActivePipelinePolicy } from '../../../domain/policies/single-active-pipeline.policy';
import { ActiveCoachingRelationshipExistsException } from '../../../domain/exceptions/active-coaching-relationship-exists.exception';
import { AcquisitionPipelineFactory } from '../../../domain/factories/acquisition-pipeline.factory';
import { CreateTrainerRequestDTO } from '../../dto/create-trainer-request.dto';
import { TrainerRequestResponseDTO } from '../../dto/trainer-request-response.dto';
import { AcquisitionPipelineMapper } from '../../mappers/acquisition-pipeline.mapper';
import { AppError } from '../../../../../shared/exceptions/AppError';

export class CreateTrainerRequestUseCase {
  private readonly eligibilityPolicy = new TrainerEligibilityPolicy();
  private readonly duplicatePolicy = new DuplicateTrainerRequestPolicy();
  private readonly singleActivePolicy = new SingleActivePipelinePolicy();

  constructor(
    private readonly pipelineRepo: IAcquisitionPipelineRepository,
    private readonly profileGateway: ProfileGateway,
    private readonly coachingGateway: CoachingGateway,
  ) {}

  public async execute(dto: CreateTrainerRequestDTO): Promise<Result<TrainerRequestResponseDTO>> {
    try {
      // 1. Interrogate Profile Gateway for trainer eligibility & snapshot
      const trainerInfo = await this.profileGateway.getTrainerEligibilityAndSnapshot(dto.trainerId);
      this.eligibilityPolicy.validate(
        dto.clientId,
        dto.trainerId,
        trainerInfo ? trainerInfo.eligibility : null,
      );

      // 2. Extract canonical Trainer User ID from resolved snapshot
      const trainerUserId = trainerInfo!.snapshot.trainerId;

      // 3. Interrogate Coaching Gateway for active relationship existence
      const hasCoachingRelationship = await this.coachingGateway.hasActiveRelationship(
        dto.clientId,
        trainerUserId,
      );
      if (hasCoachingRelationship) {
        throw new ActiveCoachingRelationshipExistsException(dto.clientId, trainerUserId);
      }

      // 4. Enforce DuplicateTrainerRequestPolicy for this Client-Trainer pair
      const existingPairPipeline = await this.pipelineRepo.findActivePipelineBetween(
        dto.clientId,
        trainerUserId,
      );
      this.duplicatePolicy.validate(
        dto.clientId,
        trainerUserId,
        existingPairPipeline
          ? {
              clientId: existingPairPipeline.clientId,
              trainerId: existingPairPipeline.trainerId,
              status: existingPairPipeline.status,
            }
          : null,
      );

      // 5. Enforce SingleActivePipelinePolicy for this Client across platform
      const existingActivePipeline = await this.pipelineRepo.findActivePipeline(dto.clientId);
      if (existingActivePipeline) {
        this.singleActivePolicy.validate(dto.clientId, trainerUserId, [
          {
            clientId: existingActivePipeline.clientId,
            trainerId: existingActivePipeline.trainerId,
            status: existingActivePipeline.status,
          },
        ]);
      }

      // 6. Construct Aggregate Root using Factory
      const factoryResult = AcquisitionPipelineFactory.createNewPipeline({
        clientId: dto.clientId,
        trainerId: trainerUserId,
        clientGoal: dto.goal,
        clientMessage: dto.message,
        trainerSnapshot: trainerInfo!.snapshot,
      });

      if (factoryResult.isFailure) {
        return Result.fail<TrainerRequestResponseDTO>(factoryResult.error);
      }

      const pipeline = factoryResult.getValue();

      // 6. Persist Aggregate whole via Repository Interface
      await this.pipelineRepo.save(pipeline);

      // 7. Map to Application DTO Contract
      return Result.ok<TrainerRequestResponseDTO>(AcquisitionPipelineMapper.toDTO(pipeline));
    } catch (error: unknown) {
      if (error instanceof AppError) {
        return Result.fail<TrainerRequestResponseDTO>(error.message);
      }
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while creating trainer request';
      return Result.fail<TrainerRequestResponseDTO>(message);
    }
  }
}
