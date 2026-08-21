export enum CoachingOfferStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export enum CoachingPlanType {
  BASIC = 'BASIC',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export interface IPlatformPlanDefinition {
  planType: CoachingPlanType;
  name: string;
  durationDays: number;
  commissionRate: number; // e.g. 0.10 for 10%
  commissionPercent: number; // e.g. 10
  includedFeatures: string[];
  omittedFeatures: string[];
  liveSessionsDescription: string;
  tagline: string;
}

export const PLATFORM_COACHING_PLANS: Record<CoachingPlanType, IPlatformPlanDefinition> = {
  [CoachingPlanType.BASIC]: {
    planType: CoachingPlanType.BASIC,
    name: 'Basic Plan',
    durationDays: 30,
    commissionRate: 0.1,
    commissionPercent: 10,
    includedFeatures: ['Chat Support', 'Custom Workout Plan', 'Custom Diet Plan'],
    omittedFeatures: ['Live Video Sessions', 'Progress Analyzer', 'Priority Support'],
    liveSessionsDescription: 'No Live Sessions',
    tagline: 'Foundational coaching with continuous chat and personalized diet & workouts.',
  },
  [CoachingPlanType.PRO]: {
    planType: CoachingPlanType.PRO,
    name: 'Pro Plan',
    durationDays: 30,
    commissionRate: 0.15,
    commissionPercent: 15,
    includedFeatures: [
      'Chat Support',
      'Custom Workout Plan',
      'Custom Diet Plan',
      '3 Live Sessions / Week',
      'Progress Analyzer',
    ],
    omittedFeatures: ['Priority Support'],
    liveSessionsDescription: '3 Live Sessions / Week',
    tagline: 'Comprehensive coaching with 3 weekly live video sessions & progress analytics.',
  },
  [CoachingPlanType.PREMIUM]: {
    planType: CoachingPlanType.PREMIUM,
    name: 'Premium Plan',
    durationDays: 30,
    commissionRate: 0.2,
    commissionPercent: 20,
    includedFeatures: [
      'Chat Support',
      'Custom Workout Plan',
      'Custom Diet Plan',
      'Unlimited Live Sessions',
      'Progress Analyzer',
      'Priority Support',
    ],
    omittedFeatures: [],
    liveSessionsDescription: 'Unlimited Live Sessions (subject to availability)',
    tagline:
      'Elite coaching with unlimited live sessions, deep analytics, and VIP priority support.',
  },
};

export interface PricingSnapshotDTO {
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  commissionRate: number;
}

export interface ScopeSnapshotDTO {
  durationDays: number;
  planType: string;
  includedFeatures: string[];
  trainerNotes?: string;
}

export interface CoachingOfferResponseDTO {
  offerId: string;
  acquisitionPipelineId: string;
  consultationId: string;
  clientId: string;
  trainerId: string;
  pricing: PricingSnapshotDTO;
  scope: ScopeSnapshotDTO;
  status: CoachingOfferStatus;
  expiresAt: string;
  acceptedAt?: string | null;
  declinedAt?: string | null;
  declineReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOffersResponseDTO {
  offers: CoachingOfferResponseDTO[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface CreateOfferPayload {
  consultationId: string;
  planType: CoachingPlanType;
  trainerFee: number;
  currency?: string;
  trainerNotes?: string;
  sendImmediately?: boolean;
}

export interface DeclineOfferPayload {
  reason?: string;
}

export interface OfferQueryParams {
  page?: number;
  limit?: number;
  status?: CoachingOfferStatus;
  sort?: 'newest' | 'oldest' | 'expiring';
}
