import { CoachingRelationshipStatus } from '../../domain/enums/coaching-relationship-status.enum';

export interface CoachingTimelineDTO {
  activatedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  refundedAt: string | null;
  disputedAt: string | null;
  expiredAt: string | null;
}

export interface ParticipantSummaryDTO {
  id: string;
  fullName?: string;
  avatarUrl?: string | null;
  specialization?: string | null;
  experienceYears?: number | null;
}

export interface CoachingRelationshipDTO {
  relationshipId: string;
  acquisitionPipelineId: string;
  paymentId: string;
  subscriptionId: string;
  clientId: string;
  trainerId: string;
  trainer?: ParticipantSummaryDTO;
  client?: ParticipantSummaryDTO;
  durationDays?: number | null;
  planType?: string | null;
  startedAt?: string | null;
  endsAt?: string | null;
  status: CoachingRelationshipStatus;
  timeline: CoachingTimelineDTO;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CoachingRelationshipListItemDTO {
  relationshipId: string;
  trainer: ParticipantSummaryDTO;
  client: ParticipantSummaryDTO;
  acquisitionPipelineId: string;
  paymentId: string;
  subscriptionId: string;
  durationDays?: number | null;
  planType?: string | null;
  status: CoachingRelationshipStatus;
  startedAt: string | null;
  endsAt?: string | null;
  completedAt: string | null;
  createdAt: string;
}
