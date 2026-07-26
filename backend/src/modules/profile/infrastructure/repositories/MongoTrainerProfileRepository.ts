import { PipelineStage } from 'mongoose';
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

  public async delete(id: string): Promise<void> {
    await TrainerProfileModel.findByIdAndDelete(id).exec();
  }

  public async searchTrainers(
    query: SearchTrainerQuery,
  ): Promise<{ profiles: TrainerProfile[]; total: number }> {
    const matchStage: Record<string, unknown> = {
      profileCompleted: true,
    };

    if (query.specialization) {
      matchStage.specializations = query.specialization;
    }

    if (query.availability) {
      matchStage['availability.status'] = query.availability;
    }

    if (query.minRating !== undefined && query.minRating > 0) {
      matchStage.averageRating = { $gte: query.minRating };
    }

    if (query.verifiedOnly) {
      matchStage['certifications.status'] = 'APPROVED';
    }

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      matchStage.$or = [
        { 'user.fullName': searchRegex },
        { headline: searchRegex },
        { bio: searchRegex },
      ];
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

    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          let: { trainerUserId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$_id', '$$trainerUserId'] },
                    { $eq: [{ $toString: '$_id' }, '$$trainerUserId'] },
                  ],
                },
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchStage,
      },
    ];

    const countPipeline: PipelineStage[] = [...pipeline, { $count: 'total' }];
    const dataPipeline: PipelineStage[] = [
      ...pipeline,
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: query.limit },
    ];

    const [dataResult, countResult] = await Promise.all([
      TrainerProfileModel.aggregate(dataPipeline).exec(),
      TrainerProfileModel.aggregate(countPipeline).exec(),
    ]);

    const total = countResult.length > 0 ? (countResult[0] as { total: number }).total : 0;
    const profiles = dataResult.map((doc) => {
      const domainProfile = TrainerProfilePersistenceMapper.toDomain(doc);
      if (doc.user && doc.user.fullName) {
        (domainProfile as unknown as Record<string, unknown>).fullName = doc.user.fullName;
      }
      return domainProfile;
    });

    return { profiles, total };
  }
}
