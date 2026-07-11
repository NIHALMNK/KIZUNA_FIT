import { ClientSession } from 'mongoose';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { EmailAddress } from '../../../../domain/value-objects/EmailAddress';
import { UserModel } from '../models/UserModel';
import { UserMapper } from '../mappers/UserMapper';

export class MongoUserRepository implements IUserRepository {
  
  public async save(user: User, session?: ClientSession): Promise<void> {
    const persistenceData = UserMapper.toPersistence(user);
    
    // We use findOneAndUpdate with upsert to handle both creation and updates safely
    await UserModel.findOneAndUpdate(
      { _id: user.id },
      { $set: persistenceData },
      { upsert: true, new: true, session }
    ).exec();
  }

  public async findById(id: string): Promise<User | null> {
    const raw = await UserModel.findOne({ _id: id }).exec();
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }

  public async findByEmail(email: EmailAddress): Promise<User | null> {
    const raw = await UserModel.findOne({ email: email.value }).exec();
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }

  async findByExternalIdentity(provider: string, providerUserId: string): Promise<User | null> {
    const doc = await UserModel.findOne({
      'externalIdentities.provider': provider,
      'externalIdentities.providerUserId': providerUserId
    }).exec();
    if (!doc) return null;
    return UserMapper.toDomain(doc);
  }

  public async exists(email: EmailAddress): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.value }).exec();
    return count > 0;
  }
}
