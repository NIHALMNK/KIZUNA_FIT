import { ClientSession } from 'mongoose';
import { IRefreshTokenSessionRepository } from '../../../../domain/repositories/IRefreshTokenSessionRepository';
import { RefreshTokenSession } from '../../../../domain/entities/RefreshTokenSession';
import { UserId } from '../../../../domain/value-objects/UserId';
import { RefreshTokenSessionModel } from '../models/RefreshTokenSessionModel';
import { RefreshTokenSessionMapper } from '../mappers/RefreshTokenSessionMapper';

export class MongoRefreshTokenSessionRepository implements IRefreshTokenSessionRepository {
  
  public async save(session: RefreshTokenSession, mongoSession?: ClientSession): Promise<void> {
    const persistenceData = RefreshTokenSessionMapper.toPersistence(session);
    
    await RefreshTokenSessionModel.findOneAndUpdate(
      { _id: persistenceData._id },
      { $set: persistenceData },
      { upsert: true, new: true, session: mongoSession }
    ).exec();
  }

  public async findById(id: string): Promise<RefreshTokenSession | null> {
    const raw = await RefreshTokenSessionModel.findById(id).exec();
    if (!raw) return null;
    return RefreshTokenSessionMapper.toDomain(raw);
  }

  public async findByTokenHash(hash: string): Promise<RefreshTokenSession | null> {
    const raw = await RefreshTokenSessionModel.findOne({ refreshTokenHash: hash }).exec();
    if (!raw) return null;
    return RefreshTokenSessionMapper.toDomain(raw);
  }

  public async findActiveSessionsForUser(userId: UserId): Promise<RefreshTokenSession[]> {
    const raws = await RefreshTokenSessionModel.find({ 
      userId: userId.value,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() }
    }).exec();
    
    return raws.map(raw => RefreshTokenSessionMapper.toDomain(raw));
  }

  public async revokeAllForUser(userId: UserId, mongoSession?: ClientSession): Promise<void> {
    await RefreshTokenSessionModel.updateMany(
      { userId: userId.value, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
      { session: mongoSession }
    ).exec();
  }

  public async deleteById(id: string, mongoSession?: ClientSession): Promise<void> {
    await RefreshTokenSessionModel.deleteOne(
      { _id: id },
      { session: mongoSession }
    ).exec();
  }
}
