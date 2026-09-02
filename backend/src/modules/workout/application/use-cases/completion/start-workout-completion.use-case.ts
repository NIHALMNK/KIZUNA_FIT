import { IWorkoutCompletionRepository } from '../../../domain/repositories/workout-completion.repository.interface';
import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import {
  StartWorkoutCompletionDto,
  WorkoutCompletionResponseDto,
} from '../../dtos/workout-completion.dto';
import { WorkoutCompletion } from '../../../domain/aggregates/workout-completion.aggregate';
import { WorkoutDaySnapshot } from '../../../domain/value-objects/workout-day-snapshot.value-object';
import { CompletedExercise } from '../../../domain/entities/completed-exercise.entity';
import { CompletedSet } from '../../../domain/value-objects/completed-set.value-object';
import { CompletionSource, WorkoutCompletionStatus } from '../../../domain/enums';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';

export class StartWorkoutCompletionUseCase {
  constructor(
    private readonly workoutCompletionRepository: IWorkoutCompletionRepository,
    private readonly workoutProgramRepository: IWorkoutProgramRepository,
  ) {}

  async execute(
    dto: StartWorkoutCompletionDto,
    requestingClientId: string,
  ): Promise<WorkoutCompletionResponseDto> {
    const program = await this.workoutProgramRepository.findById(dto.workoutProgramId);
    if (!program) {
      throw new WorkoutProgramNotFoundException(dto.workoutProgramId);
    }

    if (program.clientId !== requestingClientId) {
      throw new UnauthorizedWorkoutActionException(
        'start-workout',
        'Client does not own this workout program.',
      );
    }

    // Check if an IN_PROGRESS session already exists
    const existingSession = await this.workoutCompletionRepository.findActiveSession(
      requestingClientId,
      dto.workoutProgramId,
      dto.workoutDay,
    );
    if (existingSession) {
      return WorkoutDtoMapper.toWorkoutCompletionResponseDto(existingSession);
    }

    // Locate the prescribed day in the program
    let targetDayTitle = `Workout Day ${dto.workoutDay}`;
    let plannedExercisesCount = 0;
    const initialCompletedExercises: CompletedExercise[] = [];

    for (const week of program.weeks) {
      for (const day of week.days) {
        if (day.dayNumber === dto.workoutDay) {
          targetDayTitle = day.title;
          plannedExercisesCount = day.exercises.length;

          for (const rx of day.exercises) {
            const initialSets: CompletedSet[] = [];
            for (let s = 1; s <= rx.sets; s++) {
              const setResult = CompletedSet.create({
                setNumber: s,
                plannedReps: rx.reps,
                completedReps: 0,
                weight: 0,
                completed: false,
              });
              if (setResult.isSuccess) {
                initialSets.push(setResult.getValue());
              }
            }

            const exResult = CompletedExercise.create({
              exerciseId: rx.exercise.exerciseId,
              exerciseName: rx.exercise.name,
              completedSets: initialSets,
              notes: rx.notes,
            });

            if (exResult.isSuccess) {
              initialCompletedExercises.push(exResult.getValue());
            }
          }
          break;
        }
      }
    }

    const daySnapshotResult = WorkoutDaySnapshot.create({
      weekNumber: 1,
      dayNumber: dto.workoutDay,
      title: targetDayTitle,
      plannedExercisesCount,
    });

    if (daySnapshotResult.isFailure) {
      throw new ValidationError(daySnapshotResult.error || 'Failed to create day snapshot.');
    }

    const completionResult = WorkoutCompletion.create({
      coachingRelationshipId: program.coachingRelationshipId,
      workoutProgramId: program.id,
      clientId: program.clientId,
      trainerId: program.trainerId,
      workoutDay: dto.workoutDay,
      workoutDaySnapshot: daySnapshotResult.getValue(),
      completedExercises: initialCompletedExercises,
      status: WorkoutCompletionStatus.IN_PROGRESS,
      startedAt: new Date(),
      completedBy: CompletionSource.CLIENT,
    });

    if (completionResult.isFailure) {
      throw new ValidationError(completionResult.error || 'Failed to initialize workout session.');
    }

    const completion = completionResult.getValue();
    await this.workoutCompletionRepository.save(completion);

    return WorkoutDtoMapper.toWorkoutCompletionResponseDto(completion);
  }
}
