/**
 * KIZUNAFIT - Coaching Domain Types & Contracts
 * Authoritative client-facing domain definitions (SM-07, Domain 7).
 */

export enum CoachingRelationshipStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
  EXPIRED = 'EXPIRED',
}

export interface CoachingTimeline {
  readonly activatedAt: string | null;
  readonly completedAt: string | null;
  readonly cancelledAt: string | null;
  readonly refundedAt: string | null;
  readonly disputedAt: string | null;
  readonly expiredAt: string | null;
}

export interface CoachingParticipant {
  readonly id: string;
  readonly fullName?: string;
  readonly avatarUrl?: string | null;
  readonly specialization?: string | null;
  readonly experienceYears?: number | null;
}

export interface CoachingRelationship {
  readonly relationshipId: string;
  readonly acquisitionPipelineId: string;
  readonly paymentId: string;
  readonly subscriptionId: string;
  readonly clientId: string;
  readonly trainerId: string;
  readonly trainer?: CoachingParticipant;
  readonly client?: CoachingParticipant;
  readonly durationDays?: number | null;
  readonly planType?: string | null;
  readonly startedAt?: string | null;
  readonly endsAt?: string | null;
  readonly status: CoachingRelationshipStatus;
  readonly timeline: CoachingTimeline;
  readonly cancellationReason?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CoachingRelationshipListItem {
  readonly relationshipId: string;
  readonly trainer: CoachingParticipant;
  readonly client: CoachingParticipant;
  readonly acquisitionPipelineId: string;
  readonly paymentId: string;
  readonly subscriptionId: string;
  readonly durationDays?: number | null;
  readonly planType?: string | null;
  readonly status: CoachingRelationshipStatus;
  readonly startedAt: string | null;
  readonly endsAt?: string | null;
  readonly completedAt: string | null;
  readonly createdAt: string;
}

export interface PaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalRecords: number;
  readonly totalPages: number;
}

export interface PaginatedCoachingResponse {
  readonly relationships: CoachingRelationshipListItem[];
  readonly pagination: PaginationMeta;
}

export interface CoachingQueryParams {
  readonly page?: number;
  readonly limit?: number;
  readonly status?: CoachingRelationshipStatus | CoachingRelationshipStatus[];
  readonly sort?: 'newest' | 'oldest';
}

export interface CancelCoachingRequest {
  readonly reason: string;
}
