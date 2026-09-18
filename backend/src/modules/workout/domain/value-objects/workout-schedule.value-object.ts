import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface WorkoutScheduleProps {
  weeks: number;
  sessionsPerWeek: number;
}

export class WorkoutSchedule extends ValueObject<WorkoutScheduleProps> {
  private constructor(props: WorkoutScheduleProps) {
    super(props);
  }

  get weeks(): number {
    return this.props.weeks;
  }

  get sessionsPerWeek(): number {
    return this.props.sessionsPerWeek;
  }

  public toPrimitives(): WorkoutScheduleProps {
    return {
      weeks: this.props.weeks,
      sessionsPerWeek: this.props.sessionsPerWeek,
    };
  }

  public static create(props: WorkoutScheduleProps): Result<WorkoutSchedule> {
    if (props.weeks < 1 || props.weeks > 52) {
      return Result.fail<WorkoutSchedule>('Schedule weeks must be between 1 and 52.');
    }
    if (props.sessionsPerWeek < 1 || props.sessionsPerWeek > 7) {
      return Result.fail<WorkoutSchedule>('Sessions per week must be between 1 and 7.');
    }
    return Result.ok<WorkoutSchedule>(new WorkoutSchedule(props));
  }
}
