import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import { IWorkoutCoachingGateway } from '../../../domain/repositories/workout-coaching.gateway.interface';
import {
  CreateWorkoutProgramDto,
  WorkoutProgramResponseDto,
  WorkoutWeekInputDto,
} from '../../dtos/workout-program.dto';
import { WorkoutProgram } from '../../../domain/aggregates/workout-program.aggregate';
import { WorkoutSchedule } from '../../../domain/value-objects/workout-schedule.value-object';
import { WorkoutWeek } from '../../../domain/entities/workout-week.entity';
import { WorkoutDay } from '../../../domain/entities/workout-day.entity';
import { ExercisePrescription } from '../../../domain/value-objects/exercise-prescription.value-object';
import { WorkoutProgramStatus } from '../../../domain/enums';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  DeprecatedExerciseUsageException,
  ExerciseNotFoundException,
  UnauthorizedWorkoutActionException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { NotFoundError, ValidationError } from '../../../../../shared/exceptions/AppError';

export class CreateWorkoutProgramUseCase {
  constructor(
    private readonly workoutProgramRepository: IWorkoutProgramRepository,
    private readonly exerciseRepository: IExerciseRepository,
    private readonly workoutCoachingGateway: IWorkoutCoachingGateway,
  ) {}

  async execute(
    dto: CreateWorkoutProgramDto,
    requestingTrainerId: string,
  ): Promise<WorkoutProgramResponseDto> {
    const coachingAccess = await this.workoutCoachingGateway.getRelationshipAccess(
      dto.coachingRelationshipId,
    );
    if (!coachingAccess) {
      throw new NotFoundError(`Coaching relationship '${dto.coachingRelationshipId}' not found.`);
    }

    if (coachingAccess.trainerId !== requestingTrainerId) {
      throw new UnauthorizedWorkoutActionException(
        'create-program',
        'Trainer does not own this coaching relationship.',
      );
    }

    const scheduleResult = WorkoutSchedule.create(dto.schedule);
    if (scheduleResult.isFailure) {
      throw new ValidationError(scheduleResult.error || 'Invalid schedule.');
    }

    const weeks = await this.buildWorkoutWeeks(dto.weeks || []);

    const programResult = WorkoutProgram.create({
      coachingRelationshipId: dto.coachingRelationshipId,
      trainerId: coachingAccess.trainerId,
      clientId: coachingAccess.clientId,
      version: 1,
      title: dto.title,
      description: dto.description ?? null,
      goal: dto.goal,
      schedule: scheduleResult.getValue(),
      weeks,
      status: WorkoutProgramStatus.DRAFT,
    });

    if (programResult.isFailure) {
      throw new ValidationError(programResult.error || 'Failed to create program.');
    }

    const program = programResult.getValue();
    await this.workoutProgramRepository.save(program);

    return WorkoutDtoMapper.toWorkoutProgramResponseDto(program);
  }

  private async buildWorkoutWeeks(weekDtos: WorkoutWeekInputDto[]): Promise<WorkoutWeek[]> {
    const weeks: WorkoutWeek[] = [];

    for (const weekDto of weekDtos) {
      const days: WorkoutDay[] = [];

      for (const dayDto of weekDto.days || []) {
        const prescriptions: ExercisePrescription[] = [];

        for (const exDto of dayDto.exercises || []) {
          const exercise = await this.exerciseRepository.findById(exDto.exerciseId);
          if (!exercise) {
            throw new ExerciseNotFoundException(exDto.exerciseId);
          }

          if (!exercise.isUsableInNewProgram()) {
            throw new DeprecatedExerciseUsageException(exDto.exerciseId);
          }

          const snapshot = exercise.toSnapshot();
          const prescriptionResult = ExercisePrescription.create({
            order: exDto.order,
            exercise: snapshot,
            type: exDto.type,
            sets: exDto.sets,
            reps: exDto.reps,
            durationSeconds: exDto.durationSeconds,
            restSeconds: exDto.restSeconds,
            tempo: exDto.tempo,
            notes: exDto.notes,
          });

          if (prescriptionResult.isFailure) {
            throw new ValidationError(prescriptionResult.error || 'Invalid prescription');
          }

          prescriptions.push(prescriptionResult.getValue());
        }

        const dayResult = WorkoutDay.create(
          {
            dayNumber: dayDto.dayNumber,
            title: dayDto.title,
            exercises: prescriptions,
          },
          dayDto.id,
        );

        if (dayResult.isFailure) {
          throw new ValidationError(dayResult.error || 'Invalid day');
        }

        days.push(dayResult.getValue());
      }

      const weekResult = WorkoutWeek.create(
        {
          weekNumber: weekDto.weekNumber,
          title: weekDto.title,
          days,
        },
        weekDto.id,
      );

      if (weekResult.isFailure) {
        throw new ValidationError(weekResult.error || 'Invalid week');
      }

      weeks.push(weekResult.getValue());
    }

    return weeks;
  }
}
