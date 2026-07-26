import { ITrainerProfileRepository } from '../../domain/repositories/ITrainerProfileRepository';
import { TrainerProfile } from '../../domain/aggregates/TrainerProfile';
import { SearchTrainerQuery } from '../../application/dto/public/search-trainer.query';
import { TrainerProfileModel } from '../persistence/mongoose/models/TrainerProfileModel';
import { TrainerProfilePersistenceMapper } from '../persistence/mongoose/mappers/TrainerProfilePersistenceMapper';

export class MongoTrainerProfileRepository implements ITrainerProfileRepository {
  public async findById(id: string): Promise<TrainerProfile | null> {
    const doc = await TrainerProfileModel.findById(id).exec();
    if (!doc) return null;
    return TrainerProfilePersistenceMapper.toDomain(doc);
  }

  public async findByUserId(userId: string): Promise<TrainerProfile | null> {
    const doc = await TrainerProfileModel.findOne({ userId }).exec();
    if (!doc) return null;
    return TrainerProfilePersistenceMapper.toDomain(doc);
  }

  public async existsByUserId(userId: string): Promise<boolean> {
    const count = await TrainerProfileModel.countDocuments({ userId }).exec();
    return count > 0;
  }

  public async save(profile: TrainerProfile): Promise<void> {
    const raw = TrainerProfilePersistenceMapper.toPersistence(profile);
    await TrainerProfileModel.findByIdAndUpdate(profile.id, raw, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
  }

  public async searchTrainers(
    query: SearchTrainerQuery,
  ): Promise<{ profiles: TrainerProfile[]; total: number }> {
    const filter: Record<string, unknown> = {
      profileCompleted: true,
    };

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ headline: searchRegex }, { bio: searchRegex }];
    }

    if (query.specialization) {
      filter.specializations = query.specialization;
    }

    if (query.availability) {
      filter['availability.status'] = query.availability;
    }

    if (query.minRating !== undefined && query.minRating > 0) {
      filter.averageRating = { $gte: query.minRating };
    }

    if (query.verifiedOnly) {
      filter['certifications.status'] = 'APPROVED';
    }

    const sortOptions: Record<string, 1 | -1> = {};
    const sortOrderNum = query.sortOrder === 'asc' ? 1 : -1;

    if (query.sortBy === 'rating') {
      sortOptions.averageRating = sortOrderNum;
    } else if (query.sortBy === 'experience') {
      sortOptions.yearsOfExperience = sortOrderNum;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (query.page - 1) * query.limit;

    const [docs, total] = await Promise.all([
      TrainerProfileModel.find(filter).sort(sortOptions).skip(skip).limit(query.limit).exec(),
      TrainerProfileModel.countDocuments(filter).exec(),
    ]);

    const profiles = docs.map((d) => TrainerProfilePersistenceMapper.toDomain(d));

    return { profiles, total };
  }

  public async delete(id: string): Promise<void> {
    await TrainerProfileModel.findByIdAndDelete(id).exec();
  }
}
