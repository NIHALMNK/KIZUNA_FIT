import { IWorkoutCompletionRepository } from '../../../domain/repositories/workout-completion.repository.interface';
import { WorkoutCompletionResponseDto } from '../../dtos/workout-completion.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutCompletionNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';

export class GetWorkoutCompletionUseCase {
  constructor(private readonly workoutCompletionRepository: IWorkoutCompletionRepository) {}

  async execute(
    completionId: string,
    requestingUserId: string,
  ): Promise<WorkoutCompletionResponseDto> {
    const completion = await this.workoutCompletionRepository.findById(completionId);
    if (!completion) {
      throw new WorkoutCompletionNotFoundException(completionId);
    }

    if (completion.clientId !== requestingUserId && completion.trainerId !== requestingUserId) {
      throw new UnauthorizedWorkoutActionException(
        'view-completion',
        'User does not belong to this workout completion record.',
      );
    }

    return WorkoutDtoMapper.toWorkoutCompletionResponseDto(completion);
  }
}
