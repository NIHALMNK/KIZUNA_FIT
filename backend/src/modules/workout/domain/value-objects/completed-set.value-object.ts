import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface CompletedSetProps {
  setNumber: number;
  plannedReps: string;
  completedReps: number;
  weight: number;
  completed: boolean;
  notes?: string | null;
}

export class CompletedSet extends ValueObject<CompletedSetProps> {
  private constructor(props: CompletedSetProps) {
    super(props);
  }

  get setNumber(): number {
    return this.props.setNumber;
  }

  get plannedReps(): string {
    return this.props.plannedReps;
  }

  get completedReps(): number {
    return this.props.completedReps;
  }

  get weight(): number {
    return this.props.weight;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): CompletedSetProps {
    return {
      setNumber: this.props.setNumber,
      plannedReps: this.props.plannedReps,
      completedReps: this.props.completedReps,
      weight: this.props.weight,
      completed: this.props.completed,
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: CompletedSetProps): Result<CompletedSet> {
    if (props.setNumber < 1) {
      return Result.fail<CompletedSet>('Set number must be a positive integer.');
    }
    if (props.completedReps < 0 || props.weight < 0) {
      return Result.fail<CompletedSet>('Completed reps and weight cannot be negative.');
    }
    return Result.ok<CompletedSet>(new CompletedSet(props));
  }
}
