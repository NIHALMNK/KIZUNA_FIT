export {};

import { AwilixContainer } from 'awilix';

declare global {
  namespace Express {
    interface Request {
      scope: AwilixContainer;
      auth?: {
        userId: string;
        role: string;
        jti: string;
        issuedAt: number;
        expiresAt: number;
      };
    }
  }
}
