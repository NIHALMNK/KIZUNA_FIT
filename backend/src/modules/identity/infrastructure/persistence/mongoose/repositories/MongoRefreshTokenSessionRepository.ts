import { ClientSession } from 'mongoose';
import { IRefreshTokenSessionRepository } from '../../../../domain/repositories/IRefreshTokenSessionRepository';
import { RefreshTokenSession } from '../../../../domain/entities/RefreshTokenSession';
import { RefreshTokenId } from '../../../../domain/value-objects/RefreshTokenId';
import { UserId } from '../../../../domain/value-objects/UserId';
import { TokenFamily } from '../../../../domain/value-objects/TokenFamily';
import { RefreshTokenSessionModel } from '../models/RefreshTokenSessionModel';
import { RefreshTokenSessionMapper } from '../mappers/RefreshTokenSessionMapper';

export class MongoRefreshTokenSessionRepository implements IRefreshTokenSessionRepository {
  
  public async save(session: RefreshTokenSession, mongoSession?: ClientSession): Promise<void> {
    const persistenceData = RefreshTokenSessionMapper.toPersistence(session);
    
    await RefreshTokenSessionModel.findOneAndUpdate(
      { _id: session.id },
      { $set: persistenceData },
      { upsert: true, new: true, session: mongoSession }
    ).exec();
  }

  public async findByTokenId(tokenId: RefreshTokenId): Promise<RefreshTokenSession | null> {
    const raw = await RefreshTokenSessionModel.findOne({ tokenId: tokenId.value }).exec();
    if (!raw) return null;
    return RefreshTokenSessionMapper.toDomain(raw);
  }

  public async findActiveSessionsForUser(userId: UserId): Promise<RefreshTokenSession[]> {
    const raws = await RefreshTokenSessionModel.find({ 
      userId: userId.value,
      isRevoked: false,
      expiresAt: { $gt: new Date() }
    }).exec();
    
    return raws.map(raw => RefreshTokenSessionMapper.toDomain(raw));
  }

  public async revokeAllForUser(userId: UserId, mongoSession?: ClientSession): Promise<void> {
    await RefreshTokenSessionModel.updateMany(
      { userId: userId.value, isRevoked: false },
      { $set: { isRevoked: true } },
      { session: mongoSession }
    ).exec();
  }

  public async revokeAllForFamily(family: TokenFamily, mongoSession?: ClientSession): Promise<void> {
    await RefreshTokenSessionModel.updateMany(
      { family: family.value, isRevoked: false },
      { $set: { isRevoked: true } },
      { session: mongoSession }
    ).exec();
  }
}
