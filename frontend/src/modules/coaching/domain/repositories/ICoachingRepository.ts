import {
  CoachingRelationship,
  PaginatedCoachingResponse,
  CoachingQueryParams,
  CancelCoachingRequest,
} from '../types/coaching.types';

export interface ICoachingRepository {
  list(params?: CoachingQueryParams): Promise<PaginatedCoachingResponse>;
  getActive(): Promise<CoachingRelationship[]>;
  getHistory(params?: CoachingQueryParams): Promise<PaginatedCoachingResponse>;
  getById(relationshipId: string): Promise<CoachingRelationship>;
  activate(relationshipId: string): Promise<CoachingRelationship>;
  complete(relationshipId: string): Promise<CoachingRelationship>;
  cancel(relationshipId: string, payload: CancelCoachingRequest): Promise<CoachingRelationship>;
}
