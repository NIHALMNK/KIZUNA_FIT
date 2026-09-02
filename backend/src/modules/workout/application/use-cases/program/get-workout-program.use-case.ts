import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';

export class GetWorkoutProgramUseCase {
  constructor(private readonly workoutProgramRepository: IWorkoutProgramRepository) {}

  async execute(programId: string, requestingUserId: string): Promise<WorkoutProgramResponseDto> {
    const program = await this.workoutProgramRepository.findById(programId);
    if (!program) {
      throw new WorkoutProgramNotFoundException(programId);
    }

    if (program.trainerId !== requestingUserId && program.clientId !== requestingUserId) {
      throw new UnauthorizedWorkoutActionException(
        'view-program',
        'User does not belong to this workout program.',
      );
    }

    return WorkoutDtoMapper.toWorkoutProgramResponseDto(program);
  }
}
