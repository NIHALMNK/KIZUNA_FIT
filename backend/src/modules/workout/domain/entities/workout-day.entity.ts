import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import {
  ExercisePrescription,
  ExercisePrescriptionPrimitives,
} from '../value-objects/exercise-prescription.value-object';

export interface WorkoutDayProps {
  dayNumber: number;
  title: string;
  exercises: ExercisePrescription[];
}

export interface WorkoutDayPrimitives {
  id: string;
  dayNumber: number;
  title: string;
  exercises: ExercisePrescriptionPrimitives[];
}

export class WorkoutDay extends Entity<WorkoutDayProps> {
  private constructor(props: WorkoutDayProps, id: string) {
    super(props, id);
  }

  get dayNumber(): number {
    return this.props.dayNumber;
  }

  get title(): string {
    return this.props.title;
  }

  get exercises(): ExercisePrescription[] {
    return [...this.props.exercises];
  }

  public toPrimitives(): WorkoutDayPrimitives {
    return {
      id: this._id,
      dayNumber: this.props.dayNumber,
      title: this.props.title,
      exercises: this.props.exercises.map((e) => e.toPrimitives()),
    };
  }

  public static create(props: WorkoutDayProps, id?: string): Result<WorkoutDay> {
    if (props.dayNumber < 1 || props.dayNumber > 7) {
      return Result.fail<WorkoutDay>('Day number must be between 1 and 7.');
    }
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail<WorkoutDay>('Workout day title cannot be empty.');
    }
    const dayId = id || crypto.randomUUID();
    return Result.ok<WorkoutDay>(new WorkoutDay(props, dayId));
  }
}
