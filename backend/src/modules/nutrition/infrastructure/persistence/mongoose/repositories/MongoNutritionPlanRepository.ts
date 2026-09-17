import { ClientSession } from 'mongoose';
import { INutritionPlanRepository } from '../../../../domain/repositories/INutritionPlanRepository';
import { NutritionPlan } from '../../../../domain/aggregates/nutrition-plan.aggregate';
import { NutritionPlanModel } from '../schemas/nutrition-plan.schema';
import { NutritionPlanPersistenceMapper } from '../mappers/nutrition-plan-persistence.mapper';
import { NutritionPlanStatus } from '../../../../domain/enums';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';
import { IDomainEvent } from '../../../../../../shared/core/AggregateRoot';
import {
  ActiveNutritionPlanAlreadyExistsException,
  NutritionConcurrencyConflictException,
  NutritionPlanVersionAlreadyExistsException,
  PendingNutritionPlanAlreadyExistsException,
} from '../../../../domain/exceptions/nutrition-domain.exceptions';

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

export class MongoNutritionPlanRepository implements INutritionPlanRepository {
  constructor(
    private readonly domainEventDispatcher?: DomainEventDispatcher,
    private readonly session?: ClientSession,
    private readonly pendingEventsQueue?: IDomainEvent[],
  ) {}

  async findById(id: string): Promise<NutritionPlan | null> {
    const doc = await NutritionPlanModel.findById(id, null, { session: this.session }).exec();
    if (!doc) return null;
    return NutritionPlanPersistenceMapper.toDomain(doc);
  }

  async findActiveByRelationshipId(relationshipId: string): Promise<NutritionPlan | null> {
    const doc = await NutritionPlanModel.findOne(
      {
        coachingRelationshipId: relationshipId,
        status: NutritionPlanStatus.ACTIVE,
      },
      null,
      { session: this.session },
    ).exec();
    if (!doc) return null;
    return NutritionPlanPersistenceMapper.toDomain(doc);
  }

  async findPendingByRelationshipId(relationshipId: string): Promise<NutritionPlan | null> {
    const doc = await NutritionPlanModel.findOne(
      {
        coachingRelationshipId: relationshipId,
        status: NutritionPlanStatus.PENDING_APPROVAL,
      },
      null,
      { session: this.session },
    ).exec();
    if (!doc) return null;
    return NutritionPlanPersistenceMapper.toDomain(doc);
  }

  async findActiveByClientId(clientId: string): Promise<NutritionPlan | null> {
    const doc = await NutritionPlanModel.findOne(
      {
        clientId,
        status: NutritionPlanStatus.ACTIVE,
      },
      null,
      { session: this.session },
    )
      .sort({ updatedAt: -1 })
      .exec();
    if (!doc) return null;
    return NutritionPlanPersistenceMapper.toDomain(doc);
  }

  async findPendingByClientId(clientId: string): Promise<NutritionPlan | null> {
    const doc = await NutritionPlanModel.findOne(
      {
        clientId,
        status: NutritionPlanStatus.PENDING_APPROVAL,
      },
      null,
      { session: this.session },
    )
      .sort({ updatedAt: -1 })
      .exec();
    if (!doc) return null;
    return NutritionPlanPersistenceMapper.toDomain(doc);
  }

  async findByRelationshipId(relationshipId: string): Promise<NutritionPlan[]> {
    const docs = await NutritionPlanModel.find({ coachingRelationshipId: relationshipId }, null, {
      session: this.session,
    })
      .sort({ version: -1, createdAt: -1 })
      .exec();
    return docs.map(NutritionPlanPersistenceMapper.toDomain);
  }

  async findHighestVersionNumber(relationshipId: string): Promise<number> {
    const doc = await NutritionPlanModel.findOne({ coachingRelationshipId: relationshipId }, null, {
      session: this.session,
    })
      .sort({ version: -1 })
      .select('version')
      .exec();
    return doc ? doc.version : 0;
  }

  async save(plan: NutritionPlan): Promise<void> {
    const raw = NutritionPlanPersistenceMapper.toPersistence(plan);
    try {
      await NutritionPlanModel.findByIdAndUpdate(
        plan.id,
        { $set: raw },
        {
          upsert: true,
          new: true,
          session: this.session,
        },
      ).exec();
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        const errObj = error as { message?: string; keyPattern?: Record<string, any> };
        if (
          errObj.keyPattern?.status ||
          (errObj.message && errObj.message.includes('uniq_active_nutrition_plan_per_relationship'))
        ) {
          throw new ActiveNutritionPlanAlreadyExistsException(plan.coachingRelationshipId, plan.id);
        }
        if (
          errObj.message &&
          errObj.message.includes('uniq_pending_nutrition_plan_per_relationship')
        ) {
          throw new PendingNutritionPlanAlreadyExistsException(
            plan.coachingRelationshipId,
            plan.id,
          );
        }
        if (
          (errObj.keyPattern?.coachingRelationshipId && errObj.keyPattern?.version) ||
          (errObj.message && errObj.message.includes('coachingRelationshipId_1_version_1')) ||
          (errObj.message && errObj.message.includes('version'))
        ) {
          throw new NutritionPlanVersionAlreadyExistsException(
            plan.coachingRelationshipId,
            plan.version,
          );
        }
      }
      throw error;
    }

    if (plan.domainEvents.length > 0) {
      const eventsToDispatch = [...plan.domainEvents];
      plan.clearEvents();
      if (this.pendingEventsQueue) {
        this.pendingEventsQueue.push(...eventsToDispatch);
      } else if (this.domainEventDispatcher) {
        await this.domainEventDispatcher.dispatchAll(eventsToDispatch);
      }
    }
  }

  async delete(id: string): Promise<void> {
    await NutritionPlanModel.deleteOne(
      { _id: id, status: NutritionPlanStatus.DRAFT },
      { session: this.session },
    ).exec();
  }
}
