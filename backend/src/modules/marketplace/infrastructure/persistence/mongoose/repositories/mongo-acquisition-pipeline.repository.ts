import { Types, FilterQuery } from 'mongoose';
import { AcquisitionPipeline } from '../../../../domain/aggregates/acquisition-pipeline.aggregate';
import { AcquisitionPipelineStatus } from '../../../../domain/enums/acquisition-pipeline-status.enum';
import {
  IAcquisitionPipelineRepository,
  FindPipelinesOptions,
  PaginatedPipelinesResult,
} from '../../../../domain/repositories/acquisition-pipeline.repository';
import { AcquisitionPipelineModel } from '../schemas/acquisition-pipeline.schema';
import { IAcquisitionPipelineDocument } from '../documents/acquisition-pipeline.document';
import { AcquisitionPipelinePersistenceMapper } from '../mappers/acquisition-pipeline-persistence.mapper';

export class MongoAcquisitionPipelineRepository implements IAcquisitionPipelineRepository {
  public async save(pipeline: AcquisitionPipeline): Promise<void> {
    const rawData = AcquisitionPipelinePersistenceMapper.toPersistence(pipeline);

    await AcquisitionPipelineModel.findByIdAndUpdate(
      rawData._id,
      { $set: rawData },
      { upsert: true, new: true, runValidators: true },
    );
  }

  public async findById(id: string): Promise<AcquisitionPipeline | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await AcquisitionPipelineModel.findById(id);
    return doc ? AcquisitionPipelinePersistenceMapper.toDomain(doc) : null;
  }

  public async findByRequestId(requestId: string): Promise<AcquisitionPipeline | null> {
    if (!requestId) {
      return null;
    }

    const doc = await AcquisitionPipelineModel.findOne({
      'trainerRequest.requestId': requestId,
    });
    return doc ? AcquisitionPipelinePersistenceMapper.toDomain(doc) : null;
  }

  public async findActivePipeline(clientId: string): Promise<AcquisitionPipeline | null> {
    if (!Types.ObjectId.isValid(clientId)) {
      return null;
    }

    const terminalStates = [
      AcquisitionPipelineStatus.REJECTED,
      AcquisitionPipelineStatus.WITHDRAWN,
      AcquisitionPipelineStatus.OFFER_DECLINED,
      AcquisitionPipelineStatus.CONVERTED,
      AcquisitionPipelineStatus.CLOSED,
    ];

    const doc = await AcquisitionPipelineModel.findOne({
      clientId: new Types.ObjectId(clientId),
      status: { $nin: terminalStates },
    });

    return doc ? AcquisitionPipelinePersistenceMapper.toDomain(doc) : null;
  }

  public async findActivePipelineBetween(
    clientId: string,
    trainerId: string,
  ): Promise<AcquisitionPipeline | null> {
    if (!Types.ObjectId.isValid(clientId) || !Types.ObjectId.isValid(trainerId)) {
      return null;
    }

    const terminalStates = [
      AcquisitionPipelineStatus.REJECTED,
      AcquisitionPipelineStatus.WITHDRAWN,
      AcquisitionPipelineStatus.OFFER_DECLINED,
      AcquisitionPipelineStatus.CONVERTED,
      AcquisitionPipelineStatus.CLOSED,
    ];

    const doc = await AcquisitionPipelineModel.findOne({
      clientId: new Types.ObjectId(clientId),
      trainerId: new Types.ObjectId(trainerId),
      status: { $nin: terminalStates },
    });

    return doc ? AcquisitionPipelinePersistenceMapper.toDomain(doc) : null;
  }

  public async findByClientId(
    clientId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult> {
    if (!Types.ObjectId.isValid(clientId)) {
      return { pipelines: [], total: 0 };
    }

    const query: FilterQuery<IAcquisitionPipelineDocument> = {
      clientId: new Types.ObjectId(clientId),
    };
    if (options?.status) {
      query.status = options.status;
    }

    const sortOrder = options?.sort === 'oldest' ? 1 : -1;
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const [docs, total] = await Promise.all([
      AcquisitionPipelineModel.find(query).sort({ createdAt: sortOrder }).skip(offset).limit(limit),
      AcquisitionPipelineModel.countDocuments(query),
    ]);

    return {
      pipelines: docs.map((doc) => AcquisitionPipelinePersistenceMapper.toDomain(doc)),
      total,
    };
  }

  public async findByTrainerId(
    trainerId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult> {
    if (!Types.ObjectId.isValid(trainerId)) {
      return { pipelines: [], total: 0 };
    }

    const query: FilterQuery<IAcquisitionPipelineDocument> = {
      trainerId: new Types.ObjectId(trainerId),
    };
    if (options?.status) {
      query.status = options.status;
    }

    const sortOrder = options?.sort === 'oldest' ? 1 : -1;
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const [docs, total] = await Promise.all([
      AcquisitionPipelineModel.find(query).sort({ createdAt: sortOrder }).skip(offset).limit(limit),
      AcquisitionPipelineModel.countDocuments(query),
    ]);

    return {
      pipelines: docs.map((doc) => AcquisitionPipelinePersistenceMapper.toDomain(doc)),
      total,
    };
  }

  public async findPendingByTrainer(
    trainerId: string,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult> {
    return this.findByTrainerId(trainerId, {
      ...options,
      status: AcquisitionPipelineStatus.REQUESTED,
    });
  }

  public async findHistory(
    userId: string,
    isTrainer: boolean,
    options?: FindPipelinesOptions,
  ): Promise<PaginatedPipelinesResult> {
    if (!Types.ObjectId.isValid(userId)) {
      return { pipelines: [], total: 0 };
    }

    const userField = isTrainer ? 'trainerId' : 'clientId';
    const completedStates = [
      AcquisitionPipelineStatus.ACCEPTED,
      AcquisitionPipelineStatus.REJECTED,
      AcquisitionPipelineStatus.WITHDRAWN,
      AcquisitionPipelineStatus.CONVERTED,
      AcquisitionPipelineStatus.CLOSED,
    ];

    const query: FilterQuery<IAcquisitionPipelineDocument> = {
      [userField]: new Types.ObjectId(userId),
      status: options?.status ? options.status : { $in: completedStates },
    };

    const sortOrder = options?.sort === 'oldest' ? 1 : -1;
    const limit = options?.limit || 10;
    const offset = options?.offset || 0;

    const [docs, total] = await Promise.all([
      AcquisitionPipelineModel.find(query).sort({ createdAt: sortOrder }).skip(offset).limit(limit),
      AcquisitionPipelineModel.countDocuments(query),
    ]);

    return {
      pipelines: docs.map((doc) => AcquisitionPipelinePersistenceMapper.toDomain(doc)),
      total,
    };
  }
}
