import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../domain/enums/cancellation-actor.enum';

export interface ConsultationSlotDTO {
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  timezone: string;
  bookedAt: Date;
}

export interface MeetingDetailsDTO {
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  joinCode?: string | null;
  instructions?: string | null;
}

export interface ConsultationCancellationDTO {
  cancelledAt: Date;
  cancelledBy: CancellationActor;
  reason?: string | null;
}

export interface ConsultationResponseDTO {
  consultationId: string;
  acquisitionPipelineId: string;
  clientId: string;
  trainerId: string;
  slot: ConsultationSlotDTO;
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl: string | null;
  meetingDetails: MeetingDetailsDTO | null;
  status: ConsultationStatus;
  completedAt: Date | null;
  cancellation: ConsultationCancellationDTO | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedConsultationsResponseDTO {
  consultations: ConsultationResponseDTO[];
  total: number;
  page: number;
  limit: number;
}
