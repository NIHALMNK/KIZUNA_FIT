import { TrainerAvailabilityStatus } from '../../domain/enums/TrainerAvailabilityStatus';

export interface UpdateAvailabilityDTO {
  userId: string;
  status: TrainerAvailabilityStatus;
  timezone?: string;
  weeklySchedule: {
    dayOfWeek: number;
    slots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
}

export interface AddCertificationDTO {
  userId: string;
  title: string;
  organization: string;
  issuedAt: string; // ISO date
  expiresAt?: string; // ISO date
  fileBuffer?: Buffer;
  fileMimeType?: string;
  certificateUrl?: string;
}

export interface UpdateCertificationDTO {
  userId: string;
  certificationId: string;
  title?: string;
  organization?: string;
  issuedAt?: string;
  expiresAt?: string;
  certificateUrl?: string;
}

export interface AddShowcaseItemDTO {
  userId: string;
  type: string;
  title: string;
  description: string;
  issuedBy?: string;
  achievedAt?: string;
  fileBuffer?: Buffer;
  fileMimeType?: string;
  mediaUrl?: string;
}

export interface UpdateShowcaseItemDTO {
  userId: string;
  showcaseId: string;
  type?: string;
  title?: string;
  description?: string;
  issuedBy?: string;
  achievedAt?: string;
  mediaUrl?: string;
}
