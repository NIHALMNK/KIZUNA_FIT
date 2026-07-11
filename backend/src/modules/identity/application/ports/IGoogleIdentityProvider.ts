import { Result } from '../../../../shared/result/Result';
import { VerifiedExternalIdentity } from '../models/VerifiedExternalIdentity';

export interface IGoogleIdentityProvider {
  verifyIdToken(idToken: string): Promise<Result<VerifiedExternalIdentity>>;
}
