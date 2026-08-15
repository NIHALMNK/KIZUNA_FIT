import { Document } from 'mongoose';
import { ConsultationStatus } from '../../../../domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../../../domain/enums/cancellation-actor.enum';

export interface IConsultationSlotDocument {
  scheduledStartAt: Date;
  scheduledEndAt: Date;
  timezone: string;
  bookedAt: Date;
}

export interface IMeetingDetailsDocument {
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  joinCode?: string | null;
  instructions?: string | null;
}

export interface IConsultationCancellationDocument {
  cancelledAt: Date;
  cancelledBy: CancellationActor;
  reason?: string | null;
}

export interface IConsultationDocument extends Document<string> {
  _id: string;
  acquisitionPipelineId: string;
  clientId: string;
  trainerId: string;
  slot: IConsultationSlotDocument;
  platform: ConsultationPlatform;
  roomId: string;
  meetingUrl?: string | null;
  meetingDetails?: IMeetingDetailsDocument | null;
  status: ConsultationStatus;
  completedAt?: Date | null;
  cancellation?: IConsultationCancellationDocument | null;
  createdAt: Date;
  updatedAt: Date;
}
