import { TrainerSpecialization } from '../../../domain/enums/TrainerSpecialization';
import { TrainerAvailabilityStatus } from '../../../domain/enums/TrainerAvailabilityStatus';
import { ShowcaseType, CertificationStatus } from '../../../domain/enums/TrainerEnums';

export interface CreateTrainerProfileDTO {
  userId: string;
  headline: string;
  bio: string;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  city: string;
  state: string;
  country: string;
  timezone?: string;
}

export interface UpdateTrainerProfileDTO {
  userId: string;
  headline?: string;
  bio?: string;
  yearsOfExperience?: number;
  languages?: string[];
  specializations?: TrainerSpecialization[];
  city?: string;
  state?: string;
  country?: string;
}

export interface TrainerCertificationResponseDTO {
  certificationId: string;
  title: string;
  organization: string;
  issuedAt: string;
  expiresAt?: string | null;
  certificateUrl: string;
  status: CertificationStatus;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
}

export interface TrainerShowcaseResponseDTO {
  showcaseId: string;
  type: ShowcaseType;
  title: string;
  description: string;
  mediaUrl?: string | null;
  issuedBy?: string | null;
  achievedAt?: string | null;
}

export interface TrainerProfileResponseDTO {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: TrainerCertificationResponseDTO[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  availability: {
    status: TrainerAvailabilityStatus;
    timezone: string;
    weeklySchedule: {
      dayOfWeek: number;
      slots: {
        startTime: string;
        endTime: string;
      }[];
    }[];
  };
  totalClients: number;
  totalReviews: number;
  averageRating: number;
  profileCompleted: boolean;
  showcase: TrainerShowcaseResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicTrainerProfileResponseDTO {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: {
    title: string;
    organization: string;
    issuedAt: string;
  }[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  availabilityStatus: TrainerAvailabilityStatus;
  totalReviews: number;
  averageRating: number;
  showcase: TrainerShowcaseResponseDTO[];
}
