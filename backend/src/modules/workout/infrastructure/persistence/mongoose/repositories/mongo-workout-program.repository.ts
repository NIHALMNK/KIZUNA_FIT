import {
  IWorkoutProgramRepository,
  WorkoutProgramFilterOptions,
} from '../../../../domain/repositories/workout-program.repository.interface';
import { WorkoutProgram } from '../../../../domain/aggregates/workout-program.aggregate';
import { WorkoutProgramModel } from '../schemas/workout-program.schema';
import { WorkoutProgramPersistenceMapper } from '../mappers/workout-program-persistence.mapper';
import { WorkoutProgramStatus } from '../../../../domain/enums';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';

export class MongoWorkoutProgramRepository implements IWorkoutProgramRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}
  async findById(id: string): Promise<WorkoutProgram | null> {
    const doc = await WorkoutProgramModel.findById(id).exec();
    if (!doc) return null;
    return WorkoutProgramPersistenceMapper.toDomain(doc);
  }

  async findActiveByRelationshipId(coachingRelationshipId: string): Promise<WorkoutProgram | null> {
    const doc = await WorkoutProgramModel.findOne({
      coachingRelationshipId,
      status: WorkoutProgramStatus.ACTIVE,
    }).exec();
    if (!doc) return null;
    return WorkoutProgramPersistenceMapper.toDomain(doc);
  }

  async findDraftByRelationshipId(coachingRelationshipId: string): Promise<WorkoutProgram | null> {
    const doc = await WorkoutProgramModel.findOne({
      coachingRelationshipId,
      status: WorkoutProgramStatus.DRAFT,
    })
      .sort({ version: -1, createdAt: -1 })
      .exec();
    if (!doc) return null;
    return WorkoutProgramPersistenceMapper.toDomain(doc);
  }

  async findHighestVersionNumber(coachingRelationshipId: string): Promise<number> {
    const doc = await WorkoutProgramModel.findOne({ coachingRelationshipId })
      .sort({ version: -1 })
      .select('version')
      .exec();
    return doc ? doc.version : 0;
  }

  async findActiveByClientId(clientId: string): Promise<WorkoutProgram | null> {
    const doc = await WorkoutProgramModel.findOne({
      clientId,
      status: WorkoutProgramStatus.ACTIVE,
    })
      .sort({ activatedAt: -1, createdAt: -1 })
      .exec();
    if (!doc) return null;
    return WorkoutProgramPersistenceMapper.toDomain(doc);
  }

  async findByRelationshipAndVersion(
    coachingRelationshipId: string,
    version: number,
  ): Promise<WorkoutProgram | null> {
    const doc = await WorkoutProgramModel.findOne({ coachingRelationshipId, version }).exec();
    if (!doc) return null;
    return WorkoutProgramPersistenceMapper.toDomain(doc);
  }

  async findMany(options?: WorkoutProgramFilterOptions): Promise<WorkoutProgram[]> {
    const query = this.buildFilterQuery(options);
    let q = WorkoutProgramModel.find(query).sort({ version: -1, createdAt: -1 });

    if (options?.skip !== undefined) q = q.skip(options.skip);
    if (options?.limit !== undefined) q = q.limit(options.limit);

    const docs = await q.exec();
    return docs.map(WorkoutProgramPersistenceMapper.toDomain);
  }

  async count(options?: WorkoutProgramFilterOptions): Promise<number> {
    const query = this.buildFilterQuery(options);
    return WorkoutProgramModel.countDocuments(query).exec();
  }

  async save(program: WorkoutProgram): Promise<void> {
    const raw = WorkoutProgramPersistenceMapper.toPersistence(program);
    await WorkoutProgramModel.findByIdAndUpdate(program.id, raw, {
      upsert: true,
      new: true,
    }).exec();

    if (this.domainEventDispatcher && program.domainEvents.length > 0) {
      const eventsToDispatch = [...program.domainEvents];
      program.clearEvents();
      await this.domainEventDispatcher.dispatchAll(eventsToDispatch);
    }
  }

  async deleteDraft(id: string): Promise<void> {
    await WorkoutProgramModel.deleteOne({ _id: id, status: WorkoutProgramStatus.DRAFT }).exec();
  }

  private buildFilterQuery(options?: WorkoutProgramFilterOptions): Record<string, any> {
    const query: Record<string, any> = {};
    if (!options) return query;

    if (options.coachingRelationshipId)
      query.coachingRelationshipId = options.coachingRelationshipId;
    if (options.trainerId) query.trainerId = options.trainerId;
    if (options.clientId) query.clientId = options.clientId;
    if (options.status) query.status = options.status;

    return query;
  }
}
