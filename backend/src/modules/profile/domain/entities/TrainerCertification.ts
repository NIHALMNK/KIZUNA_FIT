import { Entity } from '../../../../shared/core/Entity';
import { Result } from '../../../../shared/result/Result';
import { CertificationStatus } from '../enums/TrainerEnums';
import { CertificationAlreadyVerifiedException } from '../exceptions/DomainExceptions';

export interface TrainerCertificationProps {
  title: string;
  organization: string;
  issuedAt: Date;
  expiresAt?: Date;
  certificateUrl: string;
  status: CertificationStatus;
  rejectionReason?: string;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TrainerCertification extends Entity<TrainerCertificationProps> {
  get certificationId(): string {
    return this._id;
  }

  get title(): string {
    return this.props.title;
  }

  get organization(): string {
    return this.props.organization;
  }

  get issuedAt(): Date {
    return this.props.issuedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get certificateUrl(): string {
    return this.props.certificateUrl;
  }

  get status(): CertificationStatus {
    return this.props.status;
  }

  get rejectionReason(): string | undefined {
    return this.props.rejectionReason;
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt || new Date();
  }

  get updatedAt(): Date {
    return this.props.updatedAt || new Date();
  }

  private constructor(props: TrainerCertificationProps, id?: string) {
    super(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id || crypto.randomUUID().replace(/-/g, '').substring(0, 24),
    );
  }

  public static create(
    props: TrainerCertificationProps,
    id?: string,
  ): Result<TrainerCertification> {
    if (!props.title || !props.title.trim()) {
      return Result.fail<TrainerCertification>('Certification title is required');
    }
    if (!props.organization || !props.organization.trim()) {
      return Result.fail<TrainerCertification>('Organization is required');
    }
    if (!props.certificateUrl || !props.certificateUrl.trim()) {
      return Result.fail<TrainerCertification>('Certificate URL is required');
    }
    if (props.expiresAt && props.expiresAt <= props.issuedAt) {
      return Result.fail<TrainerCertification>('Expiration date must be after issue date');
    }

    return Result.ok<TrainerCertification>(new TrainerCertification(props, id));
  }

  public isEditable(): boolean {
    return this.props.status !== CertificationStatus.APPROVED;
  }

  public updateDetails(
    updates: Partial<Omit<TrainerCertificationProps, 'createdAt' | 'status'>>,
  ): Result<void> {
    if (this.props.status === CertificationStatus.APPROVED) {
      return Result.fail<void>(new CertificationAlreadyVerifiedException(this.id).message);
    }

    if (updates.title !== undefined) {
      if (!updates.title.trim()) return Result.fail<void>('Title cannot be empty');
      this.props.title = updates.title.trim();
    }
    if (updates.organization !== undefined) {
      if (!updates.organization.trim()) return Result.fail<void>('Organization cannot be empty');
      this.props.organization = updates.organization.trim();
    }
    if (updates.certificateUrl !== undefined) {
      if (!updates.certificateUrl.trim())
        return Result.fail<void>('Certificate URL cannot be empty');
      this.props.certificateUrl = updates.certificateUrl.trim();
    }
    if (updates.issuedAt !== undefined) this.props.issuedAt = updates.issuedAt;
    if (updates.expiresAt !== undefined) {
      if (updates.expiresAt && updates.expiresAt <= this.props.issuedAt) {
        return Result.fail<void>('Expiration date must be after issue date');
      }
      this.props.expiresAt = updates.expiresAt;
    }

    // Reset status to PENDING if it was REJECTED previously
    this.props.status = CertificationStatus.PENDING;
    this.props.rejectionReason = undefined;
    this.props.updatedAt = new Date();

    return Result.ok<void>();
  }

  public approve(): void {
    this.props.status = CertificationStatus.APPROVED;
    this.props.verifiedAt = new Date();
    this.props.rejectionReason = undefined;
    this.props.updatedAt = new Date();
  }

  public reject(reason: string): void {
    this.props.status = CertificationStatus.REJECTED;
    this.props.rejectionReason = reason;
    this.props.updatedAt = new Date();
  }

  public isExpired(): boolean {
    if (!this.props.expiresAt) return false;
    return new Date() > this.props.expiresAt;
  }
}
