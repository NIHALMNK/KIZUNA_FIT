import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface TrainerSnapshotProps {
  trainerId: string;
  fullName: string;
  headline: string;
  profileImage: string;
  specializations: string[];
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
}

/**
 * Immutable snapshot of trainer profile facts captured at request creation time.
 * Enforces historical audit integrity (DB-9).
 */
export class TrainerSnapshot extends ValueObject<TrainerSnapshotProps> {
  private constructor(props: TrainerSnapshotProps) {
    super(props);
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get headline(): string {
    return this.props.headline;
  }

  get profileImage(): string {
    return this.props.profileImage;
  }

  get specializations(): string[] {
    return [...this.props.specializations];
  }

  get yearsOfExperience(): number {
    return this.props.yearsOfExperience;
  }

  get averageRating(): number {
    return this.props.averageRating;
  }

  get totalReviews(): number {
    return this.props.totalReviews;
  }

  /**
   * Serializes the immutable value object back to raw primitives.
   */
  public toPrimitives(): TrainerSnapshotProps {
    return {
      trainerId: this.props.trainerId,
      fullName: this.props.fullName,
      headline: this.props.headline,
      profileImage: this.props.profileImage,
      specializations: [...this.props.specializations],
      yearsOfExperience: this.props.yearsOfExperience,
      averageRating: this.props.averageRating,
      totalReviews: this.props.totalReviews,
    };
  }

  public static create(props: TrainerSnapshotProps): Result<TrainerSnapshot> {
    if (!props.trainerId || props.trainerId.trim() === '') {
      return Result.fail<TrainerSnapshot>('TrainerSnapshot requires a valid trainerId');
    }

    if (!props.fullName || props.fullName.trim() === '') {
      return Result.fail<TrainerSnapshot>('TrainerSnapshot requires a valid fullName');
    }

    if (props.yearsOfExperience < 0) {
      return Result.fail<TrainerSnapshot>('yearsOfExperience cannot be negative');
    }

    if (props.averageRating < 0 || props.averageRating > 5) {
      return Result.fail<TrainerSnapshot>('averageRating must be between 0 and 5');
    }

    if (props.totalReviews < 0) {
      return Result.fail<TrainerSnapshot>('totalReviews cannot be negative');
    }

    return Result.ok<TrainerSnapshot>(
      new TrainerSnapshot({
        trainerId: props.trainerId.trim(),
        fullName: props.fullName.trim(),
        headline: props.headline ? props.headline.trim() : '',
        profileImage: props.profileImage ? props.profileImage.trim() : '',
        specializations: Array.isArray(props.specializations) ? [...props.specializations] : [],
        yearsOfExperience: props.yearsOfExperience,
        averageRating: props.averageRating,
        totalReviews: props.totalReviews,
      }),
    );
  }
}
