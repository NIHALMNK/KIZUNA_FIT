import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ITokenProvider } from '../../../application/ports/ITokenProvider';
import { User } from '../../../domain/entities/User';
import { RefreshTokenSession } from '../../../domain/entities/RefreshTokenSession';
import { JwtConfiguration } from '../../../../../config/JwtConfiguration';

export class JwtTokenProvider implements ITokenProvider {
  constructor(private readonly config: JwtConfiguration) {}

  public async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      jti: crypto.randomUUID(),
      email: user.email.value,
      status: user.status
    };

    try {
      // jwt.sign allows string for expiresIn (e.g. "15m"), but @types/jsonwebtoken restricts it.
      // We use 'as never' to safely bypass the overly strict type definition without using 'any' or '@ts-ignore'.
      return jwt.sign(payload, this.config.secret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
        expiresIn: this.config.accessExpiresIn as never
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Access token generation failed: ${message}`);
    }
  }

  public async generateRefreshToken(session: RefreshTokenSession): Promise<string> {
    const payload = {
      sub: session.userId.value,
      jti: session.tokenId.value
    };

    // No expiry on the JWT itself since the DB session holds the true TTL.
    try {
      return jwt.sign(payload, this.config.secret, {
        issuer: this.config.issuer,
        audience: this.config.audience
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Refresh token generation failed: ${message}`);
    }
  }
}
