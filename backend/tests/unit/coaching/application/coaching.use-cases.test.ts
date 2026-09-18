import { describe, it, expect, beforeEach } from 'vitest';
import {
  ICoachingRelationshipRepository,
  CoachingRelationshipFilter,
  PaginatedResult,
} from '../../../../src/modules/coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationship } from '../../../../src/modules/coaching/domain/aggregates/coaching-relationship.aggregate';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';
import { CreateCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/create-coaching-relationship.use-case';
import { ActivateCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/activate-coaching-relationship.use-case';
import { GetCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/get-coaching-relationship.use-case';
import { ListCoachingRelationshipsUseCase } from '../../../../src/modules/coaching/application/use-cases/list-coaching-relationships.use-case';
import { GetActiveCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/get-active-coaching-relationship.use-case';
import { GetCoachingHistoryUseCase } from '../../../../src/modules/coaching/application/use-cases/get-coaching-history.use-case';
import { CompleteCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/complete-coaching-relationship.use-case';
import { CancelCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/cancel-coaching-relationship.use-case';
import {
  ClientHasActiveRelationshipException,
  UnauthorizedCoachingActionException,
  CoachingRelationshipNotFoundException,
} from '../../../../src/modules/coaching/domain/exceptions/coaching-domain.exceptions';

class InMemoryCoachingRepository implements ICoachingRelationshipRepository {
  public items: Map<string, CoachingRelationship> = new Map();

  async findById(id: string): Promise<CoachingRelationship | null> {
    return this.items.get(id) ?? null;
  }

  async findByPaymentId(paymentId: string): Promise<CoachingRelationship | null> {
    for (const rel of this.items.values()) {
      if (rel.paymentId === paymentId) return rel;
    }
    return null;
  }

  async findByAcquisitionPipelineId(
    acquisitionPipelineId: string,
  ): Promise<CoachingRelationship | null> {
    for (const rel of this.items.values()) {
      if (rel.acquisitionPipelineId === acquisitionPipelineId) return rel;
    }
    return null;
  }

  async findActiveByClientId(clientId: string): Promise<CoachingRelationship | null> {
    for (const rel of this.items.values()) {
      if (rel.clientId === clientId && rel.isActive()) return rel;
    }
    return null;
  }

  async findActiveByTrainerId(trainerId: string): Promise<CoachingRelationship[]> {
    const list: CoachingRelationship[] = [];
    for (const rel of this.items.values()) {
      if (rel.trainerId === trainerId && rel.isActive()) list.push(rel);
    }
    return list;
  }

  async findAll(
    filter: CoachingRelationshipFilter,
  ): Promise<PaginatedResult<CoachingRelationship>> {
    let result = Array.from(this.items.values());

    if (filter.clientId) {
      result = result.filter((r) => r.clientId === filter.clientId);
    }
    if (filter.trainerId) {
      result = result.filter((r) => r.trainerId === filter.trainerId);
    }
    if (filter.status) {
      const statuses = Array.isArray(filter.status) ? filter.status : [filter.status];
      result = result.filter((r) => statuses.includes(r.status));
    }

    const page = filter.page ?? 1;
    const limit = filter.limit ?? 10;
    const totalRecords = result.length;
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const items = result.slice((page - 1) * limit, page * limit);

    return {
      items,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };
  }

  async save(relationship: CoachingRelationship): Promise<void> {
    this.items.set(relationship.id, relationship);
  }
}

describe('Coaching Application Layer Use Case Unit Tests', () => {
  let repo: InMemoryCoachingRepository;

  beforeEach(() => {
    repo = new InMemoryCoachingRepository();
  });

  describe('CreateCoachingRelationshipUseCase', () => {
    it('should create a relationship directly in ACTIVE status upon PaymentSucceeded', async () => {
      const useCase = new CreateCoachingRelationshipUseCase(repo);
      const dto = await useCase.execute({
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      });

      expect(dto.status).toBe(CoachingRelationshipStatus.ACTIVE);
      expect(dto.paymentId).toBe('pay_100');
      expect(dto.timeline.activatedAt).not.toBeNull();
      expect(repo.items.size).toBe(1);
    });

    it('should be idempotent and return existing relationship if paymentId already processed', async () => {
      const useCase = new CreateCoachingRelationshipUseCase(repo);
      const dto1 = await useCase.execute({
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      });

      // Duplicate delivery of same PaymentSucceeded event
      const dto2 = await useCase.execute({
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      });

      expect(dto1.relationshipId).toBe(dto2.relationshipId);
      expect(repo.items.size).toBe(1);
    });

    it('should reject creation if client already has another active coaching relationship', async () => {
      const useCase = new CreateCoachingRelationshipUseCase(repo);
      await useCase.execute({
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      });

      // Second active relationship attempt for same client with a different trainer
      await expect(
        useCase.execute({
          acquisitionPipelineId: 'pipe_200',
          paymentId: 'pay_200',
          subscriptionId: 'sub_200',
          clientId: 'usr_client_01',
          trainerId: 'usr_trainer_02',
        }),
      ).rejects.toThrow(ClientHasActiveRelationshipException);
    });
  });

  describe('ActivateCoachingRelationshipUseCase', () => {
    it('should allow admin/system to activate pending relationship', async () => {
      const pendingRel = CoachingRelationship.createPending({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_02',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(pendingRel);

      const useCase = new ActivateCoachingRelationshipUseCase(repo);
      const res = await useCase.execute({
        relationshipId: pendingRel.id,
        actorRole: 'ADMIN',
      });

      expect(res.status).toBe(CoachingRelationshipStatus.ACTIVE);
      expect(res.timeline.activatedAt).not.toBeNull();
    });

    it('should reject activation attempt by client or trainer', async () => {
      const pendingRel = CoachingRelationship.createPending({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_02',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(pendingRel);

      const useCase = new ActivateCoachingRelationshipUseCase(repo);
      await expect(
        useCase.execute({
          relationshipId: pendingRel.id,
          actorRole: 'CLIENT',
        }),
      ).rejects.toThrow(UnauthorizedCoachingActionException);
    });
  });

  describe('GetCoachingRelationshipUseCase', () => {
    it('should allow client participant to view relationship', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const useCase = new GetCoachingRelationshipUseCase(repo);
      const res = await useCase.execute({
        relationshipId: rel.id,
        actorId: 'usr_client_01',
        actorRole: 'CLIENT',
      });

      expect(res.relationshipId).toBe(rel.id);
    });

    it('should reject viewing by unrelated third-party client', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const useCase = new GetCoachingRelationshipUseCase(repo);
      await expect(
        useCase.execute({
          relationshipId: rel.id,
          actorId: 'usr_client_999',
          actorRole: 'CLIENT',
        }),
      ).rejects.toThrow(UnauthorizedCoachingActionException);
    });

    it('should throw 404 when relationship is not found', async () => {
      const useCase = new GetCoachingRelationshipUseCase(repo);
      await expect(
        useCase.execute({
          relationshipId: 'non_existent_id',
          actorId: 'usr_admin',
          actorRole: 'ADMIN',
        }),
      ).rejects.toThrow(CoachingRelationshipNotFoundException);
    });
  });

  describe('GetActiveCoachingRelationshipUseCase', () => {
    it('should return active relationship for client', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const useCase = new GetActiveCoachingRelationshipUseCase(repo);
      const res = (await useCase.execute({
        actorId: 'usr_client_01',
        role: 'CLIENT',
      })) as any;

      expect(res).not.toBeNull();
      expect(res.relationshipId).toBe(rel.id);
      expect(res.status).toBe(CoachingRelationshipStatus.ACTIVE);
    });

    it('should return enriched active relationship for client when enricher is provided', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const mockEnricher = {
        enrichRelationship: async (dto: any) => ({
          ...dto,
          trainer: {
            id: 'usr_trainer_01',
            fullName: 'Coach Mohammed',
            avatarUrl: 'https://example.com/avatar.jpg',
            specialization: 'Strength & Conditioning',
          },
          client: {
            id: 'usr_client_01',
            fullName: 'Client Nihal',
            avatarUrl: null,
          },
          durationDays: 30,
          planType: 'PRO',
          startedAt: '2026-08-29T10:00:00.000Z',
          endsAt: '2026-09-28T10:00:00.000Z',
        }),
        enrichRelationshipList: async (items: any[]) => items,
      };

      const useCase = new GetActiveCoachingRelationshipUseCase(repo, mockEnricher);
      const res = (await useCase.execute({
        actorId: 'usr_client_01',
        role: 'CLIENT',
      })) as any;

      expect(res).not.toBeNull();
      expect(res.relationshipId).toBe(rel.id);
      expect(res.trainer?.fullName).toBe('Coach Mohammed');
      expect(res.trainer?.specialization).toBe('Strength & Conditioning');
      expect(res.client?.fullName).toBe('Client Nihal');
      expect(res.durationDays).toBe(30);
      expect(res.endsAt).toBe('2026-09-28T10:00:00.000Z');
    });

    it('should return null if client has no active coaching relationship', async () => {
      const useCase = new GetActiveCoachingRelationshipUseCase(repo);
      const res = await useCase.execute({
        actorId: 'usr_client_without_coach',
        role: 'CLIENT',
      });

      expect(res).toBeNull();
    });
  });

  describe('GetCoachingHistoryUseCase', () => {
    it('should return completed and cancelled relationships for client', async () => {
      const rel1 = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      rel1.complete('usr_trainer_01');
      await repo.save(rel1);

      const useCase = new GetCoachingHistoryUseCase(repo);
      const history = await useCase.execute({
        actorId: 'usr_client_01',
        role: 'CLIENT',
      });

      expect(history.items.length).toBe(1);
      expect(history.items[0].status).toBe(CoachingRelationshipStatus.COMPLETED);
    });
  });

  describe('CompleteCoachingRelationshipUseCase', () => {
    it('should complete active relationship when called by assigned trainer', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const useCase = new CompleteCoachingRelationshipUseCase(repo);
      const res = await useCase.execute({
        relationshipId: rel.id,
        actorId: 'usr_trainer_01',
      });

      expect(res.status).toBe(CoachingRelationshipStatus.COMPLETED);
      expect(res.timeline.completedAt).not.toBeNull();
    });
  });

  describe('CancelCoachingRelationshipUseCase', () => {
    it('should cancel relationship when called by trainer with reason', async () => {
      const rel = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: 'pipe_101',
        paymentId: 'pay_101',
        subscriptionId: 'sub_101',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      }).getValue()!;
      await repo.save(rel);

      const useCase = new CancelCoachingRelationshipUseCase(repo);
      const res = await useCase.execute({
        relationshipId: rel.id,
        actorId: 'usr_trainer_01',
        reason: 'Client requested cancellation',
      });

      expect(res.status).toBe(CoachingRelationshipStatus.CANCELLED);
      expect(res.cancellationReason).toBe('Client requested cancellation');
      expect(res.timeline.cancelledAt).not.toBeNull();
    });
  });
});
