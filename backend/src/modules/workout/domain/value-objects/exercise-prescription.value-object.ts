import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { ExerciseSnapshot, ExerciseSnapshotProps } from './exercise-snapshot.value-object';
import { ExerciseType } from '../enums';

export interface ExercisePrescriptionProps {
  order: number;
  exercise: ExerciseSnapshot;
  type: ExerciseType;
  sets: number;
  reps: string;
  durationSeconds?: number | null;
  restSeconds: number;
  tempo?: string | null;
  notes?: string | null;
}

export interface ExercisePrescriptionPrimitives {
  order: number;
  exercise: ExerciseSnapshotProps;
  type: ExerciseType;
  sets: number;
  reps: string;
  durationSeconds?: number | null;
  restSeconds: number;
  tempo?: string | null;
  notes?: string | null;
}

export class ExercisePrescription extends ValueObject<ExercisePrescriptionProps> {
  private constructor(props: ExercisePrescriptionProps) {
    super(props);
  }

  get order(): number {
    return this.props.order;
  }

  get exercise(): ExerciseSnapshot {
    return this.props.exercise;
  }

  get type(): ExerciseType {
    return this.props.type;
  }

  get sets(): number {
    return this.props.sets;
  }

  get reps(): string {
    return this.props.reps;
  }

  get durationSeconds(): number | null | undefined {
    return this.props.durationSeconds;
  }

  get restSeconds(): number {
    return this.props.restSeconds;
  }

  get tempo(): string | null | undefined {
    return this.props.tempo;
  }

  get notes(): string | null | undefined {
    return this.props.notes;
  }

  public toPrimitives(): ExercisePrescriptionPrimitives {
    return {
      order: this.props.order,
      exercise: this.props.exercise.toPrimitives(),
      type: this.props.type,
      sets: this.props.sets,
      reps: this.props.reps,
      durationSeconds: this.props.durationSeconds ?? null,
      restSeconds: this.props.restSeconds,
      tempo: this.props.tempo ?? null,
      notes: this.props.notes ?? null,
    };
  }

  public static create(props: ExercisePrescriptionProps): Result<ExercisePrescription> {
    if (props.sets <= 0) {
      return Result.fail<ExercisePrescription>('Prescribed sets must be greater than 0.');
    }
    if (!props.reps || props.reps.trim().length === 0) {
      return Result.fail<ExercisePrescription>('Prescribed reps cannot be empty.');
    }
    if (props.restSeconds < 0) {
      return Result.fail<ExercisePrescription>('Rest seconds cannot be negative.');
    }
    return Result.ok<ExercisePrescription>(new ExercisePrescription(props));
  }
}
