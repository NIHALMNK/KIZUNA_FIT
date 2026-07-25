import { env } from './env.config';

export class JwtConfiguration {
  public readonly secret: string;
  public readonly accessExpiresIn: string;
  public readonly refreshExpiresIn: string;
  public readonly issuer: string;
  public readonly audience: string;

  constructor() {
    this.secret = env.JWT_ACCESS_SECRET;
    this.accessExpiresIn = env.JWT_ACCESS_EXPIRES_IN;
    this.refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN;
    this.issuer = env.JWT_ISSUER;
    this.audience = env.JWT_AUDIENCE;
  }
}
