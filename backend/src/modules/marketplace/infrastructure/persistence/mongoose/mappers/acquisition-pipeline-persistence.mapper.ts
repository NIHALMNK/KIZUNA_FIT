import { Types } from 'mongoose';
import { AcquisitionPipeline } from '../../../../domain/aggregates/acquisition-pipeline.aggregate';
import { TrainerRequest } from '../../../../domain/entities/trainer-request.entity';
import { TrainerSnapshot } from '../../../../domain/value-objects/trainer-snapshot.value-object';
import { IAcquisitionPipelineDocument } from '../documents/acquisition-pipeline.document';

export class AcquisitionPipelinePersistenceMapper {
  public static toDomain(doc: IAcquisitionPipelineDocument): AcquisitionPipeline {
    const requestResult = TrainerRequest.create(
      {
        clientGoal: doc.trainerRequest.clientGoal,
        clientMessage: doc.trainerRequest.clientMessage,
        status: doc.trainerRequest.status,
        submittedAt: doc.trainerRequest.submittedAt,
        respondedAt: doc.trainerRequest.respondedAt,
        responseReason: doc.trainerRequest.responseReason,
      },
      doc.trainerRequest.requestId,
    );

    if (requestResult.isFailure) {
      throw new Error(
        `Failed to reconstruct TrainerRequest entity from database document: ${requestResult.error}`,
      );
    }

    const snapshotResult = TrainerSnapshot.create({
      trainerId: doc.trainerSnapshot.trainerId,
      fullName: doc.trainerSnapshot.fullName,
      headline: doc.trainerSnapshot.headline,
      profileImage: doc.trainerSnapshot.profileImage,
      specializations: doc.trainerSnapshot.specializations,
      yearsOfExperience: doc.trainerSnapshot.yearsOfExperience,
      averageRating: doc.trainerSnapshot.averageRating,
      totalReviews: doc.trainerSnapshot.totalReviews,
    });

    if (snapshotResult.isFailure) {
      throw new Error(
        `Failed to reconstruct TrainerSnapshot value object from database document: ${snapshotResult.error}`,
      );
    }

    const pipelineResult = AcquisitionPipeline.create(
      {
        clientId: doc.clientId.toString(),
        trainerId: doc.trainerId.toString(),
        trainerRequest: requestResult.getValue(),
        trainerSnapshot: snapshotResult.getValue(),
        status: doc.status,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id.toString(),
    );

    if (pipelineResult.isFailure) {
      throw new Error(
        `Failed to reconstruct AcquisitionPipeline aggregate root from database document: ${pipelineResult.error}`,
      );
    }

    return pipelineResult.getValue();
  }

  public static toPersistence(aggregate: AcquisitionPipeline): Record<string, unknown> {
    const request = aggregate.trainerRequest;
    const snapshot = aggregate.trainerSnapshot;

    return {
      _id: Types.ObjectId.isValid(aggregate.id)
        ? new Types.ObjectId(aggregate.id)
        : new Types.ObjectId(),
      clientId: new Types.ObjectId(aggregate.clientId),
      trainerId: new Types.ObjectId(aggregate.trainerId),
      trainerRequest: {
        requestId: request.requestId,
        clientGoal: request.clientGoal,
        clientMessage: request.clientMessage,
        status: request.status,
        submittedAt: request.submittedAt,
        respondedAt: request.respondedAt || null,
        responseReason: request.responseReason || null,
      },
      trainerSnapshot: snapshot.toPrimitives(),
      status: aggregate.status,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
