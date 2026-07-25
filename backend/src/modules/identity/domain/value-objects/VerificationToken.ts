import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface VerificationTokenProps {
  value: string;
}

export class VerificationToken extends ValueObject<VerificationTokenProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: VerificationTokenProps) {
    super(props);
  }

  public static create(token: string): Result<VerificationToken> {
    if (!token || token.trim().length === 0) {
      return Result.fail<VerificationToken>('Verification token cannot be empty');
    }

    return Result.ok<VerificationToken>(new VerificationToken({ value: token }));
  }
}
