import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { CompletedSet, CompletedSetProps } from '../value-objects/completed-set.value-object';

export interface CompletedExerciseProps {
  exerciseId: string;
  exerciseName: string;
  completedSets: CompletedSet[];
  notes?: string | null;
}

export interface CompletedExercisePrimitives {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedSets: CompletedSetProps[];
  notes?: string | null;
}

export class CompletedExercise extends Entity<CompletedExerciseProps> {
  private constructor(props: CompletedExerciseProps, id: string) {
    super(props, id);
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }

  get exerciseName(): string {
    return this.props.exerciseName;
  }

  get completedSets(): CompletedSet[] {
    return [...this.props.completedSets];
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): CompletedExercisePrimitives {
    return {
      id: this._id,
      exerciseId: this.props.exerciseId,
      exerciseName: this.props.exerciseName,
      completedSets: this.props.completedSets.map((s) => s.toPrimitives()),
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: CompletedExerciseProps, id?: string): Result<CompletedExercise> {
    if (!props.exerciseId || !props.exerciseName) {
      return Result.fail<CompletedExercise>(
        'Completed exercise requires valid exerciseId and exerciseName.',
      );
    }
    const exercisePerformanceId = id || crypto.randomUUID();
    return Result.ok<CompletedExercise>(new CompletedExercise(props, exercisePerformanceId));
  }
}
