import { TrainerSpecialization } from '../../../domain/enums/TrainerSpecialization';
import { TrainerAvailabilityStatus } from '../../../domain/enums/TrainerAvailabilityStatus';

export interface SearchTrainerQuery {
  search?: string;
  specialization?: TrainerSpecialization;
  experienceLevel?: string;
  minRating?: number;
  availability?: TrainerAvailabilityStatus;
  verifiedOnly?: boolean;
  sortBy?: 'rating' | 'experience' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}
