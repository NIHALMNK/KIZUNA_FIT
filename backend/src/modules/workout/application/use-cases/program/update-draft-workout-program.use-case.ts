import { IWorkoutProgramRepository } from '../../../domain/repositories/workout-program.repository.interface';
import { IExerciseRepository } from '../../../domain/repositories/exercise.repository.interface';
import {
  UpdateDraftWorkoutProgramDto,
  WorkoutProgramResponseDto,
  WorkoutWeekInputDto,
} from '../../dtos/workout-program.dto';
import { WorkoutSchedule } from '../../../domain/value-objects/workout-schedule.value-object';
import { WorkoutWeek } from '../../../domain/entities/workout-week.entity';
import { WorkoutDay } from '../../../domain/entities/workout-day.entity';
import { ExercisePrescription } from '../../../domain/value-objects/exercise-prescription.value-object';
import { WorkoutDtoMapper } from '../../mappers/workout-dto.mapper';
import {
  ActiveWorkoutProgramImmutableException,
  DeprecatedExerciseUsageException,
  ExerciseNotFoundException,
  UnauthorizedWorkoutActionException,
  WorkoutProgramNotFoundException,
} from '../../../domain/exceptions/workout-domain.exceptions';
import { ValidationError } from '../../../../../shared/exceptions/AppError';
import { WorkoutProgramStatus } from '../../../domain/enums';

export class UpdateDraftWorkoutProgramUseCase {
  constructor(
    private readonly workoutProgramRepository: IWorkoutProgramRepository,
    private readonly exerciseRepository: IExerciseRepository,
  ) {}

  async execute(
    programId: string,
    dto: UpdateDraftWorkoutProgramDto,
    requestingTrainerId: string,
  ): Promise<WorkoutProgramResponseDto> {
    const program = await this.workoutProgramRepository.findById(programId);
    if (!program) {
      throw new WorkoutProgramNotFoundException(programId);
    }

    if (program.trainerId !== requestingTrainerId) {
      throw new UnauthorizedWorkoutActionException(
        'update-program',
        'Trainer does not own this program.',
      );
    }

    if (program.status !== WorkoutProgramStatus.DRAFT) {
      throw new ActiveWorkoutProgramImmutableException(programId);
    }

    let schedule: WorkoutSchedule | undefined;
    if (dto.schedule) {
      const scheduleResult = WorkoutSchedule.create(dto.schedule);
      if (scheduleResult.isFailure) {
        throw new ValidationError(scheduleResult.error || 'Invalid schedule.');
      }
      schedule = scheduleResult.getValue();
    }

    let weeks: WorkoutWeek[] | undefined;
    if (dto.weeks) {
      weeks = await this.buildWorkoutWeeks(dto.weeks);
    }

    program.updateDraft({
      title: dto.title,
      description: dto.description,
      goal: dto.goal,
      schedule,
      weeks,
    });

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
