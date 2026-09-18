import {
  IWorkoutProgramRepository,
  WorkoutProgramFilterOptions,
} from '../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgramResponseDto } from '../../dtos/workout-program.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';

export interface ListWorkoutProgramsResultDto {
  programs: WorkoutProgramResponseDto[];
  total: number;
}

export class ListWorkoutProgramsUseCase {
  constructor(private readonly workoutProgramRepository: IWorkoutProgramRepository) {}

  async execute(options?: WorkoutProgramFilterOptions): Promise<ListWorkoutProgramsResultDto> {
    const [programs, total] = await Promise.all([
      this.workoutProgramRepository.findMany(options),
      this.workoutProgramRepository.count(options),
    ]);

    return {
      programs: programs.map(WorkoutDtoMapper.toWorkoutProgramResponseDto),
      total,
    };
  }
}
