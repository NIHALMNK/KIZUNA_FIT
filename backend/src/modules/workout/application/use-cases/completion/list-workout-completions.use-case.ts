import {
  IWorkoutCompletionRepository,
  WorkoutCompletionFilterOptions,
} from '../../../domain/repositories/workout-completion.repository.interface';
import { WorkoutCompletionResponseDto } from '../../dtos/workout-completion.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';

export interface ListWorkoutCompletionsResultDto {
  completions: WorkoutCompletionResponseDto[];
  total: number;
}

export class ListWorkoutCompletionsUseCase {
  constructor(private readonly workoutCompletionRepository: IWorkoutCompletionRepository) {}

  async execute(
    options?: WorkoutCompletionFilterOptions,
  ): Promise<ListWorkoutCompletionsResultDto> {
    const [completions, total] = await Promise.all([
      this.workoutCompletionRepository.findMany(options),
      this.workoutCompletionRepository.count(options),
    ]);

    return {
      completions: completions.map(WorkoutDtoMapper.toWorkoutCompletionResponseDto),
      total,
    };
  }
}
