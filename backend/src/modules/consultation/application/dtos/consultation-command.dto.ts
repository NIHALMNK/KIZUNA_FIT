import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../domain/enums/cancellation-actor.enum';

export interface CreateConsultationCommandDTO {
  acquisitionPipelineId: string;
  userId: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  timezone: string;
  platform?: ConsultationPlatform;
}

export interface BookConsultationSlotCommandDTO {
  consultationId: string;
  clientId: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  timezone: string;
}

export interface ScheduleConsultationCommandDTO {
  consultationId: string;
  userId: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
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

export interface ConfirmConsultationScheduleCommandDTO {
  consultationId: string;
  trainerId: string;
}

export interface CancelConsultationCommandDTO {
  consultationId: string;
  userId: string;
  cancelledBy: CancellationActor;
  reason?: string;
}

export interface CompleteConsultationCommandDTO {
  consultationId: string;
  trainerId: string;
}

export interface MarkConsultationNoShowCommandDTO {
  consultationId: string;
  trainerId: string;
}

export interface GetConsultationQueryDTO {
  consultationId: string;
  userId: string;
}

export interface GetConsultationByPipelineQueryDTO {
  acquisitionPipelineId: string;
  userId: string;
}

export interface ListConsultationsQueryDTO {
  userId: string;
  isTrainer: boolean;
  status?: ConsultationStatus;
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}

export interface GetConsultationByRoomIdQueryDTO {
  roomId: string;
  userId: string;
}
