import { OAuth2Client } from 'google-auth-library';
import { Result } from '../../../../../shared/result/Result';
import { IGoogleIdentityProvider } from '../../../application/ports/IGoogleIdentityProvider';
import { VerifiedExternalIdentity } from '../../../application/models/VerifiedExternalIdentity';
import { AuthProvider } from '../../../domain/value-objects/AuthProvider';

export class GoogleIdentityProvider implements IGoogleIdentityProvider {
  private client: OAuth2Client;
  private readonly clientId: string;

  constructor(clientId: string) {
    if (!clientId) {
      throw new Error('Google Client ID is missing. Cannot instantiate GoogleIdentityProvider.');
    }
    this.clientId = clientId;
    this.client = new OAuth2Client(this.clientId);
  }

  public async verifyIdToken(idToken: string): Promise<Result<VerifiedExternalIdentity>> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.clientId,
      });

      const payload = ticket.getPayload();
      
      if (!payload) {
        return Result.fail<VerifiedExternalIdentity>('Invalid Google token payload');
      }

      if (!payload.email) {
        return Result.fail<VerifiedExternalIdentity>('Google token is missing email claim');
      }

      if (payload.email_verified !== true) {
        return Result.fail<VerifiedExternalIdentity>('Google email is not verified');
      }

      return Result.ok<VerifiedExternalIdentity>({
        provider: AuthProvider.GOOGLE,
        providerUserId: payload.sub,
        email: payload.email,
        emailVerified: payload.email_verified,
        displayName: payload.name,
        avatarUrl: payload.picture,
      });
    } catch (error: unknown) {
      return Result.fail<VerifiedExternalIdentity>(`Google token verification failed: ${(error as Error).message}`);
    }
  }
}
