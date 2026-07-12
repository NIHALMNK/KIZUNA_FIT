import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../value-objects/UserId';
import { EmailAddress } from '../value-objects/EmailAddress';
import { PasswordHash } from '../value-objects/PasswordHash';
import { UserStatus } from './UserStatus';
import { UserRole } from '../value-objects/UserRole';
import { AuthProvider } from '../value-objects/AuthProvider';
import { UserRegisteredEvent } from '../events/UserRegisteredEvent';
import { EmailVerifiedEvent } from '../events/EmailVerifiedEvent';
import { PasswordChangedEvent } from '../events/PasswordChangedEvent';
import { AccountDeletedEvent } from '../events/AccountDeletedEvent';

export interface UserProps {
  fullName: string;
  email: EmailAddress;
  authProviders: AuthProvider[];
  passwordHash?: PasswordHash;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends AggregateRoot<UserProps> {
  get fullName(): string {
    return this.props.fullName;
  }

  get email(): EmailAddress {
    return this.props.email;
  }

  get authProviders(): AuthProvider[] {
    return this.props.authProviders;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get status(): UserStatus {
    return this.props.status;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get passwordHash(): PasswordHash | undefined {
    return this.props.passwordHash;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  public hasLocalCredentials(): boolean {
    return this.props.passwordHash !== undefined;
  }

  public hasExternalIdentity(provider: AuthProvider): boolean {
    return this.authProviders.includes(provider);
  }

  public canAuthenticateWith(provider: AuthProvider): boolean {
    if (provider === AuthProvider.LOCAL) return this.hasLocalCredentials();
    return this.hasExternalIdentity(provider);
  }

  public linkExternalIdentity(provider: AuthProvider): Result<void> {
    if (this.status === UserStatus.Deleted || this.status === UserStatus.Suspended || this.status === UserStatus.Banned) {
      return Result.fail<void>('Cannot link identity to deleted, suspended, or banned account');
    }

    if (this.hasExternalIdentity(provider)) {
      return Result.fail<void>('Provider already linked to this account');
    }

    this.props.authProviders.push(provider);
    return Result.ok<void>();
  }

  public removeExternalIdentity(provider: AuthProvider, isForceRevoke: boolean = false): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot modify deleted account');
    }

    const isLastMethod = !this.hasLocalCredentials() && this.authProviders.length === 1;
    if (isLastMethod && !isForceRevoke) {
      return Result.fail<void>('Cannot remove the final authentication method');
    }

    this.props.authProviders = this.props.authProviders.filter(p => p !== provider);

    if (isLastMethod && isForceRevoke) {
      this.props.status = UserStatus.Suspended;
    }

    return Result.ok<void>();
  }

  private constructor(props: UserProps, id?: string) {
    super(props, id || crypto.randomUUID().replace(/-/g, '').substring(0, 24));
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
          provider: props.authProviders[0] 
        }));
      }
    }

    return Result.ok<User>(user);
  }

  public markEmailAsVerified(): Result<void> {
    if (this.status === UserStatus.Deleted) {
      return Result.fail<void>('Cannot verify deleted user');
    }
    
    this.props.emailVerified = true;

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

  public recordLogin(now: Date): void {
    if (this.status === UserStatus.Deleted) return;
    this.props.lastLoginAt = now;
  }

  public deleteAccount(): void {
    if (this.status === UserStatus.Deleted) return;

    this.props.status = UserStatus.Deleted;
    
    const userIdResult = UserId.create(this.id);
    if (userIdResult.isSuccess) {
      this.addDomainEvent(new AccountDeletedEvent({ id: userIdResult.getValue() }));
    }
  }
}
