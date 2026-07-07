import { Entity } from '../../../../shared/core/Entity';
import { VerificationToken } from '../value-objects/VerificationToken';

export interface EmailVerificationProps {
  token: VerificationToken;
  expiresAt: Date;
  verifiedAt?: Date;
}

export class EmailVerification extends Entity<EmailVerificationProps> {
  get token(): VerificationToken {
    return this.props.token;
  }

  get expiresAt(): Date {
    return this.props.expiresAt;
  }

  get verifiedAt(): Date | undefined {
    return this.props.verifiedAt;
  }

  public isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  public isVerified(): boolean {
    return !!this.props.verifiedAt;
  }

  public verify(): void {
    this.props.verifiedAt = new Date();
  }

  private constructor(props: EmailVerificationProps, id?: string) {
    super(props, id || crypto.randomUUID());
  }

  public static create(props: EmailVerificationProps, id?: string): EmailVerification {
    return new EmailVerification(props, id);
  }
}
