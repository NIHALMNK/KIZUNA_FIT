import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoachingRelationship } from '../../../../src/modules/coaching/domain/aggregates/coaching-relationship.aggregate';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';
import { MongoCoachingRelationshipRepository } from '../../../../src/modules/coaching/infrastructure/persistence/mongoose/repositories/mongo-coaching-relationship.repository';
import { CoachingRelationshipModel } from '../../../../src/modules/coaching/infrastructure/persistence/mongoose/schemas/coaching-relationship.schema';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { CoachingConcurrencyConflictException } from '../../../../src/modules/coaching/domain/exceptions/coaching-domain.exceptions';

describe('MongoCoachingRelationshipRepository Unit Tests', () => {
  let mockDispatcher: DomainEventDispatcher;
  let repo: MongoCoachingRelationshipRepository;

  beforeEach(() => {
    vi.restoreAllMocks();

    mockDispatcher = {
      dispatchAll: vi.fn().mockResolvedValue(undefined),
    } as unknown as DomainEventDispatcher;

    repo = new MongoCoachingRelationshipRepository(mockDispatcher);
  });

  const createTestRelationship = () => {
    return CoachingRelationship.createDirectActive(
      {
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      },
      'rel_100',
    ).getValue()!;
  };

  describe('save() method', () => {
    it('should create a new document and dispatch events when record does not exist', async () => {
      const rel = createTestRelationship();

      vi.spyOn(CoachingRelationshipModel, 'findById').mockResolvedValue(null as any);
      const createSpy = vi.spyOn(CoachingRelationshipModel, 'create').mockResolvedValue({} as any);

      await repo.save(rel);

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: 'rel_100',
          status: CoachingRelationshipStatus.ACTIVE,
          __v: 0,
        }),
      );
      expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
    });

    it('should update existing document with incremented __v', async () => {
      const rel = createTestRelationship();

      vi.spyOn(CoachingRelationshipModel, 'findById').mockResolvedValue({
        _id: 'rel_100',
        __v: 0,
      } as any);

      const updateSpy = vi
        .spyOn(CoachingRelationshipModel, 'updateOne')
        .mockResolvedValue({ matchedCount: 1 } as any);

      await repo.save(rel);

      expect(updateSpy).toHaveBeenCalledWith(
        { _id: 'rel_100', __v: 0 },
        expect.objectContaining({
          $set: expect.objectContaining({
            _id: 'rel_100',
            __v: 1,
          }),
        }),
      );
    });

    it('should throw CoachingConcurrencyConflictException when update matchedCount is 0', async () => {
      const rel = createTestRelationship();

      vi.spyOn(CoachingRelationshipModel, 'findById').mockResolvedValue({
        _id: 'rel_100',
        __v: 0,
      } as any);

      vi.spyOn(CoachingRelationshipModel, 'updateOne').mockResolvedValue({
        matchedCount: 0,
      } as any);

      await expect(repo.save(rel)).rejects.toThrow(CoachingConcurrencyConflictException);
    });
  });

  describe('Query methods', () => {
    it('should findById and map to domain entity', async () => {
      const mockDoc = {
        _id: 'rel_100',
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
        status: CoachingRelationshipStatus.ACTIVE,
        timeline: {
          activatedAt: new Date(),
          completedAt: null,
          cancelledAt: null,
          refundedAt: null,
          disputedAt: null,
          expiredAt: null,
        },
        cancellationReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };

      vi.spyOn(CoachingRelationshipModel, 'findById').mockResolvedValue(mockDoc as any);

      const entity = await repo.findById('rel_100');
      expect(entity).not.toBeNull();
      expect(entity!.id).toBe('rel_100');
      expect(entity!.status).toBe(CoachingRelationshipStatus.ACTIVE);
      expect(entity!.timeline.activatedAt).toBeInstanceOf(Date);
    });

    it('should return null when relationship is not found by ID', async () => {
      vi.spyOn(CoachingRelationshipModel, 'findById').mockResolvedValue(null as any);

      const entity = await repo.findById('non_existent');
      expect(entity).toBeNull();
    });

    it('should findActiveByClientId', async () => {
      const mockDoc = {
        _id: 'rel_100',
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
        status: CoachingRelationshipStatus.ACTIVE,
        timeline: { activatedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      };

      const findOneSpy = vi
        .spyOn(CoachingRelationshipModel, 'findOne')
        .mockResolvedValue(mockDoc as any);

      const entity = await repo.findActiveByClientId('usr_client_01');
      expect(findOneSpy).toHaveBeenCalledWith({
        clientId: 'usr_client_01',
        status: CoachingRelationshipStatus.ACTIVE,
      });
      expect(entity).not.toBeNull();
      expect(entity!.clientId).toBe('usr_client_01');
    });
  });
});
