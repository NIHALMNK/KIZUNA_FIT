import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { IWorkoutCoachingGateway } from '../../../domain/repositories/workout-coaching.gateway.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutProgram } from '../../../domain/aggregates/workout-program.aggregate';
import { WorkoutSchedule } from '../../../domain/value-objects/workout-schedule.value-object';
import { WorkoutGoal, WorkoutProgramStatus } from '../../../domain/enums';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { UnauthorizedWorkoutActionException } from '../../../domain/exceptions/workout-domain.exceptions';
import { NotFoundError } from '../../../../../shared/exceptions/AppError';

export class GetOrCreateDraftProgramUseCase {
  constructor(
    private readonly workoutProgramRepository: IWorkoutProgramRepository,
    private readonly workoutCoachingGateway: IWorkoutCoachingGateway,
  ) {}

  async execute(
    coachingRelationshipId: string,
    requestingTrainerId: string,
  ): Promise<WorkoutProgramResponseDto> {
    const coachingAccess =
      await this.workoutCoachingGateway.getRelationshipAccess(coachingRelationshipId);
    if (!coachingAccess) {
      throw new NotFoundError(`Coaching relationship '${coachingRelationshipId}' not found.`);
    }

    if (coachingAccess.trainerId !== requestingTrainerId) {
      throw new UnauthorizedWorkoutActionException(
        'edit-draft-program',
        'Trainer does not own this coaching relationship.',
      );
    }

    // 1. Return existing editable DRAFT if one exists for this relationship
    const existingDraft =
      await this.workoutProgramRepository.findDraftByRelationshipId(coachingRelationshipId);
    if (existingDraft) {
      return WorkoutDtoMapper.toWorkoutProgramResponseDto(existingDraft);
    }

    // 2. Fetch active program to clone and determine the highest version
    const activeProgram =
      await this.workoutProgramRepository.findActiveByRelationshipId(coachingRelationshipId);
    const highestVersion =
      await this.workoutProgramRepository.findHighestVersionNumber(coachingRelationshipId);
    const nextVersion = Math.max(activeProgram?.version || 0, highestVersion || 0) + 1;

    let newDraft: WorkoutProgram;

    if (activeProgram) {
      newDraft = activeProgram.createNewVersion({
        versionOverride: nextVersion,
        title: `${activeProgram.title} (v${nextVersion})`,
      });
    } else {
      const scheduleResult = WorkoutSchedule.create({ weeks: 4, sessionsPerWeek: 3 });
      const newDraftResult = WorkoutProgram.create({
        coachingRelationshipId,
        trainerId: coachingAccess.trainerId,
        clientId: coachingAccess.clientId,
        version: nextVersion,
        title: 'Customized Training Plan',
        description: null,
        goal: WorkoutGoal.GENERAL_FITNESS,
        schedule: scheduleResult.getValue(),
        weeks: [],
        status: WorkoutProgramStatus.DRAFT,
      });

      if (newDraftResult.isFailure) {
        throw new Error(newDraftResult.error || 'Failed to create initial workout draft.');
      }
      newDraft = newDraftResult.getValue();
    }

    try {
      await this.workoutProgramRepository.save(newDraft);
      return WorkoutDtoMapper.toWorkoutProgramResponseDto(newDraft);
    } catch (error: any) {
      if (error.code === 11000) {
        // Concurrency duplicate-key race: another request inserted draft simultaneously
        const racedDraft =
          await this.workoutProgramRepository.findDraftByRelationshipId(coachingRelationshipId);
        if (racedDraft) {
          return WorkoutDtoMapper.toWorkoutProgramResponseDto(racedDraft);
        }
      }
      throw error;
    }
  }
}
