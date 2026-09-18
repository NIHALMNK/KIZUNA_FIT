import { CoachingRelationshipStatus } from '../../domain/enums/coaching-relationship-status.enum';

export interface ListCoachingRelationshipsQueryDTO {
  actorId: string;
  role: string;
  status?: CoachingRelationshipStatus | CoachingRelationshipStatus[];
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}
