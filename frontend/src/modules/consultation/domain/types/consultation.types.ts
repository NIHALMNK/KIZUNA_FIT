export enum ConsultationStatus {
  CREATED = 'CREATED',
  SLOT_BOOKED = 'SLOT_BOOKED',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum ConsultationPlatform {
  WEBRTC = 'WEBRTC',
  GOOGLE_MEET = 'GOOGLE_MEET',
  ZOOM = 'ZOOM',
  MICROSOFT_TEAMS = 'MICROSOFT_TEAMS',
}

export enum CancellationActor {
  CLIENT = 'CLIENT',
  TRAINER = 'TRAINER',
  SYSTEM = 'SYSTEM',
}

export interface ConsultationSlotDTO {
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
  bookedAt: string;
}

export interface MeetingDetailsDTO {
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  joinCode?: string | null;
  instructions?: string | null;
}

export interface ConsultationCancellationDTO {
  cancelledAt: string;
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
  completedAt: string | null;
  cancellation: ConsultationCancellationDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedConsultationsResponseDTO {
  consultations: ConsultationResponseDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateConsultationPayload {
  acquisitionPipelineId: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
  platform?: ConsultationPlatform;
}

export interface BookConsultationSlotPayload {
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
}

export interface RescheduleConsultationPayload {
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
}

export interface ScheduleConsultationPayload {
  scheduledStartAt: string;
  scheduledEndAt: string;
  timezone: string;
  platform?: ConsultationPlatform;
  meetingDetails?: {
    platform: ConsultationPlatform;
    roomId: string;
    meetingUrl?: string | null;
    joinCode?: string | null;
    instructions?: string | null;
  };
}

export interface CancelConsultationPayload {
  reason?: string;
}

export interface ConsultationQueryParams {
  page?: number;
  limit?: number;
  status?: ConsultationStatus;
  sort?: 'newest' | 'oldest';
}
