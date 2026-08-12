import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { TrainerSpecialization } from '../enums/TrainerSpecialization';
import { TrainerLocation } from '../value-objects/TrainerLocation';
import { TrainerAvailability } from '../value-objects/TrainerAvailability';
import { TrainerCertification } from '../entities/TrainerCertification';
import { TrainerShowcase } from '../entities/TrainerShowcase';
import { ProfileCompletionCalculator } from '../services/ProfileCompletionCalculator';
import {
  CertificationAlreadyVerifiedException,
  CertificationNotFoundException,
  ShowcaseItemNotFoundException,
} from '../exceptions/DomainExceptions';
import {
  TrainerProfileCreatedEvent,
  TrainerProfileUpdatedEvent,
  TrainerAvatarUpdatedEvent,
  TrainerAvatarDeletedEvent,
  TrainerAvailabilityChangedEvent,
  TrainerCertificationAddedEvent,
  TrainerCertificationUpdatedEvent,
  TrainerCertificationDeletedEvent,
  TrainerShowcaseAddedEvent,
  TrainerShowcaseUpdatedEvent,
  TrainerShowcaseDeletedEvent,
} from '../events/TrainerProfileEvents';

export interface TrainerProfileProps {
  userId: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: TrainerCertification[];
  location: TrainerLocation;
  availability: TrainerAvailability;
  totalClients: number;
  totalReviews: number;
  averageRating: number;
  profileCompleted: boolean;
  showcase: TrainerShowcase[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrainerProfile extends AggregateRoot<TrainerProfileProps> {
  get userId(): string {
    return this.props.userId;
  }

  get headline(): string {
    return this.props.headline;
  }

  get bio(): string {
    return this.props.bio;
  }

  get avatarUrl(): string | null | undefined {
    return this.props.avatarUrl;
  }

  get yearsOfExperience(): number {
    return this.props.yearsOfExperience;
  }

  get languages(): string[] {
    return this.props.languages;
  }

  get specializations(): TrainerSpecialization[] {
    return this.props.specializations;
  }

  get certifications(): TrainerCertification[] {
    return this.props.certifications;
  }

  get location(): TrainerLocation {
    return this.props.location;
  }

  get availability(): TrainerAvailability {
    return this.props.availability;
  }

  get totalClients(): number {
    return this.props.totalClients;
  }

  get totalReviews(): number {
    return this.props.totalReviews;
  }

  get averageRating(): number {
    return this.props.averageRating;
  }

  get profileCompleted(): boolean {
    return this.props.profileCompleted;
  }

  get showcase(): TrainerShowcase[] {
    return this.props.showcase;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  private constructor(props: TrainerProfileProps, id?: string) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id || crypto.randomUUID().replace(/-/g, '').substring(0, 24),
    );
  }

  public static create(props: TrainerProfileProps, id?: string): Result<TrainerProfile> {
    if (!props.userId) {
      return Result.fail<TrainerProfile>('userId is required');
    }
    if (!props.headline || !props.headline.trim()) {
      return Result.fail<TrainerProfile>('headline is required');
    }
    if (!props.bio || !props.bio.trim()) {
      return Result.fail<TrainerProfile>('bio is required');
    }
    if (props.yearsOfExperience < 0) {
      return Result.fail<TrainerProfile>('yearsOfExperience cannot be negative');
    }
    if (!props.location) {
      return Result.fail<TrainerProfile>('location is required');
    }
    if (!props.availability) {
      return Result.fail<TrainerProfile>('availability is required');
    }

    const isNew = !id;
    const profile = new TrainerProfile(
      {
        ...props,
        headline: props.headline.trim(),
        bio: props.bio.trim(),
        languages: Array.from(new Set(props.languages || [])),
        specializations: Array.from(new Set(props.specializations || [])),
        certifications: props.certifications || [],
        showcase: props.showcase || [],
        totalClients: props.totalClients ?? 0,
        totalReviews: props.totalReviews ?? 0,
        averageRating: props.averageRating ?? 0.0,
        profileCompleted: props.profileCompleted ?? false,
      },
      id,
    );

    profile.recalculateCompletion();

    if (isNew) {
      profile.addDomainEvent(new TrainerProfileCreatedEvent(profile.id, profile.userId));
    }

    return Result.ok<TrainerProfile>(profile);
  }

  public updateDetails(
    updates: Partial<
      Omit<
        TrainerProfileProps,
        | 'userId'
        | 'totalClients'
        | 'totalReviews'
        | 'averageRating'
        | 'certifications'
        | 'showcase'
        | 'createdAt'
      >
    >,
  ): Result<void> {
    if (updates.headline !== undefined) {
      if (!updates.headline.trim()) return Result.fail<void>('Headline cannot be empty');
      this.props.headline = updates.headline.trim();
    }
    if (updates.bio !== undefined) {
      if (!updates.bio.trim()) return Result.fail<void>('Bio cannot be empty');
      this.props.bio = updates.bio.trim();
    }
    if (updates.yearsOfExperience !== undefined) {
      if (updates.yearsOfExperience < 0)
        return Result.fail<void>('yearsOfExperience cannot be negative');
      this.props.yearsOfExperience = updates.yearsOfExperience;
    }
    if (updates.languages !== undefined)
      this.props.languages = Array.from(new Set(updates.languages));
    if (updates.specializations !== undefined)
      this.props.specializations = Array.from(new Set(updates.specializations));
    if (updates.location !== undefined) this.props.location = updates.location;
    if (updates.availability !== undefined) this.props.availability = updates.availability;

    this.recalculateCompletion();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerProfileUpdatedEvent(this.id));

    return Result.ok<void>();
  }

  public updateAvatar(avatarUrl: string): Result<void> {
    if (!avatarUrl || !avatarUrl.trim()) return Result.fail<void>('Avatar URL is required');
    this.props.avatarUrl = avatarUrl.trim();
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerAvatarUpdatedEvent(this.id, avatarUrl));
    return Result.ok<void>();
  }

  public deleteAvatar(): Result<void> {
    this.props.avatarUrl = null;
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerAvatarDeletedEvent(this.id));
    return Result.ok<void>();
  }

  public updateAvailability(newAvailability: TrainerAvailability): Result<void> {
    this.props.availability = newAvailability;
    this.props.updatedAt = new Date();
    this.addDomainEvent(
      new TrainerAvailabilityChangedEvent(this.id, this.userId, newAvailability.status),
    );
    return Result.ok<void>();
  }

  // Certification management
  public addCertification(certification: TrainerCertification): Result<void> {
    this.props.certifications.push(certification);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerCertificationAddedEvent(this.id, certification.certificationId));
    return Result.ok<void>();
  }

  public updateCertification(
    certificationId: string,
    updates: Partial<Omit<TrainerCertification, 'certificationId' | 'status'>>,
  ): Result<void> {
    const cert = this.props.certifications.find((c) => c.certificationId === certificationId);
    if (!cert)
      return Result.fail<void>(new CertificationNotFoundException(certificationId).message);

    const updateResult = cert.updateDetails(updates);
    if (updateResult.isFailure) return updateResult;

    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerCertificationUpdatedEvent(this.id, certificationId));
    return Result.ok<void>();
  }

  public deleteCertification(certificationId: string): Result<void> {
    const certIndex = this.props.certifications.findIndex(
      (c) => c.certificationId === certificationId,
    );
    if (certIndex === -1)
      return Result.fail<void>(new CertificationNotFoundException(certificationId).message);

    const cert = this.props.certifications[certIndex];
    if (!cert.isEditable()) {
      return Result.fail<void>(new CertificationAlreadyVerifiedException(certificationId).message);
    }

    this.props.certifications.splice(certIndex, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerCertificationDeletedEvent(this.id, certificationId));
    return Result.ok<void>();
  }

  // Showcase management
  public addShowcaseItem(item: TrainerShowcase): Result<void> {
    this.props.showcase.push(item);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerShowcaseAddedEvent(this.id, item.showcaseId));
    return Result.ok<void>();
  }

  public updateShowcaseItem(
    showcaseId: string,
    updates: Partial<Omit<TrainerShowcase, 'showcaseId'>>,
  ): Result<void> {
    const item = this.props.showcase.find((s) => s.showcaseId === showcaseId);
    if (!item) return Result.fail<void>(new ShowcaseItemNotFoundException(showcaseId).message);

    const updateResult = item.updateDetails(updates);
    if (updateResult.isFailure) return updateResult;

    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerShowcaseUpdatedEvent(this.id, showcaseId));
    return Result.ok<void>();
  }

  public deleteShowcaseItem(showcaseId: string): Result<void> {
    const itemIndex = this.props.showcase.findIndex((s) => s.showcaseId === showcaseId);
    if (itemIndex === -1)
      return Result.fail<void>(new ShowcaseItemNotFoundException(showcaseId).message);

    this.props.showcase.splice(itemIndex, 1);
    this.props.updatedAt = new Date();
    this.addDomainEvent(new TrainerShowcaseDeletedEvent(this.id, showcaseId));
    return Result.ok<void>();
  }

  // System-managed reputation metrics (called via cross-domain gateways/events)
  public updateReputationMetrics(
    totalClients?: number,
    totalReviews?: number,
    averageRating?: number,
  ): void {
    if (totalClients !== undefined && totalClients >= 0) this.props.totalClients = totalClients;
    if (totalReviews !== undefined && totalReviews >= 0) this.props.totalReviews = totalReviews;
    if (averageRating !== undefined && averageRating >= 0 && averageRating <= 5.0) {
      this.props.averageRating = Number(averageRating.toFixed(2));
    }
    this.props.updatedAt = new Date();
  }

  public recalculateCompletion(): void {
    const { isComplete } = ProfileCompletionCalculator.calculateTrainerCompletion(this);
    this.props.profileCompleted = isComplete;
  }
}
