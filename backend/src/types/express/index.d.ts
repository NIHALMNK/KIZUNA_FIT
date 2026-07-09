export {};

declare global {
  namespace Express {
    interface Request {
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
