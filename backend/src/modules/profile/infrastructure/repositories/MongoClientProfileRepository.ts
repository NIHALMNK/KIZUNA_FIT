import { IClientProfileRepository } from '../../domain/repositories/IClientProfileRepository';
import { ClientProfile } from '../../domain/aggregates/ClientProfile';
import { ClientProfileModel } from '../persistence/mongoose/models/ClientProfileModel';
import { ClientProfilePersistenceMapper } from '../persistence/mongoose/mappers/ClientProfilePersistenceMapper';

export class MongoClientProfileRepository implements IClientProfileRepository {
  public async findById(id: string): Promise<ClientProfile | null> {
    const doc = await ClientProfileModel.findById(id).exec();
    if (!doc) return null;
    return ClientProfilePersistenceMapper.toDomain(doc);
  }

  public async findByUserId(userId: string): Promise<ClientProfile | null> {
    const doc = await ClientProfileModel.findOne({ userId }).exec();
    if (!doc) return null;
    return ClientProfilePersistenceMapper.toDomain(doc);
  }

  public async existsByUserId(userId: string): Promise<boolean> {
    const count = await ClientProfileModel.countDocuments({ userId }).exec();
    return count > 0;
  }

  public async save(profile: ClientProfile): Promise<void> {
    const raw = ClientProfilePersistenceMapper.toPersistence(profile);
    await ClientProfileModel.findByIdAndUpdate(profile.id, raw, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
  }

  public async delete(id: string): Promise<void> {
    await ClientProfileModel.findByIdAndDelete(id).exec();
  }
}
