import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface RefreshTokenIdProps {
  value: string;
}

export class RefreshTokenId extends ValueObject<RefreshTokenIdProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: RefreshTokenIdProps) {
    super(props);
  }

  public static create(id: string): Result<RefreshTokenId> {
    if (!id || id.trim().length === 0) {
      return Result.fail<RefreshTokenId>('Refresh token ID cannot be empty');
    }

    return Result.ok<RefreshTokenId>(new RefreshTokenId({ value: id }));
  }
}
