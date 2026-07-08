import { RefreshTokenSession } from '../entities/RefreshTokenSession';
import { RefreshTokenId } from '../value-objects/RefreshTokenId';
import { UserId } from '../value-objects/UserId';
import { TokenFamily } from '../value-objects/TokenFamily';

export interface IRefreshTokenSessionRepository {
  save(session: RefreshTokenSession, uowSession?: unknown): Promise<void>;
  findByTokenId(tokenId: RefreshTokenId): Promise<RefreshTokenSession | null>;
  findActiveSessionsForUser(userId: UserId): Promise<RefreshTokenSession[]>;
  revokeAllForUser(userId: UserId, uowSession?: unknown): Promise<void>;
  revokeAllForFamily(family: TokenFamily, uowSession?: unknown): Promise<void>;
}
