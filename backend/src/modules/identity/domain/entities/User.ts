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
import { ExternalIdentity } from '../value-objects/ExternalIdentity';
import { ExternalIdentityLinkedEvent } from '../events/ExternalIdentityLinkedEvent';
import { AuthProvider } from '../value-objects/AuthProvider';

export interface UserProps {
  email: EmailAddress;
  status: UserStatus;
  passwordHash?: PasswordHash;
  emailVerification?: EmailVerification;
  passwordReset?: PasswordReset;
  failedLoginAttempts: number;
  externalIdentities?: ExternalIdentity[];
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

  get externalIdentities(): ExternalIdentity[] {
    return this.props.externalIdentities || [];
  }

  public hasLocalCredentials(): boolean {
    return this.props.passwordHash !== undefined;
  }

  public hasExternalIdentity(provider: AuthProvider): boolean {
    return this.externalIdentities.some(id => id.provider === provider);
  }

  public canAuthenticateWith(provider: AuthProvider): boolean {
    if (provider === AuthProvider.LOCAL) return this.hasLocalCredentials();
    return this.hasExternalIdentity(provider);
  }

  public linkExternalIdentity(identity: ExternalIdentity): Result<void> {
    if (this.status === UserStatus.Deleted || this.status === UserStatus.Locked) {
      return Result.fail<void>('Cannot link identity to deleted or locked account');
    }

    if (!this.props.externalIdentities) {
      this.props.externalIdentities = [];
    }

    if (this.hasExternalIdentity(identity.provider)) {
      return Result.fail<void>('Provider already linked to this account');
    }

    this.props.externalIdentities.push(identity);
    this.addDomainEvent(new ExternalIdentityLinkedEvent({
      userId: this.id,
      provider: identity.provider,
      providerUserId: identity.providerUserId
    }));

    return Result.ok<void>();
  }

  public removeExternalIdentity(provider: AuthProvider, isForceRevoke: boolean = false): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot modify deleted account');
    }

    const isLastMethod = !this.hasLocalCredentials() && this.externalIdentities.length === 1;
    if (isLastMethod && !isForceRevoke) {
      return Result.fail<void>('Cannot remove the final authentication method');
    }

    if (this.props.externalIdentities) {
      this.props.externalIdentities = this.props.externalIdentities.filter(id => id.provider !== provider);
    }

    if (isLastMethod && isForceRevoke) {
      this.lockAccount(); // Safely lock the stranded account
    }

    return Result.ok<void>();
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
          email: user.email,
          provider: props.externalIdentities?.[0]?.provider 
        }));
      }
    }

    return Result.ok<User>(user);
  }

  public verifyEmail(token: VerificationToken, now: Date): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot verify deleted user');
    }

    if (!this.props.emailVerification) {
      return Result.fail<void>('No pending verification found');
    }

    if (this.props.emailVerification.isExpired(now)) {
      return Result.fail<void>('Verification token expired');
    }

    if (!this.props.emailVerification.token.equals(token)) {
      return Result.fail<void>('Invalid verification token');
    }

    this.props.emailVerification.verify(now);
    
    if (this.status === UserStatus.PendingVerification) {
      this.props.status = UserStatus.Active;
    }

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new EmailVerifiedEvent({ id: userIdResult.getValue() }));
    }

    return Result.ok<void>();
  }

  public markEmailAsVerified(): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot verify deleted user');
    }

    if (this.status === UserStatus.PendingVerification) {
      this.props.status = UserStatus.Active;
    }

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

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordChangedEvent({ id: userIdResult.getValue() }));
    }
    
    return Result.ok<void>();
  }

  public requestPasswordReset(token: VerificationToken, expiresAt: Date): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot reset password for deleted user');
    }

    this.props.passwordReset = PasswordReset.create({
      token,
      expiresAt
    });

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordResetRequestedEvent({ 
        id: userIdResult.getValue(), 
        email: this.email 
      }, token));
    }

    return Result.ok<void>();
  }

  public completePasswordReset(token: VerificationToken, newHash: PasswordHash, now: Date): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot reset password for deleted user');
    }

    if (!this.props.passwordReset) {
      return Result.fail<void>('No password reset requested');
    }

    if (this.props.passwordReset.isExpired(now)) {
      return Result.fail<void>('Reset token expired');
    }

    if (this.props.passwordReset.isUsed()) {
      return Result.fail<void>('Reset token already used');
    }

    if (!this.props.passwordReset.token.equals(token)) {
      return Result.fail<void>('Invalid reset token');
    }

    this.props.passwordReset.markAsUsed(now);
    this.props.passwordHash = newHash;

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new PasswordChangedEvent({ id: userIdResult.getValue() }));
    }

    return Result.ok<void>();
  }

  public recordFailedLogin(): void {
    if (this.status === UserStatus.Deleted) return;
    
    this.props.failedLoginAttempts += 1;
  }

  public resetFailedLogins(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.failedLoginAttempts = 0;
  }

  public lockAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Locked;

    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new UserLockedEvent({ id: userIdResult.getValue() }));
    }
  }

  public unlockAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Active;
    this.props.failedLoginAttempts = 0;
  }

  public deleteAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Deleted;
    // Scrub PII
    // EmailAddress should ideally be scrubbed too, but the VO requires a valid email. 
    // We could either leave the email as is and rely on the Deleted state, or overwrite it with a dummy valid email.
    
    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new AccountDeletedEvent({ id: userIdResult.getValue() }));
    }
  }
}
