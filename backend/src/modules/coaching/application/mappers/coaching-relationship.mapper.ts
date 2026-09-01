import { CoachingRelationship } from '../../domain/aggregates/coaching-relationship.aggregate';
import {
  CoachingRelationshipDTO,
  CoachingRelationshipListItemDTO,
} from '../dtos/coaching-relationship.dto';

export class CoachingRelationshipMapper {
  public static toDTO(entity: CoachingRelationship): CoachingRelationshipDTO {
    return {
      relationshipId: entity.id,
      acquisitionPipelineId: entity.acquisitionPipelineId,
      paymentId: entity.paymentId,
      subscriptionId: entity.subscriptionId,
      clientId: entity.clientId,
      trainerId: entity.trainerId,
      status: entity.status,
      timeline: {
        activatedAt: entity.timeline.activatedAt ? entity.timeline.activatedAt.toISOString() : null,
        completedAt: entity.timeline.completedAt ? entity.timeline.completedAt.toISOString() : null,
        cancelledAt: entity.timeline.cancelledAt ? entity.timeline.cancelledAt.toISOString() : null,
        refundedAt: entity.timeline.refundedAt ? entity.timeline.refundedAt.toISOString() : null,
        disputedAt: entity.timeline.disputedAt ? entity.timeline.disputedAt.toISOString() : null,
        expiredAt: entity.timeline.expiredAt ? entity.timeline.expiredAt.toISOString() : null,
      },
      cancellationReason: entity.cancellationReason,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  public static toListItemDTO(entity: CoachingRelationship): CoachingRelationshipListItemDTO {
    return {
      relationshipId: entity.id,
      trainer: {
        id: entity.trainerId,
      },
      client: {
        id: entity.clientId,
      },
      acquisitionPipelineId: entity.acquisitionPipelineId,
      paymentId: entity.paymentId,
      subscriptionId: entity.subscriptionId,
      status: entity.status,
      startedAt: entity.timeline.activatedAt ? entity.timeline.activatedAt.toISOString() : null,
      completedAt: entity.timeline.completedAt ? entity.timeline.completedAt.toISOString() : null,
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
