import { CoachingRelationship } from '../../../../domain/aggregates/coaching-relationship.aggregate';
import { CoachingTimeline } from '../../../../domain/value-objects/coaching-timeline.value-object';
import { ICoachingRelationshipDocument } from '../schemas/coaching-relationship.schema';

export class CoachingPersistenceMapper {
  public static toDomain(doc: ICoachingRelationshipDocument): CoachingRelationship {
    const timeline = CoachingTimeline.create({
      activatedAt: doc.timeline?.activatedAt ?? null,
      completedAt: doc.timeline?.completedAt ?? null,
      cancelledAt: doc.timeline?.cancelledAt ?? null,
      refundedAt: doc.timeline?.refundedAt ?? null,
      disputedAt: doc.timeline?.disputedAt ?? null,
      expiredAt: doc.timeline?.expiredAt ?? null,
    }).getValue()!;

    return CoachingRelationship.reconstitute(
      {
        acquisitionPipelineId: doc.acquisitionPipelineId,
        paymentId: doc.paymentId,
        subscriptionId: doc.subscriptionId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        status: doc.status,
        timeline,
        cancellationReason: doc.cancellationReason ?? null,
        version: doc.__v ?? 0,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );
  }

  public static toPersistence(entity: CoachingRelationship): Record<string, any> {
    return {
      _id: entity.id,
      acquisitionPipelineId: entity.acquisitionPipelineId,
      paymentId: entity.paymentId,
      subscriptionId: entity.subscriptionId,
      clientId: entity.clientId,
      trainerId: entity.trainerId,
      status: entity.status,
      timeline: {
        activatedAt: entity.timeline.activatedAt,
        completedAt: entity.timeline.completedAt,
        cancelledAt: entity.timeline.cancelledAt,
        refundedAt: entity.timeline.refundedAt,
        disputedAt: entity.timeline.disputedAt,
        expiredAt: entity.timeline.expiredAt,
      },
      cancellationReason: entity.cancellationReason,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
