import { Document } from 'mongoose';
import { CoachingOfferStatus } from '../../../../domain/enums/coaching-offer-status.enum';

export interface IPricingSnapshotDocument {
  trainerFee: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  commissionRate: number;
}

export interface IScopeSnapshotDocument {
  durationDays: number;
  planType: string;
  includedFeatures: string[];
  trainerNotes?: string | null;
}

export interface ICoachingOfferDocument extends Document<string> {
  _id: string;
  acquisitionPipelineId: string;
  consultationId: string;
  clientId: string;
  trainerId: string;
  pricingSnapshot: IPricingSnapshotDocument;
  scopeSnapshot: IScopeSnapshotDocument;
  status: CoachingOfferStatus;
  expiresAt: Date;
  acceptedAt?: Date | null;
  declinedAt?: Date | null;
  declineReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
