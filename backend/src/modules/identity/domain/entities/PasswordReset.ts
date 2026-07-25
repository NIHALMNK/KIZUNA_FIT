import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../value-objects/UserId';

export interface PasswordResetProps {
  userId: UserId;
  resetTokenHash: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PasswordReset extends AggregateRoot<PasswordResetProps> {
  get userId(): UserId {
    return this.props.userId;
  }

  get resetTokenHash(): string {
    return this.props.resetTokenHash;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get usedAt(): Date | undefined {
    return this.props.usedAt;
  }

  public isExpired(now: Date): boolean {
    return now > this.props.expiresAt;
  }

  public isUsed(): boolean {
    return this.props.usedAt !== undefined;
  }

  private constructor(props: PasswordResetProps, id?: string) {
    super(props, id || crypto.randomUUID().replace(/-/g, '').substring(0, 24));
  }

  public static create(
    userId: UserId,
    resetTokenHash: string,
    expiresAt: Date,
    id?: string
  ): Result<PasswordReset> {
    const reset = new PasswordReset({
      userId,
      resetTokenHash,
      expiresAt
    }, id);

    return Result.ok<PasswordReset>(reset);
  }

  public markAsUsed(now: Date): Result<void> {
    if (this.isUsed()) {
      return Result.fail<void>('Reset token is already used');
    }

    if (this.isExpired(now)) {
      return Result.fail<void>('Reset token expired');
    }

    this.props.usedAt = now;
    return Result.ok<void>();
  }
}
