import { IWorkoutCompletionRepository } from '../../../domain/repositories/workout-completion.repository.interface';
import {
  CompleteWorkoutDto,
  WorkoutCompletionResponseDto,
} from '../../dtos/workout-completion.dto';
import { CompletedExercise } from '../../../domain/entities/completed-exercise.entity';
import { CompletedSet } from '../../../domain/value-objects/completed-set.value-object';
import { WorkoutFeedback } from '../../../domain/value-objects/workout-feedback.value-object';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutCompletionNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';
import { CompletionSource } from '../../../domain/enums';

export class CompleteWorkoutUseCase {
  constructor(private readonly workoutCompletionRepository: IWorkoutCompletionRepository) {}

  async execute(
    completionId: string,
    dto: CompleteWorkoutDto,
    requestingClientId: string,
  ): Promise<WorkoutCompletionResponseDto> {
    const completion = await this.workoutCompletionRepository.findById(completionId);
    if (!completion) {
      throw new WorkoutCompletionNotFoundException(completionId);
    }

    if (completion.clientId !== requestingClientId) {
      throw new UnauthorizedWorkoutActionException(
        'complete-workout',
        'Client does not own this workout session.',
      );
    }

    const completedExercises: CompletedExercise[] = [];
    for (const exDto of dto.completedExercises) {
      const sets: CompletedSet[] = [];
      for (const setDto of exDto.completedSets) {
        const setResult = CompletedSet.create({
          setNumber: setDto.setNumber,
          plannedReps: setDto.plannedReps,
          completedReps: setDto.completedReps,
          weight: setDto.weight,
          completed: setDto.completed,
          notes: setDto.notes,
        });

        if (setResult.isFailure) {
          throw new ValidationError(setResult.error || 'Invalid set data');
        }
        sets.push(setResult.getValue());
      }

      const exerciseResult = CompletedExercise.create(
        {
          exerciseId: exDto.exerciseId,
          exerciseName: exDto.exerciseName,
          completedSets: sets,
          notes: exDto.notes,
        },
        exDto.id,
      );

      if (exerciseResult.isFailure) {
        throw new ValidationError(exerciseResult.error || 'Invalid exercise execution');
      }
      completedExercises.push(exerciseResult.getValue());
    }

    let feedback: WorkoutFeedback | undefined;
    if (dto.feedback) {
      const feedbackResult = WorkoutFeedback.create({
        difficulty: dto.feedback.difficulty,
        energyLevel: dto.feedback.energyLevel,
        notes: dto.feedback.notes,
      });

      if (feedbackResult.isFailure) {
        throw new ValidationError(feedbackResult.error || 'Invalid feedback');
      }
      feedback = feedbackResult.getValue();
    }

    completion.complete(
      completedExercises,
      feedback,
      dto.completedAt || new Date(),
      CompletionSource.CLIENT,
    );
    await this.workoutCompletionRepository.save(completion);

    return WorkoutDtoMapper.toWorkoutCompletionResponseDto(completion);
  }
}
