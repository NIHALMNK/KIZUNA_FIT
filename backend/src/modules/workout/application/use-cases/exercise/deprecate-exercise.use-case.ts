import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { ExerciseResponseDto } from '../../dtos/exercise.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { ExerciseNotFoundException } from '../../../domain/exceptions/workout-domain.exceptions';

export class DeprecateExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(exerciseId: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    exercise.deprecate();
    await this.exerciseRepository.save(exercise);

    return WorkoutDtoMapper.toExerciseResponseDto(exercise);
  }
}
