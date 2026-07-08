import { z } from 'zod';

const jwtConfigSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for secure HS256 signing.'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  JWT_ISSUER: z.string().default('kizunafit-api'),
  JWT_AUDIENCE: z.string().default('kizunafit-client'),
});



export class JwtConfiguration {
  public readonly secret: string;
  public readonly accessExpiresIn: string;
  public readonly refreshExpiresIn: string;
  public readonly issuer: string;
  public readonly audience: string;

  constructor() {
    const parsed = jwtConfigSchema.safeParse(process.env);
    
    if (!parsed.success) {
      throw new Error(`Fatal configuration error: Invalid JWT environment variables. ${parsed.error.message}`);
    }

    this.secret = parsed.data.JWT_SECRET;
    this.accessExpiresIn = parsed.data.JWT_ACCESS_EXPIRES_IN;
    this.refreshExpiresIn = parsed.data.JWT_REFRESH_EXPIRES_IN;
    this.issuer = parsed.data.JWT_ISSUER;
    this.audience = parsed.data.JWT_AUDIENCE;
  }
}
