import { AuthProvider } from '../../domain/value-objects/AuthProvider';

export interface VerifiedExternalIdentity {
  provider: AuthProvider;
  providerUserId: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  avatarUrl?: string;
}
