import { Entity } from '../../../../shared/core/Entity';
import { VerificationToken } from '../value-objects/VerificationToken';


export interface PasswordResetProps {
  token: VerificationToken;
  expiresAt: Date;
  usedAt?: Date;
}

export class PasswordReset extends Entity<PasswordResetProps> {
  get token(): VerificationToken {
    return this.props.token;
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
    return !!this.props.usedAt;
  }

  public markAsUsed(now: Date): void {
    this.props.usedAt = now;
  }

  private constructor(props: PasswordResetProps, id?: string) {
    super(props, id || crypto.randomUUID());
  }

  public static create(props: PasswordResetProps, id?: string): PasswordReset {
    return new PasswordReset(props, id);
  }
}
