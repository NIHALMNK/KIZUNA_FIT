import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { WorkoutDay, WorkoutDayPrimitives } from './workout-day.entity';

export interface WorkoutWeekProps {
  weekNumber: number;
  title: string;
  days: WorkoutDay[];
}

export interface WorkoutWeekPrimitives {
  id: string;
  weekNumber: number;
  title: string;
  days: WorkoutDayPrimitives[];
}

export class WorkoutWeek extends Entity<WorkoutWeekProps> {
  private constructor(props: WorkoutWeekProps, id: string) {
    super(props, id);
  }

  get weekNumber(): number {
    return this.props.weekNumber;
  }

  get title(): string {
    return this.props.title;
  }

  get days(): WorkoutDay[] {
    return [...this.props.days];
  }

  public toPrimitives(): WorkoutWeekPrimitives {
    return {
      id: this._id,
      weekNumber: this.props.weekNumber,
      title: this.props.title,
      days: this.props.days.map((d) => d.toPrimitives()),
    };
  }

  public static create(props: WorkoutWeekProps, id?: string): Result<WorkoutWeek> {
    if (props.weekNumber < 1) {
      return Result.fail<WorkoutWeek>('Week number must be a positive integer.');
    }
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail<WorkoutWeek>('Week title cannot be empty.');
    }
    const weekId = id || crypto.randomUUID();
    return Result.ok<WorkoutWeek>(new WorkoutWeek(props, weekId));
  }
}
