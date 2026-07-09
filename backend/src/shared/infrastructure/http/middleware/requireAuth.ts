import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../../config/env.config';
import { ApiResponse } from '../responses/ApiResponse';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ApiResponse.error(res, 'Missing or invalid Authorization header', 'UNAUTHORIZED', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ['HS256'] }) as unknown as {
      sub: string;
      role: string;
      jti: string;
      iat: number;
      exp: number;
    };
    
    req.auth = {
      userId: decoded.sub,
      role: decoded.role,
      jti: decoded.jti,
      issuedAt: decoded.iat,
      expiresAt: decoded.exp,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      ApiResponse.error(res, 'Access token has expired', 'TOKEN_EXPIRED', 401);
      return;
    }
    
    ApiResponse.error(res, 'Invalid access token', 'UNAUTHORIZED', 401);
    return;
  }
};
