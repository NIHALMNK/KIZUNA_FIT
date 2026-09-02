import { IWorkoutCompletionRepository } from '../../../domain/repositories/workout-completion.repository.interface';
import { WorkoutCompletionResponseDto } from '../../dtos/workout-completion.dto';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import { WorkoutCompletionStatus } from '../../../domain/enums';

export interface WorkoutHistoryStatsDto {
  totalCompletedSessions: number;
  totalSetsCompleted: number;
  totalVolumeLiftedKg: number;
  recentSessions: WorkoutCompletionResponseDto[];
}

export class GetWorkoutHistoryUseCase {
  constructor(private readonly workoutCompletionRepository: IWorkoutCompletionRepository) {}

  async execute(clientId: string, limit: number = 30): Promise<WorkoutHistoryStatsDto> {
    const completions = await this.workoutCompletionRepository.findMany({
      clientId,
      status: WorkoutCompletionStatus.COMPLETED,
      limit,
    });

    let totalCompletedSessions = 0;
    let totalSetsCompleted = 0;
    let totalVolumeLiftedKg = 0;

    for (const completion of completions) {
      if (completion.status === WorkoutCompletionStatus.COMPLETED) {
        totalCompletedSessions++;
        for (const ex of completion.completedExercises) {
          for (const s of ex.completedSets) {
            if (s.completed) {
              totalSetsCompleted++;
              totalVolumeLiftedKg += s.completedReps * s.weight;
            }
          }
        }
      }
    }

    return {
      totalCompletedSessions,
      totalSetsCompleted,
      totalVolumeLiftedKg,
      recentSessions: completions.map(WorkoutDtoMapper.toWorkoutCompletionResponseDto),
    };
  }
}
