import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.config';

export interface AuthenticatedSocketUser {
  userId: string;
  role: string;
  jti?: string;
}

declare module 'socket.io' {
  interface SocketData {
    user?: AuthenticatedSocketUser;
  }
}

/**
 * Socket.IO authentication middleware.
 * Verifies JWT access token passed via handshake auth payload or Authorization header.
 * Rejects unauthenticated connections and populates socket.data.user upon success.
 * Note: URL query parameter authentication (`query.token`) is explicitly disabled to prevent token leakage in HTTP logs.
 */
export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void): void => {
  try {
    let token: string | undefined = undefined;

    // 1. Check socket.handshake.auth.token
    if (socket.handshake.auth && typeof socket.handshake.auth.token === 'string') {
      token = socket.handshake.auth.token;
    }

    // 2. Check socket.handshake.headers.authorization
    if (
      !token &&
      socket.handshake.headers &&
      typeof socket.handshake.headers.authorization === 'string'
    ) {
      token = socket.handshake.headers.authorization;
    }

    if (!token) {
      return next(new Error('Authentication error: Missing authentication token'));
    }

    // Clean Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
    }) as unknown as {
      sub: string;
      role: string;
      jti?: string;
    };

    if (!decoded.sub) {
      return next(new Error('Authentication error: Invalid token payload (missing subject)'));
    }

    socket.data.user = {
      userId: decoded.sub,
      role: decoded.role,
      jti: decoded.jti,
    };

    return next();
  } catch (error: unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Authentication error: Access token has expired'));
    }
    return next(new Error('Authentication error: Invalid access token'));
  }
};
