import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';
import { CoachingPlanType } from '../../domain/enums/coaching-plan-type.enum';

export interface CreateOfferCommandDTO {
  consultationId: string;
  trainerId: string;
  planType: CoachingPlanType | string;
  trainerFee: number;
  currency?: string;
  trainerNotes?: string;
  sendImmediately?: boolean;
}

export interface SendOfferCommandDTO {
  offerId: string;
  trainerId: string;
}

export interface AcceptOfferCommandDTO {
  offerId: string;
  clientId: string;
}

export interface DeclineOfferCommandDTO {
  offerId: string;
  clientId: string;
  reason?: string;
}

export interface ExpireOfferCommandDTO {
  offerId: string;
  requestedBy?: string;
}

export interface GetOffersQueryDTO {
  userId: string;
  userRole: 'CLIENT' | 'TRAINER' | 'ADMIN';
  page?: number;
  limit?: number;
  status?: CoachingOfferStatus;
  sort?: 'newest' | 'oldest' | 'expiring';
}
