import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { ExerciseResponseDto } from '../../dtos/exercise.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { ExerciseNotFoundException } from '../../../domain/exceptions/workout-domain.exceptions';

export class GetExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(exerciseId: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }
    return WorkoutDtoMapper.toExerciseResponseDto(exercise);
  }
}
