import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class ActivateWorkoutProgramUseCase {
  constructor(private readonly workoutProgramRepository: IWorkoutProgramRepository) {}

  async execute(
    programId: string,
    requestingTrainerId: string,
  ): Promise<WorkoutProgramResponseDto> {
    const program = await this.workoutProgramRepository.findById(programId);
    if (!program) {
      throw new WorkoutProgramNotFoundException(programId);
    }

    if (program.trainerId !== requestingTrainerId) {
      throw new UnauthorizedWorkoutActionException(
        'activate-program',
        'Trainer does not own this program.',
      );
    }

    // Check if another program is already active for this coaching relationship (Rule WP-3)
    const existingActive = await this.workoutProgramRepository.findActiveByRelationshipId(
      program.coachingRelationshipId,
    );
    if (existingActive && existingActive.id !== program.id) {
      // Complete previous active program to maintain the invariant: exactly 1 active program per relationship
      existingActive.complete();
      await this.workoutProgramRepository.save(existingActive);
    }

    const activateResult = program.activate();
    if (activateResult.isFailure) {
      throw new ValidationError(activateResult.error || 'Failed to activate program.');
    }

    await this.workoutProgramRepository.save(program);
    return WorkoutDtoMapper.toWorkoutProgramResponseDto(program);
  }
}
