import { CoachingOffer } from '../aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../enums/coaching-offer-status.enum';

export interface FindOffersOptions {
  status?: CoachingOfferStatus;
  sort?: 'newest' | 'oldest' | 'expiring';
  limit?: number;
  offset?: number;
}

export interface PaginatedOffersResult {
  offers: CoachingOffer[];
  total: number;
}

export interface ICoachingOfferRepository {
  save(offer: CoachingOffer): Promise<void>;
  findById(id: string): Promise<CoachingOffer | null>;
  findByConsultationId(consultationId: string): Promise<CoachingOffer | null>;
  findByAcquisitionPipelineId(acquisitionPipelineId: string): Promise<CoachingOffer | null>;
  findByClientId(clientId: string, options?: FindOffersOptions): Promise<PaginatedOffersResult>;
  findByTrainerId(trainerId: string, options?: FindOffersOptions): Promise<PaginatedOffersResult>;
  findExpiredPendingOffers(referenceDate?: Date): Promise<CoachingOffer[]>;
}
