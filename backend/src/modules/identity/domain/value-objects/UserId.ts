import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface UserIdProps {
  value: string;
}

export class UserId extends ValueObject<UserIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserIdProps) {
    super(props);
  }

  public static create(id: string): Result<UserId> {
    if (!id || id.trim().length === 0) {
      return Result.fail<UserId>('User ID cannot be empty');
    }

    return Result.ok<UserId>(new UserId({ value: id }));
  }
}
