import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface PasswordHashProps {
  value: string;
}

export class PasswordHash extends ValueObject<PasswordHashProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: PasswordHashProps) {
    super(props);
  }

  public static create(hash: string): Result<PasswordHash> {
    if (!hash || hash.trim().length === 0) {
      return Result.fail<PasswordHash>('Password hash cannot be empty');
    }

    return Result.ok<PasswordHash>(new PasswordHash({ value: hash }));
  }
}
