import { ValueObject } from '../../../../shared/value-objects/ValueObject';
import { Result } from '../../../../shared/result/Result';
import { AuthProvider } from './AuthProvider';

export interface ExternalIdentityProps {
  provider: AuthProvider;
  providerUserId: string;
}

export class ExternalIdentity extends ValueObject<ExternalIdentityProps> {
  get provider(): AuthProvider {
    return this.props.provider;
  }

  get providerUserId(): string {
    return this.props.providerUserId;
  }

  private constructor(props: ExternalIdentityProps) {
    super(props);
  }

  public static create(props: ExternalIdentityProps): Result<ExternalIdentity> {
    if (!props.provider) {
      return Result.fail<ExternalIdentity>('Provider is required');
    }

    if (!props.providerUserId || props.providerUserId.trim().length === 0) {
      return Result.fail<ExternalIdentity>('Provider user ID is required');
    }

    return Result.ok<ExternalIdentity>(new ExternalIdentity(props));
  }

  public equals(vo?: ExternalIdentity): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return this.provider === vo.provider && this.providerUserId === vo.providerUserId;
  }
}
