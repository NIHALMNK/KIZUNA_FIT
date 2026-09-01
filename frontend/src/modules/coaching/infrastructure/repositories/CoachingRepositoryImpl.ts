import { ICoachingRepository } from '../../domain/repositories/ICoachingRepository';
import {
  CoachingRelationship,
  PaginatedCoachingResponse,
  CoachingQueryParams,
  CancelCoachingRequest,
} from '../../domain/types/coaching.types';
import { coachingApi } from '../api/coachingApi';

export class CoachingRepositoryImpl implements ICoachingRepository {
  public async list(params?: CoachingQueryParams): Promise<PaginatedCoachingResponse> {
    const res = await coachingApi.list(params);
    if (res && 'relationships' in res && 'pagination' in res) {
      return res;
    }
    if (res && (res as any).data && 'relationships' in (res as any).data) {
      return (res as any).data;
    }
    return {
      relationships: [],
      pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 1 },
    };
  }

  public async getActive(): Promise<CoachingRelationship[]> {
    const res = await coachingApi.getActive();
    if (Array.isArray(res)) return res;
    if (res && 'relationships' in res && Array.isArray((res as any).relationships)) {
      return (res as any).relationships;
    }
    if (res && (res as any).data) {
      const inner = (res as any).data;
      if (Array.isArray(inner)) return inner;
      if (inner && 'relationships' in inner && Array.isArray(inner.relationships)) {
        return inner.relationships;
      }
    }
    return [];
  }

  public async getHistory(params?: CoachingQueryParams): Promise<PaginatedCoachingResponse> {
    const res = await coachingApi.getHistory(params);
    if (res && 'relationships' in res && 'pagination' in res) {
      return res;
    }
    if (res && (res as any).data && 'relationships' in (res as any).data) {
      return (res as any).data;
    }
    return {
      relationships: [],
      pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 1 },
    };
  }

  public async getById(relationshipId: string): Promise<CoachingRelationship> {
    const res = await coachingApi.getById(relationshipId);
    if (res && (res as any).data) {
      return (res as any).data;
    }
    return res;
  }

  public async activate(relationshipId: string): Promise<CoachingRelationship> {
    const res = await coachingApi.activate(relationshipId);
    if (res && (res as any).data) {
      return (res as any).data;
    }
    return res;
  }

  public async complete(relationshipId: string): Promise<CoachingRelationship> {
    const res = await coachingApi.complete(relationshipId);
    if (res && (res as any).data) {
      return (res as any).data;
    }
    return res;
  }

  public async cancel(
    relationshipId: string,
    payload: CancelCoachingRequest,
  ): Promise<CoachingRelationship> {
    const res = await coachingApi.cancel(relationshipId, payload);
    if (res && (res as any).data) {
      return (res as any).data;
    }
    return res;
  }
}

export const coachingRepository = new CoachingRepositoryImpl();
