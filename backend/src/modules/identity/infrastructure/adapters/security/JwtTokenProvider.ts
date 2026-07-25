import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { ITokenProvider } from '../../../application/ports/ITokenProvider';
import { User } from '../../../domain/entities/User';
import { JwtConfiguration } from '../../../../../config/JwtConfiguration';

export class JwtTokenProvider implements ITokenProvider {
  constructor(private readonly config: JwtConfiguration) {}

  public async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      jti: crypto.randomUUID(),
      email: user.email.value,
      role: user.role,
      status: user.status
    };

    try {
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

  public async generateRefreshToken(): Promise<{ token: string, hash: string }> {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return { token, hash };
  }
}
