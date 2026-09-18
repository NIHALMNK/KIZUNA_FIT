import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';

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
