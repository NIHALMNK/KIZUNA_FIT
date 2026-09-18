import { ClientSession } from 'mongoose';
import { INutritionCompletionRepository } from '../../../../domain/repositories/INutritionCompletionRepository';
import { NutritionCompletion } from '../../../../domain/aggregates/nutrition-completion.aggregate';
import { NutritionCompletionModel } from '../schemas/nutrition-completion.schema';
import { NutritionCompletionPersistenceMapper } from '../mappers/nutrition-completion-persistence.mapper';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';
import { IDomainEvent } from '../../../../../../shared/core/AggregateRoot';
import { DuplicateNutritionCompletionException } from '../../../../domain/exceptions/nutrition-domain.exceptions';

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { code?: number; codeName?: string; message?: string };
  return (
    err.code === 11000 ||
    err.codeName === 'DuplicateKey' ||
    Boolean(err.message && err.message.includes('E11000'))
  );
}

export class MongoNutritionCompletionRepository implements INutritionCompletionRepository {
  constructor(
    private readonly domainEventDispatcher?: DomainEventDispatcher,
    private readonly session?: ClientSession,
    private readonly pendingEventsQueue?: IDomainEvent[],
  ) {}

  async findById(id: string): Promise<NutritionCompletion | null> {
    const doc = await NutritionCompletionModel.findById(id, null, {
      session: this.session,
    }).exec();
    if (!doc) return null;
    return NutritionCompletionPersistenceMapper.toDomain(doc);
  }

  async findByPlanAndDay(
    nutritionPlanId: string,
    dayNumber: number,
  ): Promise<NutritionCompletion | null> {
    const doc = await NutritionCompletionModel.findOne(
      {
        nutritionPlanId,
        'nutritionDaySnapshot.dayNumber': dayNumber,
      },
      null,
      { session: this.session },
    ).exec();
    if (!doc) return null;
    return NutritionCompletionPersistenceMapper.toDomain(doc);
  }

  async findByPlanClientAndDate(
    nutritionPlanId: string,
    clientId: string,
    completionDate: Date,
  ): Promise<NutritionCompletion | null> {
    const doc = await NutritionCompletionModel.findOne(
      {
        nutritionPlanId,
        clientId,
        completionDate,
      },
      null,
      { session: this.session },
    ).exec();
    if (!doc) return null;
    return NutritionCompletionPersistenceMapper.toDomain(doc);
  }

  async findByRelationshipId(
    relationshipId: string,
    limit = 50,
    skip = 0,
  ): Promise<NutritionCompletion[]> {
    const docs = await NutritionCompletionModel.find(
      { coachingRelationshipId: relationshipId },
      null,
      { session: this.session },
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return docs.map(NutritionCompletionPersistenceMapper.toDomain);
  }

  async findByClientId(clientId: string, limit = 50, skip = 0): Promise<NutritionCompletion[]> {
    const docs = await NutritionCompletionModel.find({ clientId }, null, { session: this.session })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    return docs.map(NutritionCompletionPersistenceMapper.toDomain);
  }

  async findByClientIdInRange(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionCompletion[]> {
    const docs = await NutritionCompletionModel.find(
      {
        clientId,
        completionDate: { $gte: fromDate, $lte: toDate },
      },
      null,
      { session: this.session },
    )
      .sort({ completionDate: 1 })
      .exec();
    return docs.map(NutritionCompletionPersistenceMapper.toDomain);
  }

  async findByRelationshipIdInRange(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionCompletion[]> {
    const docs = await NutritionCompletionModel.find(
      {
        coachingRelationshipId: relationshipId,
        completionDate: { $gte: fromDate, $lte: toDate },
      },
      null,
      { session: this.session },
    )
      .sort({ completionDate: 1 })
      .exec();
    return docs.map(NutritionCompletionPersistenceMapper.toDomain);
  }

  async save(completion: NutritionCompletion): Promise<void> {
    const raw = NutritionCompletionPersistenceMapper.toPersistence(completion);
    try {
      await NutritionCompletionModel.findByIdAndUpdate(
        completion.id,
        { $set: raw },
        {
          upsert: true,
          new: true,
          session: this.session,
        },
      ).exec();
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new DuplicateNutritionCompletionException(
          completion.nutritionPlanId,
          completion.dayNumber,
        );
      }
      throw error;
    }

    if (completion.domainEvents.length > 0) {
      const eventsToDispatch = [...completion.domainEvents];
      completion.clearEvents();
      if (this.pendingEventsQueue) {
        this.pendingEventsQueue.push(...eventsToDispatch);
      } else if (this.domainEventDispatcher) {
        await this.domainEventDispatcher.dispatchAll(eventsToDispatch);
      }
    }
  }

  async delete(id: string): Promise<void> {
    await NutritionCompletionModel.deleteOne({ _id: id }, { session: this.session }).exec();
  }
}
