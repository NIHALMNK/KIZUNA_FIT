import { describe, it, expect, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { socketAuthMiddleware } from '../../../src/infrastructure/websocket/middleware/socket-auth.middleware';
import { env } from '../../../src/config/env.config';

describe('socketAuthMiddleware (TEST R1, R3)', () => {
  it('TEST R1 — should accept valid token from auth payload or Authorization header', () => {
    const validToken = jwt.sign(
      { sub: 'user_999', role: 'TRAINER', jti: 'jti_abc' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' },
    );

    const mockSocketAuthPayload: any = {
      handshake: { auth: { token: validToken } },
      data: {},
    };
    const nextAuth = vi.fn();
    socketAuthMiddleware(mockSocketAuthPayload, nextAuth);
    expect(nextAuth).toHaveBeenCalledWith();
    expect(mockSocketAuthPayload.data.user?.userId).toBe('user_999');

    const mockSocketHeaderPayload: any = {
      handshake: { headers: { authorization: `Bearer ${validToken}` } },
      data: {},
    };
    const nextHeader = vi.fn();
    socketAuthMiddleware(mockSocketHeaderPayload, nextHeader);
    expect(nextHeader).toHaveBeenCalledWith();
    expect(mockSocketHeaderPayload.data.user?.userId).toBe('user_999');
  });

  it('TEST R3 — should reject query-token authentication to prevent token leakage in HTTP logs', () => {
    const validToken = jwt.sign({ sub: 'user_999', role: 'TRAINER' }, env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });

    const mockSocketQueryToken: any = {
      handshake: {
        auth: {},
        headers: {},
        query: { token: validToken },
      },
      data: {},
    };
    const nextFn = vi.fn();

    socketAuthMiddleware(mockSocketQueryToken, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(Error));
    expect(nextFn.mock.calls[0][0].message).toContain('Missing authentication token');
  });

  it('should reject connection if access token has expired', () => {
    const expiredToken = jwt.sign({ sub: 'user_123', role: 'CLIENT' }, env.JWT_ACCESS_SECRET, {
      expiresIn: '-1s',
    });

    const mockSocket: any = {
      handshake: { auth: { token: `Bearer ${expiredToken}` } },
      data: {},
    };
    const nextFn = vi.fn();

    socketAuthMiddleware(mockSocket, nextFn);

    expect(nextFn).toHaveBeenCalledWith(expect.any(Error));
    expect(nextFn.mock.calls[0][0].message).toContain('Access token has expired');
  });
});
