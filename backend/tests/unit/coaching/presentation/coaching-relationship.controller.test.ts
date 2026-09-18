import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { CoachingRelationshipController } from '../../../../src/modules/coaching/presentation/controllers/coaching-relationship.controller';
import { ListCoachingRelationshipsUseCase } from '../../../../src/modules/coaching/application/use-cases/list-coaching-relationships.use-case';
import { GetActiveCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/get-active-coaching-relationship.use-case';
import { GetCoachingHistoryUseCase } from '../../../../src/modules/coaching/application/use-cases/get-coaching-history.use-case';
import { GetCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/get-coaching-relationship.use-case';
import { ActivateCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/activate-coaching-relationship.use-case';
import { CompleteCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/complete-coaching-relationship.use-case';
import { CancelCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/cancel-coaching-relationship.use-case';
import {
  CoachingRelationshipNotFoundException,
  UnauthorizedCoachingActionException,
  InvalidCoachingTransitionException,
} from '../../../../src/modules/coaching/domain/exceptions/coaching-domain.exceptions';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';

describe('CoachingRelationshipController Unit Tests', () => {
  let listUseCase: ListCoachingRelationshipsUseCase;
  let getActiveUseCase: GetActiveCoachingRelationshipUseCase;
  let getHistoryUseCase: GetCoachingHistoryUseCase;
  let getDetailUseCase: GetCoachingRelationshipUseCase;
  let activateUseCase: ActivateCoachingRelationshipUseCase;
  let completeUseCase: CompleteCoachingRelationshipUseCase;
  let cancelUseCase: CancelCoachingRelationshipUseCase;
  let controller: CoachingRelationshipController;

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let responseData: any;
  let statusCode: number;

  beforeEach(() => {
    listUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          items: [],
          pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 1 },
        }),
    } as unknown as ListCoachingRelationshipsUseCase;

    getActiveUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          relationshipId: 'rel_100',
          status: CoachingRelationshipStatus.ACTIVE,
        }),
    } as unknown as GetActiveCoachingRelationshipUseCase;

    getHistoryUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          items: [],
          pagination: { page: 1, limit: 10, totalRecords: 0, totalPages: 1 },
        }),
    } as unknown as GetCoachingHistoryUseCase;

    getDetailUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          relationshipId: 'rel_100',
          status: CoachingRelationshipStatus.ACTIVE,
        }),
    } as unknown as GetCoachingRelationshipUseCase;

    activateUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          relationshipId: 'rel_100',
          status: CoachingRelationshipStatus.ACTIVE,
        }),
    } as unknown as ActivateCoachingRelationshipUseCase;

    completeUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          relationshipId: 'rel_100',
          status: CoachingRelationshipStatus.COMPLETED,
        }),
    } as unknown as CompleteCoachingRelationshipUseCase;

    cancelUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({
          relationshipId: 'rel_100',
          status: CoachingRelationshipStatus.CANCELLED,
        }),
    } as unknown as CancelCoachingRelationshipUseCase;

    controller = new CoachingRelationshipController(
      listUseCase,
      getActiveUseCase,
      getHistoryUseCase,
      getDetailUseCase,
      activateUseCase,
      completeUseCase,
      cancelUseCase,
    );

    mockRes = {
      status: vi.fn().mockImplementation((code: number) => {
        statusCode = code;
        return mockRes;
      }),
      json: vi.fn().mockImplementation((data: any) => {
        responseData = data;
        return mockRes;
      }),
    };
  });

  describe('listCoachingRelationships', () => {
    it('should return 200 with paginated coaching relationships', async () => {
      mockReq = {
        user: { id: 'usr_client_01', role: 'CLIENT' },
        query: { page: '1', limit: '10' },
      } as any;

      await controller.listCoachingRelationships(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.pagination).toBeDefined();
    });
  });

  describe('getActiveCoachingRelationship', () => {
    it('should return 200 with active relationship in an array', async () => {
      mockReq = {
        user: { id: 'usr_client_01', role: 'CLIENT' },
      } as any;

      await controller.getActiveCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.relationships.length).toBe(1);
    });
  });

  describe('getCoachingRelationship', () => {
    it('should return 200 with relationship details', async () => {
      mockReq = {
        user: { id: 'usr_client_01', role: 'CLIENT' },
        params: { relationshipId: 'rel_100' },
      } as any;

      await controller.getCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.relationshipId).toBe('rel_100');
    });

    it('should return 404 when relationship not found', async () => {
      (getDetailUseCase.execute as any).mockRejectedValue(
        new CoachingRelationshipNotFoundException('rel_999'),
      );

      mockReq = {
        user: { id: 'usr_client_01', role: 'CLIENT' },
        params: { relationshipId: 'rel_999' },
      } as any;

      await controller.getCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(404);
      expect(responseData.success).toBe(false);
    });

    it('should return 403 when access is forbidden', async () => {
      (getDetailUseCase.execute as any).mockRejectedValue(
        new UnauthorizedCoachingActionException('view', 'Forbidden'),
      );

      mockReq = {
        user: { id: 'usr_unrelated', role: 'CLIENT' },
        params: { relationshipId: 'rel_100' },
      } as any;

      await controller.getCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(403);
      expect(responseData.success).toBe(false);
    });
  });

  describe('completeCoachingRelationship', () => {
    it('should return 200 when completed successfully', async () => {
      mockReq = {
        user: { id: 'usr_trainer_01', role: 'TRAINER' },
        params: { relationshipId: 'rel_100' },
      } as any;

      await controller.completeCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.status).toBe(CoachingRelationshipStatus.COMPLETED);
    });

    it('should return 409 when transition is invalid', async () => {
      (completeUseCase.execute as any).mockRejectedValue(
        new InvalidCoachingTransitionException('COMPLETED', 'COMPLETED'),
      );

      mockReq = {
        user: { id: 'usr_trainer_01', role: 'TRAINER' },
        params: { relationshipId: 'rel_100' },
      } as any;

      await controller.completeCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(409);
      expect(responseData.success).toBe(false);
    });
  });

  describe('cancelCoachingRelationship', () => {
    it('should return 200 when cancelled with valid reason', async () => {
      mockReq = {
        user: { id: 'usr_trainer_01', role: 'TRAINER' },
        params: { relationshipId: 'rel_100' },
        body: { reason: 'Client requested termination' },
      } as any;

      await controller.cancelCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.status).toBe(CoachingRelationshipStatus.CANCELLED);
    });

    it('should return 400 when reason is missing', async () => {
      mockReq = {
        user: { id: 'usr_trainer_01', role: 'TRAINER' },
        params: { relationshipId: 'rel_100' },
        body: { reason: '' },
      } as any;

      await controller.cancelCoachingRelationship(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(400);
      expect(responseData.success).toBe(false);
    });
  });
});
