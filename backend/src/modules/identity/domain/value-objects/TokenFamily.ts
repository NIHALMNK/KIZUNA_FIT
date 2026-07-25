import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';

export interface TokenFamilyProps {
  value: string;
}

export class TokenFamily extends ValueObject<TokenFamilyProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: TokenFamilyProps) {
    super(props);
  }

  public static create(family: string): Result<TokenFamily> {
    if (!family || family.trim().length === 0) {
      return Result.fail<TokenFamily>('Token family cannot be empty');
    }

    return Result.ok<TokenFamily>(new TokenFamily({ value: family }));
  }
}
