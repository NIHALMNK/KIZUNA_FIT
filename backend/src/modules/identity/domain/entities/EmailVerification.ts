import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../value-objects/UserId';
import { EmailAddress } from '../value-objects/EmailAddress';

export interface EmailVerificationProps {
  userId: UserId;
  email: EmailAddress;
  verificationTokenHash: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class EmailVerification extends AggregateRoot<EmailVerificationProps> {
  get userId(): UserId {
    return this.props.userId;
  }

  get email(): EmailAddress {
    return this.props.email;
  }

  get verificationTokenHash(): string {
    return this.props.verificationTokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }

  public isExpired(now: Date): boolean {
    return now > this.props.expiresAt;
  }

  public isVerified(): boolean {
    return this.props.verifiedAt !== undefined;
  }

  private constructor(props: EmailVerificationProps, id?: string) {
    super(props, id || crypto.randomUUID().replace(/-/g, '').substring(0, 24));
  }

  public static create(
    userId: UserId,
    email: EmailAddress,
    verificationTokenHash: string,
    expiresAt: Date,
    id?: string
  ): Result<EmailVerification> {
    const verification = new EmailVerification({
      userId,
      email,
      verificationTokenHash,
      expiresAt
    }, id);

    return Result.ok<EmailVerification>(verification);
  }

  public verify(now: Date): Result<void> {
    if (this.isVerified()) {
      return Result.fail<void>('Email is already verified');
    }
    
    if (this.isExpired(now)) {
      return Result.fail<void>('Verification token expired');
    }

    this.props.verifiedAt = now;
    return Result.ok<void>();
  }
}
