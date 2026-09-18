import { FilterQuery } from 'mongoose';
import { CoachingRelationship } from '../../../../domain/aggregates/coaching-relationship.aggregate';
import {
  ICoachingRelationshipRepository,
  CoachingRelationshipFilter,
  PaginatedResult,
} from '../../../../application/ports/coaching-relationship.repository.interface';
import {
  CoachingRelationshipModel,
  ICoachingRelationshipDocument,
} from '../schemas/coaching-relationship.schema';
import { CoachingPersistenceMapper } from '../mappers/coaching-persistence.mapper';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';
import { CoachingRelationshipStatus } from '../../../../domain/enums/coaching-relationship-status.enum';
import {
  CoachingConcurrencyConflictException,
  ClientHasActiveRelationshipException,
} from '../../../../domain/exceptions/coaching-domain.exceptions';

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

export class MongoCoachingRelationshipRepository implements ICoachingRelationshipRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}

  public async save(relationship: CoachingRelationship): Promise<void> {
    const rawData = CoachingPersistenceMapper.toPersistence(relationship);

    try {
      const currentVersion = relationship.version;
      const nextVersion = currentVersion + 1;

      const existingDoc = await CoachingRelationshipModel.findById(rawData._id);

      if (!existingDoc) {
        await CoachingRelationshipModel.create({ ...rawData, __v: 0 });
      } else {
        const updateResult = await CoachingRelationshipModel.updateOne(
          { _id: rawData._id, __v: currentVersion },
          { $set: { ...rawData, __v: nextVersion } },
        );

        if (updateResult.matchedCount === 0) {
          throw new CoachingConcurrencyConflictException(relationship.id);
        }
      }
    } catch (error: unknown) {
      if (error instanceof CoachingConcurrencyConflictException) {
        throw error;
      }
      if (isMongoDuplicateKeyError(error)) {
        const errMessage = (error as { message?: string }).message || '';
        if (errMessage.includes('unique_active_relationship_per_client')) {
          throw new ClientHasActiveRelationshipException(
            relationship.clientId,
            'existing_active_relationship',
          );
        }
        if (errMessage.includes('paymentId')) {
          throw new Error(
            `A coaching relationship already exists for payment '${relationship.paymentId}'.`,
          );
        }
        if (errMessage.includes('acquisitionPipelineId')) {
          throw new Error(
            `A coaching relationship already exists for pipeline '${relationship.acquisitionPipelineId}'.`,
          );
        }
      }
      throw error;
    }

    // Synchronously dispatch domain events if dispatcher is configured
    if (this.domainEventDispatcher && relationship.domainEvents.length > 0) {
      await this.domainEventDispatcher.dispatchAll(relationship.domainEvents);
      relationship.clearEvents();
    }
  }

  public async findById(id: string): Promise<CoachingRelationship | null> {
    if (!id || id.trim() === '') return null;
    const doc = await CoachingRelationshipModel.findById(id.trim());
    return doc ? CoachingPersistenceMapper.toDomain(doc) : null;
  }

  public async findByPaymentId(paymentId: string): Promise<CoachingRelationship | null> {
    if (!paymentId || paymentId.trim() === '') return null;
    const doc = await CoachingRelationshipModel.findOne({ paymentId: paymentId.trim() });
    return doc ? CoachingPersistenceMapper.toDomain(doc) : null;
  }

  public async findByAcquisitionPipelineId(
    acquisitionPipelineId: string,
  ): Promise<CoachingRelationship | null> {
    if (!acquisitionPipelineId || acquisitionPipelineId.trim() === '') return null;
    const doc = await CoachingRelationshipModel.findOne({
      acquisitionPipelineId: acquisitionPipelineId.trim(),
    });
    return doc ? CoachingPersistenceMapper.toDomain(doc) : null;
  }

  public async findActiveByClientId(clientId: string): Promise<CoachingRelationship | null> {
    if (!clientId || clientId.trim() === '') return null;
    const doc = await CoachingRelationshipModel.findOne({
      clientId: clientId.trim(),
      status: CoachingRelationshipStatus.ACTIVE,
    });
    return doc ? CoachingPersistenceMapper.toDomain(doc) : null;
  }

  public async findActiveByTrainerId(trainerId: string): Promise<CoachingRelationship[]> {
    if (!trainerId || trainerId.trim() === '') return [];
    const docs = await CoachingRelationshipModel.find({
      trainerId: trainerId.trim(),
      status: CoachingRelationshipStatus.ACTIVE,
    }).sort({ createdAt: -1 });
    return docs.map(CoachingPersistenceMapper.toDomain);
  }

  public async findAll(
    filter: CoachingRelationshipFilter,
  ): Promise<PaginatedResult<CoachingRelationship>> {
    const query: FilterQuery<ICoachingRelationshipDocument> = {};

    if (filter.clientId) {
      query.clientId = filter.clientId;
    }
    if (filter.trainerId) {
      query.trainerId = filter.trainerId;
    }
    if (filter.status) {
      if (Array.isArray(filter.status)) {
        query.status = { $in: filter.status };
      } else {
        query.status = filter.status;
      }
    }

    const page = filter.page && filter.page > 0 ? filter.page : 1;
    const limit = filter.limit && filter.limit > 0 ? filter.limit : 10;
    const skip = (page - 1) * limit;
    const sortOrder = filter.sort === 'oldest' ? 1 : -1;

    const [totalRecords, docs] = await Promise.all([
      CoachingRelationshipModel.countDocuments(query),
      CoachingRelationshipModel.find(query)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit) || 1;

    return {
      items: docs.map(CoachingPersistenceMapper.toDomain),
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }
}
