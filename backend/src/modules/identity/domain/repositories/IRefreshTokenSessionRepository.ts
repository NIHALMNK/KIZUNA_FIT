import { RefreshTokenSession } from '../entities/RefreshTokenSession';
import { UserId } from '../value-objects/UserId';

export interface IRefreshTokenSessionRepository {
  save(session: RefreshTokenSession, uowSession?: unknown): Promise<void>;
  findById(id: string): Promise<RefreshTokenSession | null>;
  findByTokenHash(hash: string): Promise<RefreshTokenSession | null>;
  findActiveSessionsForUser(userId: UserId): Promise<RefreshTokenSession[]>;
  revokeAllForUser(userId: UserId, uowSession?: unknown): Promise<void>;
  deleteById(id: string, uowSession?: unknown): Promise<void>;
}
