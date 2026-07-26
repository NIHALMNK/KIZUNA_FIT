import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { Gender } from '../enums/Gender';
import { DietaryPreference } from '../enums/DietaryPreference';
import { FitnessGoal } from '../enums/FitnessGoal';
import { ExperienceLevel, ActivityLevel } from '../enums/ClientLevels';
import { Weight } from '../value-objects/Weight';
import { Height } from '../value-objects/Height';
import { ProfileCompletionCalculator } from '../services/ProfileCompletionCalculator';
import {
  ClientProfileCreatedEvent,
  ClientProfileUpdatedEvent,
  ClientAvatarUpdatedEvent,
  ClientAvatarDeletedEvent,
} from '../events/ClientProfileEvents';

export interface ClientProfileProps {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  gender?: Gender | null;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  timezone?: string | null;
  weight?: Weight | null;
  height?: Height | null;
  medicalNotes?: string | null;
  dietaryPreferences: DietaryPreference[];
  fitnessGoals: FitnessGoal[];
  experienceLevel?: ExperienceLevel | null;
  activityLevel?: ActivityLevel | null;
  profileCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ClientProfile extends AggregateRoot<ClientProfileProps> {
  get userId(): string {
    return this.props.userId;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get gender(): Gender | null | undefined {
    return this.props.gender;
  }

  get dateOfBirth(): Date | null | undefined {
    return this.props.dateOfBirth;
  }

  get phoneNumber(): string | null | undefined {
    return this.props.phoneNumber;
  }

  get country(): string | null | undefined {
    return this.props.country;
  }

  get state(): string | null | undefined {
    return this.props.state;
  }

  get city(): string | null | undefined {
    return this.props.city;
  }

  get timezone(): string | null | undefined {
    return this.props.timezone;
  }

  get weight(): Weight | null | undefined {
    return this.props.weight;
  }

  get height(): Height | null | undefined {
    return this.props.height;
  }

  get medicalNotes(): string | null | undefined {
    return this.props.medicalNotes;
  }

  get dietaryPreferences(): DietaryPreference[] {
    return this.props.dietaryPreferences;
  }

  get fitnessGoals(): FitnessGoal[] {
    return this.props.fitnessGoals;
  }

  get experienceLevel(): ExperienceLevel | null | undefined {
    return this.props.experienceLevel;
  }

  get activityLevel(): ActivityLevel | null | undefined {
    return this.props.activityLevel;
  }

  get profileCompleted(): boolean {
    return this.props.profileCompleted;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  private constructor(props: ClientProfileProps, id?: string) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id || crypto.randomUUID().replace(/-/g, '').substring(0, 24),
    );
  }

  public static create(props: ClientProfileProps, id?: string): Result<ClientProfile> {
    if (!props.userId) {
      return Result.fail<ClientProfile>('userId is required');
    }
    if (!props.fullName || !props.fullName.trim()) {
      return Result.fail<ClientProfile>('fullName is required');
    }

    const isNew = !id;
    const profile = new ClientProfile(
      {
        ...props,
        fullName: props.fullName.trim(),
        dietaryPreferences: props.dietaryPreferences || [],
        fitnessGoals: props.fitnessGoals || [],
        profileCompleted: props.profileCompleted ?? false,
      },
      id,
    );

    profile.recalculateCompletion();

    if (isNew) {
      profile.addDomainEvent(new ClientProfileCreatedEvent(profile.id, profile.userId));
    }

    return Result.ok<ClientProfile>(profile);
  }

  public updateDetails(
    updates: Partial<Omit<ClientProfileProps, 'userId' | 'createdAt'>>,
  ): Result<void> {
    if (updates.fullName !== undefined) {
      if (!updates.fullName.trim()) return Result.fail<void>('Full name cannot be empty');
      this.props.fullName = updates.fullName.trim();
    }
    if (updates.gender !== undefined) this.props.gender = updates.gender;
    if (updates.dateOfBirth !== undefined) this.props.dateOfBirth = updates.dateOfBirth;
    if (updates.phoneNumber !== undefined) this.props.phoneNumber = updates.phoneNumber;
    if (updates.country !== undefined) this.props.country = updates.country;
    if (updates.state !== undefined) this.props.state = updates.state;
    if (updates.city !== undefined) this.props.city = updates.city;
    if (updates.timezone !== undefined) this.props.timezone = updates.timezone;
    if (updates.weight !== undefined) this.props.weight = updates.weight;
    if (updates.height !== undefined) this.props.height = updates.height;
    if (updates.medicalNotes !== undefined) this.props.medicalNotes = updates.medicalNotes;
    if (updates.dietaryPreferences !== undefined)
      this.props.dietaryPreferences = Array.from(new Set(updates.dietaryPreferences));
    if (updates.fitnessGoals !== undefined)
      this.props.fitnessGoals = Array.from(new Set(updates.fitnessGoals));
    if (updates.experienceLevel !== undefined) this.props.experienceLevel = updates.experienceLevel;
    if (updates.activityLevel !== undefined) this.props.activityLevel = updates.activityLevel;

    this.recalculateCompletion();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ClientProfileUpdatedEvent(this.id, this.userId));

    return Result.ok<void>();
  }

  public updateAvatar(avatarUrl: string): Result<void> {
    if (!avatarUrl || !avatarUrl.trim()) {
      return Result.fail<void>('Avatar URL is required');
    }
    this.props.avatarUrl = avatarUrl.trim();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ClientAvatarUpdatedEvent(this.id, avatarUrl));
    return Result.ok<void>();
  }

  public deleteAvatar(): Result<void> {
    this.props.avatarUrl = null;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new ClientAvatarDeletedEvent(this.id));
    return Result.ok<void>();
  }

  public recalculateCompletion(): void {
    const { isComplete } = ProfileCompletionCalculator.calculateClientCompletion(this);
    this.props.profileCompleted = isComplete;
  }
}
