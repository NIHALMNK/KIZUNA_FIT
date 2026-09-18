import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { ExerciseResponseDto, UpdateExerciseDto } from '../../dtos/exercise.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  ExerciseNotFoundException,
  UnauthorizedWorkoutActionException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';
import { isValidYouTubeUrl } from '../../../domain/utils/youtube.utils';

export class UpdateExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(
    exerciseId: string,
    dto: UpdateExerciseDto,
    requestingUserId?: string,
    requestingUserRole?: string,
  ): Promise<ExerciseResponseDto> {
    if (dto.media?.videoUrl && !isValidYouTubeUrl(dto.media.videoUrl)) {
      throw new ValidationError(
        'Invalid YouTube URL. Please provide a valid YouTube video link (e.g., https://www.youtube.com/watch?v=..., https://youtu.be/..., or https://www.youtube.com/shorts/...).',
      );
    }

    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    if (requestingUserId && !exercise.canBeEditedBy(requestingUserId, requestingUserRole)) {
      throw new UnauthorizedWorkoutActionException(
        'update-exercise',
        'You do not have permission to edit this exercise.',
      );
    }

    const updateResult = exercise.updateDetails(dto);
    if (updateResult.isFailure) {
      throw new ValidationError(updateResult.error || 'Failed to update exercise.');
    }

    await this.exerciseRepository.save(exercise);
    return WorkoutDtoMapper.toExerciseResponseDto(exercise);
  }
}
