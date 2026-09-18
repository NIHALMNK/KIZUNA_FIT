import { CoachingRelationship } from '../../../coaching/domain/types/coaching.types';
import { CoachingOfferResponseDTO } from '../../../offer/domain/types/offer.types';
import { ConsultationResponseDTO } from '../../../consultation/domain/types/consultation.types';
import { TrainerRequestResponseDTO } from '../../../marketplace/domain/types';

export enum JourneyStage {
  STAGE_1_DISCOVERY = 'STAGE_1_DISCOVERY',
  STAGE_2_TRAINER_SELECTED = 'STAGE_2_TRAINER_SELECTED',
  STAGE_3_REQUEST_PENDING = 'STAGE_3_REQUEST_PENDING',
  STAGE_4_CONSULTATION = 'STAGE_4_CONSULTATION',
  STAGE_5_OFFER = 'STAGE_5_OFFER',
  STAGE_6_MY_TRAINER = 'STAGE_6_MY_TRAINER',
}

export interface SelectedTrainerInfo {
  id: string;
  userId?: string;
  fullName: string;
  headline?: string;
  avatarUrl?: string | null;
  yearsOfExperience?: number;
  specializations?: string[];
  bio?: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface ClientAcquisitionJourneyState {
  currentStage: JourneyStage;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  selectedTrainer: SelectedTrainerInfo | null;
  setSelectedTrainer: (trainer: SelectedTrainerInfo | null) => void;
  activeCoaching: CoachingRelationship | null;
  activeOffer: CoachingOfferResponseDTO | null;
  activeConsultation: ConsultationResponseDTO | null;
  activeRequest: TrainerRequestResponseDTO | null;
  refetchAll: () => Promise<void>;
}
