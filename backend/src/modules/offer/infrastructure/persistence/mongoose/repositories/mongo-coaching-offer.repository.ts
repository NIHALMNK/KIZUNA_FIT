import { FilterQuery } from 'mongoose';
import { CoachingOffer } from '../../../../domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../../domain/enums/coaching-offer-status.enum';
import {
  ICoachingOfferRepository,
  FindOffersOptions,
  PaginatedOffersResult,
} from '../../../../domain/repositories/coaching-offer.repository';
import { CoachingOfferModel } from '../schemas/coaching-offer.schema';
import { ICoachingOfferDocument } from '../documents/coaching-offer.document';
import { CoachingOfferPersistenceMapper } from '../mappers/coaching-offer-persistence.mapper';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { code?: number; codeName?: string };
  return err.code === 11000 || err.codeName === 'DuplicateKey';
}

export class MongoCoachingOfferRepository implements ICoachingOfferRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}

  public async save(offer: CoachingOffer): Promise<void> {
    const rawData = CoachingOfferPersistenceMapper.toPersistence(offer);

    try {
      await CoachingOfferModel.findByIdAndUpdate(
        rawData._id,
        { $set: rawData },
        { upsert: true, new: true, runValidators: true },
      );
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new Error(
          `A coaching offer already exists for consultation '${offer.consultationId}' or pipeline '${offer.acquisitionPipelineId}'`,
        );
      }
      throw error;
    }

    if (this.domainEventDispatcher && offer.domainEvents.length > 0) {
      await this.domainEventDispatcher.dispatchAll(offer.domainEvents);
      offer.clearEvents();
    }
  }

  public async findById(id: string): Promise<CoachingOffer | null> {
    if (!id || id.trim() === '') {
      return null;
    }

    const doc = await CoachingOfferModel.findById(id.trim());
    return doc ? CoachingOfferPersistenceMapper.toDomain(doc) : null;
  }

  public async findByConsultationId(consultationId: string): Promise<CoachingOffer | null> {
    if (!consultationId || consultationId.trim() === '') {
      return null;
    }

    const doc = await CoachingOfferModel.findOne({
      consultationId: consultationId.trim(),
    });

    return doc ? CoachingOfferPersistenceMapper.toDomain(doc) : null;
  }

  public async findByAcquisitionPipelineId(
    acquisitionPipelineId: string,
  ): Promise<CoachingOffer | null> {
    if (!acquisitionPipelineId || acquisitionPipelineId.trim() === '') {
      return null;
    }

    const doc = await CoachingOfferModel.findOne({
      acquisitionPipelineId: acquisitionPipelineId.trim(),
    });

    return doc ? CoachingOfferPersistenceMapper.toDomain(doc) : null;
  }

  public async findByClientId(
    clientId: string,
    options?: FindOffersOptions,
  ): Promise<PaginatedOffersResult> {
    if (!clientId || clientId.trim() === '') {
      return { offers: [], total: 0 };
    }

    const query: FilterQuery<ICoachingOfferDocument> = {
      clientId: clientId.trim(),
    };
    if (options?.status) {
      query.status = options.status;
    }

    return this.executeQuery(query, options);
  }

  public async findByTrainerId(
    trainerId: string,
    options?: FindOffersOptions,
  ): Promise<PaginatedOffersResult> {
    if (!trainerId || trainerId.trim() === '') {
      return { offers: [], total: 0 };
    }

    const query: FilterQuery<ICoachingOfferDocument> = {
      trainerId: trainerId.trim(),
    };
    if (options?.status) {
      query.status = options.status;
    }

    return this.executeQuery(query, options);
  }

  public async findExpiredPendingOffers(referenceDate?: Date): Promise<CoachingOffer[]> {
    const now = referenceDate || new Date();
    const docs = await CoachingOfferModel.find({
      status: CoachingOfferStatus.SENT,
      expiresAt: { $lte: now },
    });

    return docs.map((doc) => CoachingOfferPersistenceMapper.toDomain(doc));
  }

  private async executeQuery(
    query: FilterQuery<ICoachingOfferDocument>,
    options?: FindOffersOptions,
  ): Promise<PaginatedOffersResult> {
    let sortOptions: Record<string, 1 | -1> = { createdAt: -1 };

    if (options?.sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (options?.sort === 'expiring') {
      sortOptions = { expiresAt: 1 };
    }

    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const [docs, total] = await Promise.all([
      CoachingOfferModel.find(query).sort(sortOptions).skip(offset).limit(limit),
      CoachingOfferModel.countDocuments(query),
    ]);

    return {
      offers: docs.map((doc) => CoachingOfferPersistenceMapper.toDomain(doc)),
      total,
    };
  }
}
