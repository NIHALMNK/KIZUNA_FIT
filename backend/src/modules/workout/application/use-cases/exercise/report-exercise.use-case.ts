import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { ExerciseNotFoundException } from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export interface ReportExerciseDto {
  reason: string;
  details?: string;
}

export interface ReportExerciseResultDto {
  reportId: string;
  exerciseId: string;
  message: string;
  reportedAt: string;
}

export class ReportExerciseUseCase {
  constructor(private readonly exerciseRepository: IExerciseRepository) {}

  async execute(
    exerciseId: string,
    dto: ReportExerciseDto,
    requestingUserId: string,
  ): Promise<ReportExerciseResultDto> {
    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new ExerciseNotFoundException(exerciseId);
    }

    if (!dto.reason || dto.reason.trim().length === 0) {
      throw new ValidationError('A valid report reason is required.');
    }

    if (exercise.createdByTrainerId && exercise.createdByTrainerId === requestingUserId) {
      throw new ValidationError('You cannot report your own exercise.');
    }

    const reportId = `rep_${crypto.randomUUID()}`;
    const reportedAt = new Date().toISOString();

    return {
      reportId,
      exerciseId,
      message: 'Exercise report submitted successfully for moderation review.',
      reportedAt,
    };
  }
}
