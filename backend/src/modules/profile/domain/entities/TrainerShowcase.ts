import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { ShowcaseType } from '../enums/TrainerEnums';

export interface TrainerShowcaseProps {
  type: ShowcaseType;
  title: string;
  description: string;
  mediaUrl?: string;
  issuedBy?: string;
  achievedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrainerShowcase extends Entity<TrainerShowcaseProps> {
  get showcaseId(): string {
    return this._id;
  }

  get type(): ShowcaseType {
    return this.props.type;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get mediaUrl(): string | undefined {
    return this.props.mediaUrl;
  }

  get issuedBy(): string | undefined {
    return this.props.issuedBy;
  }

  get achievedAt(): Date | undefined {
    return this.props.achievedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  private constructor(props: TrainerShowcaseProps, id?: string) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id || crypto.randomUUID().replace(/-/g, '').substring(0, 24),
    );
  }

  public static create(props: TrainerShowcaseProps, id?: string): Result<TrainerShowcase> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<TrainerShowcase>('Showcase title is required');
    }
    if (!props.description || !props.description.trim()) {
      return Result.fail<TrainerShowcase>('Showcase description is required');
    }

    return Result.ok<TrainerShowcase>(new TrainerShowcase(props, id));
  }

  public updateDetails(updates: Partial<Omit<TrainerShowcaseProps, 'createdAt'>>): Result<void> {
    if (updates.title !== undefined) {
      if (!updates.title.trim()) return Result.fail<void>('Title cannot be empty');
      this.props.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      if (!updates.description.trim()) return Result.fail<void>('Description cannot be empty');
      this.props.description = updates.description.trim();
    }
    if (updates.type !== undefined) this.props.type = updates.type;
    if (updates.mediaUrl !== undefined) this.props.mediaUrl = updates.mediaUrl;
    if (updates.issuedBy !== undefined) this.props.issuedBy = updates.issuedBy;
    if (updates.achievedAt !== undefined) this.props.achievedAt = updates.achievedAt;

    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }
}
