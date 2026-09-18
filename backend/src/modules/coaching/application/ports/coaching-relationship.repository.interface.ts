import { CoachingRelationship } from '../../domain/aggregates/coaching-relationship.aggregate';
import { CoachingRelationshipStatus } from '../../domain/enums/coaching-relationship-status.enum';

export interface CoachingRelationshipFilter {
  clientId?: string;
  trainerId?: string;
  status?: CoachingRelationshipStatus | CoachingRelationshipStatus[];
  page?: number;
  limit?: number;
  sort?: 'newest' | 'oldest';
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export interface ICoachingRelationshipRepository {
  findById(id: string): Promise<CoachingRelationship | null>;
  findByPaymentId(paymentId: string): Promise<CoachingRelationship | null>;
  findByAcquisitionPipelineId(acquisitionPipelineId: string): Promise<CoachingRelationship | null>;
  findActiveByClientId(clientId: string): Promise<CoachingRelationship | null>;
  findActiveByTrainerId(trainerId: string): Promise<CoachingRelationship[]>;
  findAll(filter: CoachingRelationshipFilter): Promise<PaginatedResult<CoachingRelationship>>;
  save(relationship: CoachingRelationship): Promise<void>;
}
