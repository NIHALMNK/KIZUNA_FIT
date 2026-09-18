import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { AppError } from '../../../../../shared/exceptions/AppError';

export class GetActiveWorkoutProgramUseCase {
  constructor(private readonly workoutProgramRepository: IWorkoutProgramRepository) {}

  async executeByRelationship(
    coachingRelationshipId: string,
  ): Promise<WorkoutProgramResponseDto | null> {
    const program =
      await this.workoutProgramRepository.findActiveByRelationshipId(coachingRelationshipId);
    if (!program) {
      return null;
    }
    return WorkoutDtoMapper.toWorkoutProgramResponseDto(program);
  }

  async executeByClient(clientId: string): Promise<WorkoutProgramResponseDto | null> {
    const program = await this.workoutProgramRepository.findActiveByClientId(clientId);
    if (!program) {
      return null;
    }
    return WorkoutDtoMapper.toWorkoutProgramResponseDto(program);
  }
}
