import { describe, it, expect, vi, beforeEach } from 'vitest';
import { coachingApi } from '../../infrastructure/api/coachingApi';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';

describe('Frontend Coaching Infrastructure Layer Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockRelationship = {
    relationshipId: 'rel_100',
    acquisitionPipelineId: 'pipe_100',
    paymentId: 'pay_100',
    subscriptionId: 'sub_100',
    clientId: 'usr_client_01',
    trainerId: 'usr_trainer_01',
    status: CoachingRelationshipStatus.ACTIVE,
    timeline: {
      activatedAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      refundedAt: null,
      disputedAt: null,
      expiredAt: null,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  describe('coachingApi', () => {
    it('should call GET /coaching-relationships with query params', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        relationships: [mockRelationship],
        pagination: { page: 1, limit: 10, totalRecords: 1, totalPages: 1 },
      } as any);

      const res = await coachingApi.list({ status: CoachingRelationshipStatus.ACTIVE });

      expect(getSpy).toHaveBeenCalledWith('/coaching-relationships', {
        params: { status: CoachingRelationshipStatus.ACTIVE },
      });
      expect(res.relationships.length).toBe(1);
    });

    it('should call GET /coaching-relationships/active', async () => {
      const getSpy = vi.spyOn(httpClient, 'get').mockResolvedValue({
        relationships: [mockRelationship],
      } as any);

      const res = await coachingApi.getActive();

      expect(getSpy).toHaveBeenCalledWith('/coaching-relationships/active');
      expect(res.relationships[0].relationshipId).toBe('rel_100');
    });

    it('should call POST /coaching-relationships/:id/complete', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        ...mockRelationship,
        status: CoachingRelationshipStatus.COMPLETED,
      } as any);

      const res = await coachingApi.complete('rel_100');

      expect(postSpy).toHaveBeenCalledWith('/coaching-relationships/rel_100/complete');
      expect(res.status).toBe(CoachingRelationshipStatus.COMPLETED);
    });

    it('should call POST /coaching-relationships/:id/cancel with reason', async () => {
      const postSpy = vi.spyOn(httpClient, 'post').mockResolvedValue({
        ...mockRelationship,
        status: CoachingRelationshipStatus.CANCELLED,
      } as any);

      const res = await coachingApi.cancel('rel_100', { reason: 'Relocation' });

      expect(postSpy).toHaveBeenCalledWith('/coaching-relationships/rel_100/cancel', {
        reason: 'Relocation',
      });
      expect(res.status).toBe(CoachingRelationshipStatus.CANCELLED);
    });
  });

  describe('CoachingRepositoryImpl', () => {
    it('should delegate getActive to coachingApi', async () => {
      vi.spyOn(coachingApi, 'getActive').mockResolvedValue({
        relationships: [mockRelationship as any],
      });

      const active = await coachingRepository.getActive();
      expect(active.length).toBe(1);
      expect(active[0].relationshipId).toBe('rel_100');
    });

    it('should delegate getById to coachingApi', async () => {
      vi.spyOn(coachingApi, 'getById').mockResolvedValue(mockRelationship as any);

      const rel = await coachingRepository.getById('rel_100');
      expect(rel.relationshipId).toBe('rel_100');
    });
  });
});
