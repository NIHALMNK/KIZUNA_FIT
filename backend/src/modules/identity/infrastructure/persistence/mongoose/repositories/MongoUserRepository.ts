import { ClientSession } from 'mongoose';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';

import { UserModel } from '../models/UserModel';
import { UserMapper } from '../mappers/UserMapper';

export class MongoUserRepository implements IUserRepository {
  
  public async save(user: User, session?: ClientSession): Promise<void> {
    const persistenceData = UserMapper.toPersistence(user);
    
    // We use findOneAndUpdate with upsert to handle both creation and updates safely
    await UserModel.findOneAndUpdate(
      { _id: persistenceData._id },
      { $set: persistenceData },
      { upsert: true, new: true, session }
    ).exec();
  }

  public async findById(id: string): Promise<User | null> {
    const raw = await UserModel.findOne({ _id: id }).exec();
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }

  public async findByEmail(email: string): Promise<User | null> {
    const raw = await UserModel.findOne({ email }).exec();
    if (!raw) return null;
    return UserMapper.toDomain(raw);
  }



  public async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email }).exec();
    return count > 0;
  }
}
