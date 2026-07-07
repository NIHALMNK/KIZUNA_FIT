import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface EmailAddressProps {
  value: string;
}

export class EmailAddress extends ValueObject<EmailAddressProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailAddressProps) {
    super(props);
  }

  private static isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  public static create(email: string): Result<EmailAddress> {
    if (!email) {
      return Result.fail<EmailAddress>('Email address is required');
    }

    if (!this.isValidEmail(email)) {
      return Result.fail<EmailAddress>('Invalid email address format');
    }

    return Result.ok<EmailAddress>(new EmailAddress({ value: this.format(email) }));
  }
}
