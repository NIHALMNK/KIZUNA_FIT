import { PasswordReset } from '../entities/PasswordReset';

export interface IPasswordResetRepository {
  save(reset: PasswordReset, session?: unknown): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<PasswordReset | null>;
  findLatestByUserId(userId: string): Promise<PasswordReset | null>;
  invalidateExistingByUserId(userId: string, session?: unknown): Promise<void>;
  markUsed(resetId: string, session?: unknown): Promise<void>;
  deleteExpired(): Promise<number>;
}
