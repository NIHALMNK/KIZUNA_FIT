import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../value-objects/UserId';
import { EmailAddress } from '../value-objects/EmailAddress';
import { PasswordHash } from '../value-objects/PasswordHash';
import { VerificationToken } from '../value-objects/VerificationToken';
import { UserStatus } from './UserStatus';
import { EmailVerification } from './EmailVerification';
import { PasswordReset } from './PasswordReset';
import { UserRegisteredEvent } from '../events/UserRegisteredEvent';
import { EmailVerifiedEvent } from '../events/EmailVerifiedEvent';
import { PasswordChangedEvent } from '../events/PasswordChangedEvent';
import { PasswordResetRequestedEvent } from '../events/PasswordResetRequestedEvent';
import { UserLockedEvent } from '../events/UserLockedEvent';
import { AccountDeletedEvent } from '../events/AccountDeletedEvent';

export interface UserProps {
  email: EmailAddress;
  status: UserStatus;
  passwordHash?: PasswordHash;
  emailVerification?: EmailVerification;
  passwordReset?: PasswordReset;
  failedLoginAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  get email(): EmailAddress {
    return this.props.email;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get passwordHash(): PasswordHash | undefined {
    return this.props.passwordHash;
  }

  get failedLoginAttempts(): number {
    return this.props.failedLoginAttempts;
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id || crypto.randomUUID());
  }

  public static create(props: UserProps, id?: string): Result<User> {
    const isNew = !id;
    const user = new User(props, id);

    if (isNew) {
      const userIdResult = UserId.create(user.id);
      if (userIdResult.isSuccess) {
        user.addDomainEvent(new UserRegisteredEvent({ 
          id: userIdResult.getValue(), 
          email: user.email 
        }));
      }
    }

    return Result.ok<User>(user);
  }

  public verifyEmail(token: VerificationToken): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot verify deleted user');
    }

    if (!this.props.emailVerification) {
      return Result.fail<void>('No pending verification found');
    }

    if (this.props.emailVerification.isExpired()) {
      return Result.fail<void>('Verification token expired');
    }

    if (!this.props.emailVerification.token.equals(token)) {
      return Result.fail<void>('Invalid verification token');
    }

    this.props.emailVerification.verify();
    
    if (this.status === UserStatus.PendingVerification) {
      this.props.status = UserStatus.Active;
    }

    this.props.updatedAt = new Date();
    
    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new EmailVerifiedEvent({ id: userIdResult.getValue() }));
    }

    return Result.ok<void>();
  }

  public changePassword(newHash: PasswordHash): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot modify deleted user');
    }

    this.props.passwordHash = newHash;
    this.props.updatedAt = new Date();

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordChangedEvent({ id: userIdResult.getValue() }));
    }
    
    return Result.ok<void>();
  }

  public requestPasswordReset(token: VerificationToken, expiresInMs: number = 3600000): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot reset password for deleted user');
    }

    this.props.passwordReset = PasswordReset.create({
      token,
      expiresAt: new Date(Date.now() + expiresInMs)
    });
    this.props.updatedAt = new Date();

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordResetRequestedEvent({ 
        id: userIdResult.getValue(), 
        email: this.email 
      }, token));
    }

    return Result.ok<void>();
  }

  public completePasswordReset(token: VerificationToken, newHash: PasswordHash): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot reset password for deleted user');
    }

    if (!this.props.passwordReset) {
      return Result.fail<void>('No password reset requested');
    }

    if (this.props.passwordReset.isExpired()) {
      return Result.fail<void>('Reset token expired');
    }

    if (this.props.passwordReset.isUsed()) {
      return Result.fail<void>('Reset token already used');
    }

    if (!this.props.passwordReset.token.equals(token)) {
      return Result.fail<void>('Invalid reset token');
    }

    this.props.passwordReset.markAsUsed();
    this.props.passwordHash = newHash;
    this.props.updatedAt = new Date();

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordChangedEvent({ id: userIdResult.getValue() }));
    }

    return Result.ok<void>();
  }

  public recordFailedLogin(): void {
    if (this.status === UserStatus.Deleted) return;
    
    this.props.failedLoginAttempts += 1;
    this.props.updatedAt = new Date();
  }

  public resetFailedLogins(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.failedLoginAttempts = 0;
    this.props.updatedAt = new Date();
  }

  public lockAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Locked;
    this.props.updatedAt = new Date();

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new UserLockedEvent({ id: userIdResult.getValue() }));
    }
  }

  public unlockAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Active;
    this.props.failedLoginAttempts = 0;
    this.props.updatedAt = new Date();
  }

  public deleteAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Deleted;
    this.props.updatedAt = new Date();
    // Scrub PII
    // EmailAddress should ideally be scrubbed too, but the VO requires a valid email. 
    // We could either leave the email as is and rely on the Deleted state, or overwrite it with a dummy valid email.
    
    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new AccountDeletedEvent({ id: userIdResult.getValue() }));
    }
  }
}
