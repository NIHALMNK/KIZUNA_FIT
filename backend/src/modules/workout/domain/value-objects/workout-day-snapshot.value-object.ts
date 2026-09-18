import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface WorkoutDaySnapshotProps {
  weekNumber: number;
  dayNumber: number;
  title: string;
  plannedExercisesCount: number;
}

/**
 * Immutable snapshot of the planned Workout Day preserved at the time of execution.
 * Protects execution evidence from changes to the parent program (Rule WC-2).
 */
export class WorkoutDaySnapshot extends ValueObject<WorkoutDaySnapshotProps> {
  private constructor(props: WorkoutDaySnapshotProps) {
    super(props);
  }

  get weekNumber(): number {
    return this.props.weekNumber;
  }

  get dayNumber(): number {
    return this.props.dayNumber;
  }

  get title(): string {
    return this.props.title;
  }

  get plannedExercisesCount(): number {
    return this.props.plannedExercisesCount;
  }

  public toPrimitives(): WorkoutDaySnapshotProps {
    return {
      weekNumber: this.props.weekNumber,
      dayNumber: this.props.dayNumber,
      title: this.props.title,
      plannedExercisesCount: this.props.plannedExercisesCount,
    };
  }

  public static create(props: WorkoutDaySnapshotProps): Result<WorkoutDaySnapshot> {
    if (props.weekNumber < 1 || props.dayNumber < 1) {
      return Result.fail<WorkoutDaySnapshot>('Week and day numbers must be positive integers.');
    }
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail<WorkoutDaySnapshot>('Workout day title cannot be empty.');
    }
    return Result.ok<WorkoutDaySnapshot>(new WorkoutDaySnapshot(props));
  }
}
