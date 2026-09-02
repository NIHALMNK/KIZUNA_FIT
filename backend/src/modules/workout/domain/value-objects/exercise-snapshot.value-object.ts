import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { DifficultyLevel, EquipmentType, PrimaryMuscleGroup } from '../enums';

export interface ExerciseSnapshotProps {
  exerciseId: string;
  name: string;
  slug: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
}

/**
 * Immutable snapshot of an Exercise at the moment it was prescribed in a WorkoutProgram.
 * Protects historical prescriptions and workout logs from subsequent catalog edits (Rule EX-3 / WP-6).
 */
export class ExerciseSnapshot extends ValueObject<ExerciseSnapshotProps> {
  private constructor(props: ExerciseSnapshotProps) {
    super(props);
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get category(): string {
    return this.props.category;
  }

  get primaryMuscleGroup(): PrimaryMuscleGroup {
    return this.props.primaryMuscleGroup;
  }

  get equipment(): EquipmentType {
    return this.props.equipment;
  }

  get difficulty(): DifficultyLevel {
    return this.props.difficulty;
  }

  public toPrimitives(): ExerciseSnapshotProps {
    return {
      exerciseId: this.props.exerciseId,
      name: this.props.name,
      slug: this.props.slug,
      category: this.props.category,
      primaryMuscleGroup: this.props.primaryMuscleGroup,
      equipment: this.props.equipment,
      difficulty: this.props.difficulty,
    };
  }

  public static create(props: ExerciseSnapshotProps): Result<ExerciseSnapshot> {
    if (!props.exerciseId || !props.name || !props.slug) {
      return Result.fail<ExerciseSnapshot>(
        'Exercise snapshot requires exerciseId, name, and slug.',
      );
    }
    return Result.ok<ExerciseSnapshot>(new ExerciseSnapshot(props));
  }
}
