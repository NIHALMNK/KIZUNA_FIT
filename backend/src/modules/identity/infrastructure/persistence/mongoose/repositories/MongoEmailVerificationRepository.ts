import { ClientSession } from 'mongoose';
import { IEmailVerificationRepository } from '../../../../domain/repositories/IEmailVerificationRepository';
import { EmailVerification } from '../../../../domain/entities/EmailVerification';
import { EmailVerificationModel } from '../models/EmailVerificationModel';
import { EmailVerificationMapper } from '../mappers/EmailVerificationMapper';

export class MongoEmailVerificationRepository implements IEmailVerificationRepository {
  
  public async save(verification: EmailVerification, mongoSession?: ClientSession): Promise<void> {
    const persistenceData = EmailVerificationMapper.toPersistence(verification);
    
    await EmailVerificationModel.findOneAndUpdate(
      { _id: persistenceData._id },
      { $set: persistenceData },
      { upsert: true, new: true, session: mongoSession }
    ).exec();
  }

  public async findByTokenHash(hash: string): Promise<EmailVerification | null> {
    const raw = await EmailVerificationModel.findOne({ verificationTokenHash: hash }).exec();
    if (!raw) return null;
    return EmailVerificationMapper.toDomain(raw);
  }

  public async findLatestByUserId(userId: string): Promise<EmailVerification | null> {
    const raw = await EmailVerificationModel.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();
    if (!raw) return null;
    return EmailVerificationMapper.toDomain(raw);
  }

  public async invalidateExistingByUserId(userId: string, session?: ClientSession): Promise<void> {
    await EmailVerificationModel.deleteMany(
      { userId },
      { session }
    ).exec();
  }

  public async delete(verificationId: string, session?: ClientSession): Promise<void> {
    await EmailVerificationModel.deleteOne(
      { _id: verificationId },
      { session }
    ).exec();
  }

  public async deleteExpired(): Promise<number> {
    const result = await EmailVerificationModel.deleteMany({
      expiresAt: { $lt: new Date() }
    }).exec();
    return result.deletedCount || 0;
  }
}
