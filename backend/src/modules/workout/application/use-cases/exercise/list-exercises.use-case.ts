import {
  ExerciseFilterOptions,
  IExerciseRepository,
} from '../../../domain/repositories/exercise.repository.interface';
import { ExerciseResponseDto } from '../../dtos/exercise.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';

export interface ListExercisesResultDto {
  exercises: ExerciseResponseDto[];
  total: number;
}

export class ListExercisesUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(options?: ExerciseFilterOptions): Promise<ListExercisesResultDto> {
    const [exercises, total] = await Promise.all([
      this.exerciseRepository.findMany(options),
      this.exerciseRepository.count(options),
    ]);

    return {
      exercises: exercises.map((ex) => WorkoutDtoMapper.toExerciseResponseDto(ex)),
      total,
    };
  }
}
