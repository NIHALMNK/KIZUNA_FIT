import {
  IWorkoutCompletionRepository,
  WorkoutCompletionFilterOptions,
} from '../../../../domain/repositories/workout-completion.repository.interface';
import { WorkoutCompletion } from '../../../../domain/aggregates/workout-completion.aggregate';
import { WorkoutCompletionModel } from '../schemas/workout-completion.schema';
import { WorkoutCompletionPersistenceMapper } from '../mappers/workout-completion-persistence.mapper';
import { WorkoutCompletionStatus } from '../../../../domain/enums';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';

export class MongoWorkoutCompletionRepository implements IWorkoutCompletionRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}
  async findById(id: string): Promise<WorkoutCompletion | null> {
    const doc = await WorkoutCompletionModel.findById(id).exec();
    if (!doc) return null;
    return WorkoutCompletionPersistenceMapper.toDomain(doc);
  }

  async findLatestByProgramAndDay(
    workoutProgramId: string,
    workoutDay: number,
  ): Promise<WorkoutCompletion | null> {
    const doc = await WorkoutCompletionModel.findOne({ workoutProgramId, workoutDay })
      .sort({ createdAt: -1 })
      .exec();
    if (!doc) return null;
    return WorkoutCompletionPersistenceMapper.toDomain(doc);
  }

  async findActiveSession(
    clientId: string,
    workoutProgramId: string,
    workoutDay: number,
  ): Promise<WorkoutCompletion | null> {
    const doc = await WorkoutCompletionModel.findOne({
      clientId,
      workoutProgramId,
      workoutDay,
      status: WorkoutCompletionStatus.IN_PROGRESS,
    }).exec();
    if (!doc) return null;
    return WorkoutCompletionPersistenceMapper.toDomain(doc);
  }

  async findMany(options?: WorkoutCompletionFilterOptions): Promise<WorkoutCompletion[]> {
    const query = this.buildFilterQuery(options);
    let q = WorkoutCompletionModel.find(query).sort({ completedAt: -1, createdAt: -1 });

    if (options?.skip !== undefined) q = q.skip(options.skip);
    if (options?.limit !== undefined) q = q.limit(options.limit);

    const docs = await q.exec();
    return docs.map(WorkoutCompletionPersistenceMapper.toDomain);
  }

  async count(options?: WorkoutCompletionFilterOptions): Promise<number> {
    const query = this.buildFilterQuery(options);
    return WorkoutCompletionModel.countDocuments(query).exec();
  }

  async save(completion: WorkoutCompletion): Promise<void> {
    const raw = WorkoutCompletionPersistenceMapper.toPersistence(completion);
    await WorkoutCompletionModel.findByIdAndUpdate(completion.id, raw, {
      upsert: true,
      new: true,
    }).exec();

    if (this.domainEventDispatcher && completion.domainEvents.length > 0) {
      const eventsToDispatch = [...completion.domainEvents];
      completion.clearEvents();
      await this.domainEventDispatcher.dispatchAll(eventsToDispatch);
    }
  }

  private buildFilterQuery(options?: WorkoutCompletionFilterOptions): Record<string, any> {
    const query: Record<string, any> = {};
    if (!options) return query;

    if (options.coachingRelationshipId)
      query.coachingRelationshipId = options.coachingRelationshipId;
    if (options.workoutProgramId) query.workoutProgramId = options.workoutProgramId;
    if (options.clientId) query.clientId = options.clientId;
    if (options.trainerId) query.trainerId = options.trainerId;
    if (options.workoutDay) query.workoutDay = options.workoutDay;
    if (options.status) query.status = options.status;

    if (options.fromDate || options.toDate) {
      query.completedAt = {};
      if (options.fromDate) query.completedAt.$gte = options.fromDate;
      if (options.toDate) query.completedAt.$lte = options.toDate;
    }

    return query;
  }
}
