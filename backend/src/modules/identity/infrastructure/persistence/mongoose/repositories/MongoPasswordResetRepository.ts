import { ClientSession } from 'mongoose';
import { IPasswordResetRepository } from '../../../../domain/repositories/IPasswordResetRepository';
import { PasswordReset } from '../../../../domain/entities/PasswordReset';
import { PasswordResetModel } from '../models/PasswordResetModel';
import { PasswordResetMapper } from '../mappers/PasswordResetMapper';

export class MongoPasswordResetRepository implements IPasswordResetRepository {
  
  public async save(reset: PasswordReset, mongoSession?: ClientSession): Promise<void> {
    const persistenceData = PasswordResetMapper.toPersistence(reset);
    
    await PasswordResetModel.findOneAndUpdate(
      { _id: persistenceData._id },
      { $set: persistenceData },
      { upsert: true, new: true, session: mongoSession }
    ).exec();
  }

  public async findByTokenHash(hash: string): Promise<PasswordReset | null> {
    const raw = await PasswordResetModel.findOne({ resetTokenHash: hash }).exec();
    if (!raw) return null;
    return PasswordResetMapper.toDomain(raw);
  }

  public async findLatestByUserId(userId: string): Promise<PasswordReset | null> {
    const raw = await PasswordResetModel.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();
    if (!raw) return null;
    return PasswordResetMapper.toDomain(raw);
  }

  public async invalidateExistingByUserId(userId: string, session?: ClientSession): Promise<void> {
    await PasswordResetModel.deleteMany(
      { userId },
      { session }
    ).exec();
  }

  public async markUsed(resetId: string, session?: ClientSession): Promise<void> {
    await PasswordResetModel.updateOne(
      { _id: resetId },
      { $set: { usedAt: new Date() } },
      { session }
    ).exec();
  }

  public async deleteExpired(): Promise<number> {
    const result = await PasswordResetModel.deleteMany({
      expiresAt: { $lt: new Date() }
    }).exec();
    return result.deletedCount || 0;
  }
}
