import { Consultation } from '../../domain/aggregates/consultation.aggregate';
import {
  ConsultationResponseDTO,
  PaginatedConsultationsResponseDTO,
} from '../dtos/consultation-response.dto';

export class ConsultationDTOMapper {
  public static toDTO(consultation: Consultation): ConsultationResponseDTO {
    const slotPrimitives = consultation.slot.toPrimitives();
    const meetingDetailsPrimitives = consultation.meetingDetails
      ? consultation.meetingDetails.toPrimitives()
      : null;
    const cancellationPrimitives = consultation.cancellation
      ? consultation.cancellation.toPrimitives()
      : null;

    return {
      consultationId: consultation.consultationId,
      acquisitionPipelineId: consultation.acquisitionPipelineId,
      clientId: consultation.clientId,
      trainerId: consultation.trainerId,
      slot: {
        scheduledStartAt: new Date(slotPrimitives.scheduledStartAt),
        scheduledEndAt: new Date(slotPrimitives.scheduledEndAt),
        timezone: slotPrimitives.timezone,
        bookedAt: new Date(slotPrimitives.bookedAt),
      },
      platform: consultation.platform,
      roomId: consultation.roomId,
      meetingUrl: consultation.meetingUrl,
      meetingDetails: meetingDetailsPrimitives
        ? {
            platform: meetingDetailsPrimitives.platform,
            roomId: meetingDetailsPrimitives.roomId,
            meetingUrl: meetingDetailsPrimitives.meetingUrl || null,
            joinCode: meetingDetailsPrimitives.joinCode || null,
            instructions: meetingDetailsPrimitives.instructions || null,
          }
        : null,
      status: consultation.status,
      completedAt: consultation.completedAt,
      cancellation: cancellationPrimitives
        ? {
            cancelledAt: new Date(cancellationPrimitives.cancelledAt),
            cancelledBy: cancellationPrimitives.cancelledBy,
            reason: cancellationPrimitives.reason || null,
          }
        : null,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
    };
  }

  public static toPaginatedDTO(
    consultations: Consultation[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedConsultationsResponseDTO {
    return {
      consultations: consultations.map((c) => ConsultationDTOMapper.toDTO(c)),
      total,
      page,
      limit,
    };
  }
}
