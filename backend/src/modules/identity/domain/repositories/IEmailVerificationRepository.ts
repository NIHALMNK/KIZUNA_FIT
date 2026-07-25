import { EmailVerification } from '../entities/EmailVerification';

export interface IEmailVerificationRepository {
  save(verification: EmailVerification, session?: unknown): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<EmailVerification | null>;
  findLatestByUserId(userId: string): Promise<EmailVerification | null>;
  invalidateExistingByUserId(userId: string, session?: unknown): Promise<void>;
  delete(id: string, session?: unknown): Promise<void>;
  deleteExpired(): Promise<number>;
}
