import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../enums';
import { ExerciseSnapshot } from '../value-objects/exercise-snapshot.value-object';
import { InvalidExerciseStatusException } from '../exceptions/workout-domain.exceptions';

export interface ExerciseInstruction {
  step: number;
  instruction: string;
}

export interface ExerciseMedia {
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  imageUrls?: string[];
  images?: string[];
}

export interface ExerciseProps {
  name: string;
  slug: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  secondaryMuscleGroups: PrimaryMuscleGroup[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  instructions: ExerciseInstruction[];
  media: ExerciseMedia;
  caloriesPerMinute: number;
  status: ExerciseStatus;
  origin: ExerciseOrigin;
  createdByTrainerId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Exercise extends AggregateRoot<ExerciseProps> {
  private constructor(props: ExerciseProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
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

  get secondaryMuscleGroups(): PrimaryMuscleGroup[] {
    return [...this.props.secondaryMuscleGroups];
  }

  get equipment(): EquipmentType {
    return this.props.equipment;
  }

  get difficulty(): DifficultyLevel {
    return this.props.difficulty;
  }

  get instructions(): ExerciseInstruction[] {
    return [...this.props.instructions];
  }

  get media(): ExerciseMedia {
    return { ...this.props.media };
  }

  get caloriesPerMinute(): number {
    return this.props.caloriesPerMinute;
  }

  get status(): ExerciseStatus {
    return this.props.status;
  }

  get origin(): ExerciseOrigin {
    return this.props.origin;
  }

  get createdByTrainerId(): string | null {
    return this.props.createdByTrainerId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public isCreatedBy(trainerId: string): boolean {
    return this.props.createdByTrainerId === trainerId;
  }

  public canBeEditedBy(userId: string, role?: string): boolean {
    if (role === 'ADMIN') return true;
    if (this.props.origin === ExerciseOrigin.PLATFORM) return false;
    return this.props.createdByTrainerId === userId;
  }

  public isUsableInNewProgram(): boolean {
    return this.props.status === ExerciseStatus.ACTIVE;
  }

  public deprecate(): Result<void> {
    if (this.props.status === ExerciseStatus.DEPRECATED) {
      return Result.ok<void>();
    }
    this.props.status = ExerciseStatus.DEPRECATED;
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public updateDetails(
    updates: Partial<
      Omit<
        ExerciseProps,
        'slug' | 'status' | 'origin' | 'createdByTrainerId' | 'createdAt' | 'updatedAt'
      >
    >,
  ): Result<void> {
    if (updates.name && updates.name.trim().length > 0) {
      this.props.name = updates.name.trim();
    }
    if (updates.category) this.props.category = updates.category;
    if (updates.primaryMuscleGroup) this.props.primaryMuscleGroup = updates.primaryMuscleGroup;
    if (updates.secondaryMuscleGroups)
      this.props.secondaryMuscleGroups = [...updates.secondaryMuscleGroups];
    if (updates.equipment) this.props.equipment = updates.equipment;
    if (updates.difficulty) this.props.difficulty = updates.difficulty;
    if (updates.instructions) this.props.instructions = [...updates.instructions];
    if (updates.media) this.props.media = { ...updates.media };
    if (updates.caloriesPerMinute !== undefined && updates.caloriesPerMinute >= 0) {
      this.props.caloriesPerMinute = updates.caloriesPerMinute;
    }
    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public toSnapshot(): ExerciseSnapshot {
    const snapshotResult = ExerciseSnapshot.create({
      exerciseId: this._id,
      name: this.props.name,
      slug: this.props.slug,
      category: this.props.category,
      primaryMuscleGroup: this.props.primaryMuscleGroup,
      equipment: this.props.equipment,
      difficulty: this.props.difficulty,
    });

    if (snapshotResult.isFailure) {
      throw new Error(`Failed to generate ExerciseSnapshot: ${snapshotResult.error}`);
    }

    return snapshotResult.getValue();
  }

  public static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  public static create(
    props: Omit<
      ExerciseProps,
      'slug' | 'origin' | 'createdByTrainerId' | 'createdAt' | 'updatedAt'
    > & {
      slug?: string;
      origin?: ExerciseOrigin;
      createdByTrainerId?: string | null;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<Exercise> {
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<Exercise>('Exercise name is required.');
    }
    const slug = props.slug || Exercise.generateSlug(props.name);
    const exerciseId = id || crypto.randomUUID();
    const now = new Date();

    const exercise = new Exercise(
      {
        ...props,
        slug,
        secondaryMuscleGroups: props.secondaryMuscleGroups || [],
        instructions: props.instructions || [],
        media: props.media || { images: [] },
        caloriesPerMinute: props.caloriesPerMinute ?? 5,
        status: props.status || ExerciseStatus.ACTIVE,
        origin: props.origin || ExerciseOrigin.PLATFORM,
        createdByTrainerId: props.createdByTrainerId ?? null,
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      exerciseId,
    );

    return Result.ok<Exercise>(exercise);
  }

  public static reconstitute(props: ExerciseProps, id: string): Exercise {
    return new Exercise(props, id);
  }
}
