import { describe, it, expect } from 'vitest';
import { Types } from 'mongoose';
import { AcquisitionPipelinePersistenceMapper } from '../../../src/modules/marketplace/infrastructure/persistence/mongoose/mappers/acquisition-pipeline-persistence.mapper';
import { AcquisitionPipelineFactory } from '../../../src/modules/marketplace/domain/factories/acquisition-pipeline.factory';
import { AcquisitionPipelineStatus } from '../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('AcquisitionPipelinePersistenceMapper', () => {
  const sampleSnapshotProps = {
    trainerId: '507f1f77bcf86cd799439011',
    fullName: 'Trainer Name',
    headline: 'Fitness Coach',
    profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
    specializations: ['Cardio'],
    yearsOfExperience: 3,
    averageRating: 4.5,
    totalReviews: 20,
  };

  it('should accurately convert an AcquisitionPipeline Aggregate to a persistence payload', () => {
    const aggregate = AcquisitionPipelineFactory.createNewPipeline({
      clientId: '507f1f77bcf86cd799439012',
      trainerId: '507f1f77bcf86cd799439011',
      clientGoal: 'Build stamina',
      clientMessage: 'Let us start soon',
      trainerSnapshot: sampleSnapshotProps,
    }).getValue();

    const persistenceDoc = AcquisitionPipelinePersistenceMapper.toPersistence(aggregate);

    expect(persistenceDoc._id).toBeInstanceOf(Types.ObjectId);
    expect(persistenceDoc.clientId).toBeInstanceOf(Types.ObjectId);
    expect(persistenceDoc.trainerId).toBeInstanceOf(Types.ObjectId);
    expect(persistenceDoc.status).toBe(AcquisitionPipelineStatus.REQUESTED);
    expect((persistenceDoc.trainerRequest as Record<string, unknown>).clientGoal).toBe(
      'Build stamina',
    );
    expect((persistenceDoc.trainerSnapshot as Record<string, unknown>).fullName).toBe(
      'Trainer Name',
    );
  });

  it('should accurately reconstruct an AcquisitionPipeline Aggregate from a Mongoose document', () => {
    const docId = new Types.ObjectId();
    const clientId = new Types.ObjectId();
    const trainerId = new Types.ObjectId();

    const mockDoc: Record<string, unknown> = {
      _id: docId,
      clientId,
      trainerId,
      status: AcquisitionPipelineStatus.ACCEPTED,
      trainerRequest: {
        requestId: 'req_123',
        clientGoal: 'Lose weight',
        clientMessage: 'Msg',
        status: 'ACCEPTED',
        submittedAt: new Date(),
        respondedAt: new Date(),
        responseReason: null,
      },
      trainerSnapshot: sampleSnapshotProps,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const aggregate = AcquisitionPipelinePersistenceMapper.toDomain(
      mockDoc as unknown as IAcquisitionPipelineDocument,
    );

    expect(aggregate.id).toBe(docId.toString());
    expect(aggregate.clientId).toBe(clientId.toString());
    expect(aggregate.trainerId).toBe(trainerId.toString());
    expect(aggregate.status).toBe(AcquisitionPipelineStatus.ACCEPTED);
    expect(aggregate.trainerRequest.clientGoal).toBe('Lose weight');
  });
});
