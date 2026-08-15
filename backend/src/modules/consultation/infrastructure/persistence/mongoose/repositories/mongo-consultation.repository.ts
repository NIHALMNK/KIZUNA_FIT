import { FilterQuery } from 'mongoose';
import { Consultation } from '../../../../domain/aggregates/consultation.aggregate';
import { ConsultationStatus } from '../../../../domain/enums/consultation-status.enum';
import {
  IConsultationRepository,
  FindConsultationsOptions,
  PaginatedConsultationsResult,
} from '../../../../domain/repositories/consultation.repository';
import { ConsultationModel } from '../schemas/consultation.schema';
import { IConsultationDocument } from '../documents/consultation.document';
import { ConsultationPersistenceMapper } from '../mappers/consultation-persistence.mapper';
import { DomainEventDispatcher } from '../../../../../../shared/events/domain-event-dispatcher';

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { code?: number; codeName?: string };
  return err.code === 11000 || err.codeName === 'DuplicateKey';
}

export class MongoConsultationRepository implements IConsultationRepository {
  constructor(private readonly domainEventDispatcher?: DomainEventDispatcher) {}

  public async save(consultation: Consultation): Promise<void> {
    const rawData = ConsultationPersistenceMapper.toPersistence(consultation);

    try {
      await ConsultationModel.findByIdAndUpdate(
        rawData._id,
        { $set: rawData },
        { upsert: true, new: true, runValidators: true },
      );
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        throw new Error(
          `A consultation already exists for acquisition pipeline '${consultation.acquisitionPipelineId}'`,
        );
      }
      throw error;
    }

    if (this.domainEventDispatcher && consultation.domainEvents.length > 0) {
      await this.domainEventDispatcher.dispatchAll(consultation.domainEvents);
      consultation.clearEvents();
    }
  }

  public async findById(id: string): Promise<Consultation | null> {
    if (!id || id.trim() === '') {
      return null;
    }

    const doc = await ConsultationModel.findById(id.trim());
    return doc ? ConsultationPersistenceMapper.toDomain(doc) : null;
  }

  public async findByAcquisitionPipelineId(
    acquisitionPipelineId: string,
  ): Promise<Consultation | null> {
    if (!acquisitionPipelineId || acquisitionPipelineId.trim() === '') {
      return null;
    }

    const doc = await ConsultationModel.findOne({
      acquisitionPipelineId: acquisitionPipelineId.trim(),
    });

    return doc ? ConsultationPersistenceMapper.toDomain(doc) : null;
  }

  public async findByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!clientId || clientId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const query: FilterQuery<IConsultationDocument> = {
      clientId: clientId.trim(),
    };
    if (options?.status) {
      query.status = options.status;
    }

    return this.executeQuery(query, options);
  }

  public async findByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!trainerId || trainerId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const query: FilterQuery<IConsultationDocument> = {
      trainerId: trainerId.trim(),
    };
    if (options?.status) {
      query.status = options.status;
    }

    return this.executeQuery(query, options);
  }

  public async findUpcomingByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!clientId || clientId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const activeStatuses = [
      ConsultationStatus.CREATED,
      ConsultationStatus.SLOT_BOOKED,
      ConsultationStatus.SCHEDULED,
    ];
    const query: FilterQuery<IConsultationDocument> = {
      clientId: clientId.trim(),
      status: { $in: activeStatuses },
      'slot.scheduledStartAt': { $gte: new Date() },
    };

    return this.executeQuery(query, options);
  }

  public async findUpcomingByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!trainerId || trainerId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const activeStatuses = [
      ConsultationStatus.CREATED,
      ConsultationStatus.SLOT_BOOKED,
      ConsultationStatus.SCHEDULED,
    ];
    const query: FilterQuery<IConsultationDocument> = {
      trainerId: trainerId.trim(),
      status: { $in: activeStatuses },
      'slot.scheduledStartAt': { $gte: new Date() },
    };

    return this.executeQuery(query, options);
  }

  public async findHistoryByClientId(
    clientId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!clientId || clientId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const historyStatuses = [
      ConsultationStatus.COMPLETED,
      ConsultationStatus.CANCELLED,
      ConsultationStatus.NO_SHOW,
    ];
    const query: FilterQuery<IConsultationDocument> = {
      clientId: clientId.trim(),
      status: options?.status ? options.status : { $in: historyStatuses },
    };

    return this.executeQuery(query, options);
  }

  public async findHistoryByTrainerId(
    trainerId: string,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    if (!trainerId || trainerId.trim() === '') {
      return { consultations: [], total: 0 };
    }

    const historyStatuses = [
      ConsultationStatus.COMPLETED,
      ConsultationStatus.CANCELLED,
      ConsultationStatus.NO_SHOW,
    ];
    const query: FilterQuery<IConsultationDocument> = {
      trainerId: trainerId.trim(),
      status: options?.status ? options.status : { $in: historyStatuses },
    };

    return this.executeQuery(query, options);
  }

  public async findByRoomId(roomId: string): Promise<Consultation | null> {
    if (!roomId || roomId.trim() === '') {
      return null;
    }

    const doc = await ConsultationModel.findOne({ roomId: roomId.trim() });
    return doc ? ConsultationPersistenceMapper.toDomain(doc) : null;
  }

  private async executeQuery(
    query: FilterQuery<IConsultationDocument>,
    options?: FindConsultationsOptions,
  ): Promise<PaginatedConsultationsResult> {
    const sortOrder = options?.sort === 'oldest' ? 1 : -1;
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const [docs, total] = await Promise.all([
      ConsultationModel.find(query)
        .sort({ 'slot.scheduledStartAt': sortOrder, createdAt: sortOrder })
        .skip(offset)
        .limit(limit),
      ConsultationModel.countDocuments(query),
    ]);

    return {
      consultations: docs.map((doc) => ConsultationPersistenceMapper.toDomain(doc)),
      total,
    };
  }
}
