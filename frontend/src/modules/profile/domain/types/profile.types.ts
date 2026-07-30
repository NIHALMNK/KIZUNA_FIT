import {
  Gender,
  WeightUnit,
  HeightUnit,
  DietaryPreference,
  FitnessGoal,
  ExperienceLevel,
  ActivityLevel,
  TrainerAvailabilityStatus,
  TrainerSpecialization,
  ShowcaseType,
  CertificationStatus,
} from '../enums/profile.enums';

export interface ClientProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
  phoneNumber?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  timezone?: string | null;
  weight?: { value: number; unit: WeightUnit } | null;
  height?: { value: number; unit: HeightUnit } | null;
  medicalNotes?: string | null;
  dietaryPreferences: DietaryPreference[];
  fitnessGoals: FitnessGoal[];
  experienceLevel?: ExperienceLevel | null;
  activityLevel?: ActivityLevel | null;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientProfileDTO {
  fullName: string;
}

export interface UpdateClientProfileDTO {
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  weight?: { value: number; unit: WeightUnit };
  height?: { value: number; unit: HeightUnit };
  medicalNotes?: string;
  dietaryPreferences?: DietaryPreference[];
  fitnessGoals?: FitnessGoal[];
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
}

export interface TrainerCertification {
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

export interface AddCertificationDTO {
  title: string;
  organization: string;
  issuedAt: string;
  expiresAt?: string;
  certificateUrl?: string;
  file?: File;
}

export interface UpdateCertificationDTO {
  title?: string;
  organization?: string;
  issuedAt?: string;
  expiresAt?: string;
  certificateUrl?: string;
}

export interface TrainerShowcase {
  showcaseId: string;
  type: ShowcaseType;
  title: string;
  description: string;
  mediaUrl?: string | null;
  issuedBy?: string | null;
  achievedAt?: string | null;
}

export interface AddShowcaseItemDTO {
  type: ShowcaseType;
  title: string;
  description: string;
  issuedBy?: string;
  achievedAt?: string;
  mediaUrl?: string;
  file?: File;
}

export interface UpdateShowcaseItemDTO {
  type?: ShowcaseType;
  title?: string;
  description?: string;
  issuedBy?: string;
  achievedAt?: string;
  mediaUrl?: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface DaySchedule {
  dayOfWeek: number;
  slots: TimeSlot[];
}

export interface TrainerAvailability {
  status: TrainerAvailabilityStatus;
  timezone: string;
  weeklySchedule: DaySchedule[];
}

export interface UpdateAvailabilityDTO {
  status: TrainerAvailabilityStatus;
  timezone?: string;
  weeklySchedule: DaySchedule[];
}

export interface TrainerProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: TrainerCertification[];
  location: { city: string; state: string; country: string };
  availability: TrainerAvailability;
  totalClients: number;
  totalReviews: number;
  averageRating: number;
  profileCompleted: boolean;
  showcase: TrainerShowcase[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainerProfileDTO {
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
  headline?: string;
  bio?: string;
  yearsOfExperience?: number;
  languages?: string[];
  specializations?: TrainerSpecialization[];
  city?: string;
  state?: string;
  country?: string;
}

export interface PublicTrainerProfile {
  id: string;
  userId: string;
  trainerName?: string | null;
  name?: string;
  fullName?: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: { title: string; organization: string; issuedAt: string }[];
  location: { city: string; state: string; country: string };
  availabilityStatus: TrainerAvailabilityStatus;
  totalReviews: number;
  averageRating: number;
  showcase: TrainerShowcase[];
}

export interface SearchTrainerParams {
  search?: string;
  specialization?: TrainerSpecialization;
  experienceLevel?: string;
  minRating?: number;
  availability?: TrainerAvailabilityStatus;
  verifiedOnly?: boolean;
  sortBy?: 'rating' | 'experience' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedTrainersResponse {
  data: PublicTrainerProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
