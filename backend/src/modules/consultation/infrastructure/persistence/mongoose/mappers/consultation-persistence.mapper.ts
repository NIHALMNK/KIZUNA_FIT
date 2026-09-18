import { Consultation } from '../../../../domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../domain/value-objects/consultation-slot.vo';
import { MeetingDetails } from '../../../../domain/value-objects/meeting-details.vo';
import { ConsultationCancellation } from '../../../../domain/value-objects/consultation-cancellation.vo';
import { IConsultationDocument } from '../documents/consultation.document';

export class ConsultationPersistenceMapper {
  public static toDomain(doc: IConsultationDocument): Consultation {
    const slotResult = ConsultationSlot.create({
      scheduledStartAt: doc.slot.scheduledStartAt,
      scheduledEndAt: doc.slot.scheduledEndAt,
      timezone: doc.slot.timezone,
      bookedAt: doc.slot.bookedAt,
    });

    if (slotResult.isFailure) {
      throw new Error(
        `Failed to reconstruct ConsultationSlot value object from document: ${slotResult.error}`,
      );
    }

    let meetingDetails: MeetingDetails | null = null;
    if (doc.meetingDetails) {
      const detailsResult = MeetingDetails.create({
        platform: doc.meetingDetails.platform,
        roomId: doc.meetingDetails.roomId,
        meetingUrl: doc.meetingDetails.meetingUrl || null,
        joinCode: doc.meetingDetails.joinCode || null,
        instructions: doc.meetingDetails.instructions || null,
      });

      if (detailsResult.isFailure) {
        throw new Error(
          `Failed to reconstruct MeetingDetails value object from document: ${detailsResult.error}`,
        );
      }
      meetingDetails = detailsResult.getValue();
    }

    let cancellation: ConsultationCancellation | null = null;
    if (doc.cancellation) {
      const cancelResult = ConsultationCancellation.create({
        cancelledAt: doc.cancellation.cancelledAt,
        cancelledBy: doc.cancellation.cancelledBy,
        reason: doc.cancellation.reason || null,
      });

      if (cancelResult.isFailure) {
        throw new Error(
          `Failed to reconstruct ConsultationCancellation value object from document: ${cancelResult.error}`,
        );
      }
      cancellation = cancelResult.getValue();
    }

    const consultationResult = Consultation.create(
      {
        acquisitionPipelineId: doc.acquisitionPipelineId,
        clientId: doc.clientId,
        trainerId: doc.trainerId,
        slot: slotResult.getValue(),
        platform: doc.platform,
        roomId: doc.roomId,
        meetingUrl: doc.meetingUrl || null,
        meetingDetails,
        status: doc.status,
        completedAt: doc.completedAt || null,
        cancellation,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      },
      doc._id,
    );

    if (consultationResult.isFailure) {
      throw new Error(
        `Failed to reconstruct Consultation aggregate root from document: ${consultationResult.error}`,
      );
    }

    return consultationResult.getValue();
  }

  public static toPersistence(aggregate: Consultation): Record<string, unknown> {
    const slotPrimitives = aggregate.slot.toPrimitives();
    const meetingDetailsPrimitives = aggregate.meetingDetails
      ? aggregate.meetingDetails.toPrimitives()
      : null;
    const cancellationPrimitives = aggregate.cancellation
      ? aggregate.cancellation.toPrimitives()
      : null;

    return {
      _id: aggregate.consultationId,
      acquisitionPipelineId: aggregate.acquisitionPipelineId,
      clientId: aggregate.clientId,
      trainerId: aggregate.trainerId,
      slot: {
        scheduledStartAt: new Date(slotPrimitives.scheduledStartAt),
        scheduledEndAt: new Date(slotPrimitives.scheduledEndAt),
        timezone: slotPrimitives.timezone,
        bookedAt: new Date(slotPrimitives.bookedAt),
      },
      platform: aggregate.platform,
      roomId: aggregate.roomId,
      meetingUrl: aggregate.meetingUrl || null,
      meetingDetails: meetingDetailsPrimitives,
      status: aggregate.status,
      completedAt: aggregate.completedAt || null,
      cancellation: cancellationPrimitives
        ? {
            cancelledAt: new Date(cancellationPrimitives.cancelledAt),
            cancelledBy: cancellationPrimitives.cancelledBy,
            reason: cancellationPrimitives.reason,
          }
        : null,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
