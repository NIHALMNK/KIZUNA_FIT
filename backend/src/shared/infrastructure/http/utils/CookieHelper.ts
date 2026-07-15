import { Response } from 'express';
import { env } from '../../../../config/env.config';

export class CookieHelper {
  static setRefreshToken(res: Response, token: string): void {
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days (should ideally parse env.JWT_REFRESH_EXPIRES_IN)

    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/identity',
      maxAge: maxAgeMs,
    });
  }

  static clearRefreshToken(res: Response): void {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/identity',
      maxAge: 0,
    });
  }
}
