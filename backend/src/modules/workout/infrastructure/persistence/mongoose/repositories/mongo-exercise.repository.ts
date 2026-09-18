import {
  ExerciseFilterOptions,
  IExerciseRepository,
} from '../../../../domain/repositories/exercise.repository.interface';
import { Exercise } from '../../../../domain/aggregates/exercise.aggregate';
import { ExerciseModel } from '../schemas/exercise.schema';
import { ExercisePersistenceMapper } from '../mappers/exercise-persistence.mapper';

export class MongoExerciseRepository implements IExerciseRepository {
  async findById(id: string): Promise<Exercise | null> {
    const doc = await ExerciseModel.findById(id).exec();
    if (!doc) return null;
    return ExercisePersistenceMapper.toDomain(doc);
  }

  async findBySlug(slug: string): Promise<Exercise | null> {
    const doc = await ExerciseModel.findOne({ slug }).exec();
    if (!doc) return null;
    return ExercisePersistenceMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<Exercise | null> {
    const doc = await ExerciseModel.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
    if (!doc) return null;
    return ExercisePersistenceMapper.toDomain(doc);
  }

  async findMany(options?: ExerciseFilterOptions): Promise<Exercise[]> {
    const query = this.buildFilterQuery(options);
    let q = ExerciseModel.find(query).sort({ name: 1 });

    if (options?.skip !== undefined) q = q.skip(options.skip);
    if (options?.limit !== undefined) q = q.limit(options.limit);

    const docs = await q.exec();
    return docs.map(ExercisePersistenceMapper.toDomain);
  }

  async count(options?: ExerciseFilterOptions): Promise<number> {
    const query = this.buildFilterQuery(options);
    return ExerciseModel.countDocuments(query).exec();
  }

  async save(exercise: Exercise): Promise<void> {
    const raw = ExercisePersistenceMapper.toPersistence(exercise);
    try {
      await ExerciseModel.findByIdAndUpdate(exercise.id, raw, { upsert: true, new: true }).exec();
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        // Collision-safe retry for slug
        const fallbackSlug = `${exercise.slug}-${Math.random().toString(36).substring(2, 7)}`;
        raw.slug = fallbackSlug;
        await ExerciseModel.findByIdAndUpdate(exercise.id, raw, { upsert: true, new: true }).exec();
        return;
      }
      throw error;
    }
  }

  async saveMany(exercises: Exercise[]): Promise<void> {
    const operations = exercises.map((ex) => ({
      updateOne: {
        filter: { _id: ex.id },
        update: { $set: ExercisePersistenceMapper.toPersistence(ex) },
        upsert: true,
      },
    }));
    if (operations.length > 0) {
      await ExerciseModel.bulkWrite(operations);
    }
  }

  private buildFilterQuery(options?: ExerciseFilterOptions): Record<string, any> {
    const query: Record<string, any> = {};
    if (!options) return query;

    if (options.status) query.status = options.status;
    if (options.origin) query.origin = options.origin;
    if (options.createdByTrainerId) query.createdByTrainerId = options.createdByTrainerId;
    if (options.category) query.category = options.category;
    if (options.primaryMuscleGroup) query.primaryMuscleGroup = options.primaryMuscleGroup;
    if (options.equipment) query.equipment = options.equipment;
    if (options.difficulty) query.difficulty = options.difficulty;
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const regex = new RegExp(options.searchQuery.trim(), 'i');
      query.$or = [{ name: regex }, { category: regex }, { 'instructions.instruction': regex }];
    }

    return query;
  }
}
