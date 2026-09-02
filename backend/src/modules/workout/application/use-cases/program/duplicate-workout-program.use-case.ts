import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';

export class DuplicateWorkoutProgramUseCase {
  constructor(private readonly workoutProgramRepository: IWorkoutProgramRepository) {}

  async execute(
    programId: string,
    requestingTrainerId: string,
    titleOverride?: string,
  ): Promise<WorkoutProgramResponseDto> {
    const program = await this.workoutProgramRepository.findById(programId);
    if (!program) {
      throw new WorkoutProgramNotFoundException(programId);
    }

    if (program.trainerId !== requestingTrainerId) {
      throw new UnauthorizedWorkoutActionException(
        'duplicate-program',
        'Trainer does not own this program.',
      );
    }

    const highestVersion = await this.workoutProgramRepository.findHighestVersionNumber(
      program.coachingRelationshipId,
    );
    const nextVersion = Math.max(program.version, highestVersion) + 1;

    const newVersion = program.createNewVersion({
      versionOverride: nextVersion,
      title: titleOverride || `${program.title} (v${nextVersion})`,
    });

    try {
      await this.workoutProgramRepository.save(newVersion);
      return WorkoutDtoMapper.toWorkoutProgramResponseDto(newVersion);
    } catch (error: any) {
      if (error.code === 11000) {
        const racedDraft = await this.workoutProgramRepository.findDraftByRelationshipId(
          program.coachingRelationshipId,
        );
        if (racedDraft) {
          return WorkoutDtoMapper.toWorkoutProgramResponseDto(racedDraft);
        }
      }
      throw error;
    }
  }
}
