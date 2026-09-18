import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { WorkoutDifficulty } from '../enums';

export interface WorkoutFeedbackProps {
  difficulty: WorkoutDifficulty;
  energyLevel: number;
  notes?: string | null;
}

export class WorkoutFeedback extends ValueObject<WorkoutFeedbackProps> {
  private constructor(props: WorkoutFeedbackProps) {
    super(props);
  }

  get difficulty(): WorkoutDifficulty {
    return this.props.difficulty;
  }

  get energyLevel(): number {
    return this.props.energyLevel;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): WorkoutFeedbackProps {
    return {
      difficulty: this.props.difficulty,
      energyLevel: this.props.energyLevel,
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: WorkoutFeedbackProps): Result<WorkoutFeedback> {
    if (props.energyLevel < 1 || props.energyLevel > 10) {
      return Result.fail<WorkoutFeedback>('Energy level must be between 1 and 10.');
    }
    return Result.ok<WorkoutFeedback>(new WorkoutFeedback(props));
  }
}
