import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { NutritionPlanController } from '../../../../src/modules/nutrition/presentation/controllers/nutrition-plan.controller';
import { CreateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan.use-case';
import { UpdateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/update-nutrition-plan.use-case';
import { CreateNutritionPlanVersionUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/create-nutrition-plan-version.use-case';
import { ActivateNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/activate-nutrition-plan.use-case';
import { CompleteNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/complete-nutrition-plan.use-case';
import { DeleteDraftNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/delete-draft-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/get-nutrition-plan.use-case';
import { GetActiveNutritionPlanUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/get-active-nutrition-plan.use-case';
import { ListNutritionPlansUseCase } from '../../../../src/modules/nutrition/application/use-cases/plan/list-nutrition-plans.use-case';
import {
  ActiveNutritionPlanAlreadyExistsException,
  ActiveNutritionPlanImmutableException,
  NutritionConcurrencyConflictException,
  NutritionPlanNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';
import { NutritionPlanStatus } from '../../../../src/modules/nutrition/domain/enums';

describe('NutritionPlanController Unit Tests', () => {
  let createPlanUseCase: CreateNutritionPlanUseCase;
  let updatePlanUseCase: UpdateNutritionPlanUseCase;
  let createVersionUseCase: CreateNutritionPlanVersionUseCase;
  let activatePlanUseCase: ActivateNutritionPlanUseCase;
  let completePlanUseCase: CompleteNutritionPlanUseCase;
  let deleteDraftUseCase: DeleteDraftNutritionPlanUseCase;
  let getPlanUseCase: GetNutritionPlanUseCase;
  let getActivePlanUseCase: GetActiveNutritionPlanUseCase;
  let listPlansUseCase: ListNutritionPlansUseCase;
  let submitPlanUseCase: any;
  let recallPlanUseCase: any;
  let acceptPlanUseCase: any;
  let rejectPlanUseCase: any;
  let requestDeletionUseCase: any;
  let acceptDeletionUseCase: any;
  let rejectDeletionUseCase: any;
  let getPendingPlanUseCase: any;
  let controller: NutritionPlanController;

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let responseData: any;
  let statusCode: number;

  const samplePlanDto = {
    id: 'plan_123',
    coachingRelationshipId: 'rel_123',
    trainerId: 'trainer_123',
    clientId: 'client_123',
    version: 1,
    title: 'Fat Loss Plan',
    durationWeeks: 4,
    nutritionDays: [],
    status: NutritionPlanStatus.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    createPlanUseCase = {
      execute: vi.fn().mockResolvedValue(samplePlanDto),
    } as unknown as CreateNutritionPlanUseCase;

    updatePlanUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, title: 'Updated Plan' }),
    } as unknown as UpdateNutritionPlanUseCase;

    createVersionUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, version: 2 }),
    } as unknown as CreateNutritionPlanVersionUseCase;

    activatePlanUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.ACTIVE }),
    } as unknown as ActivateNutritionPlanUseCase;

    completePlanUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.COMPLETED }),
    } as unknown as CompleteNutritionPlanUseCase;

    deleteDraftUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    } as unknown as DeleteDraftNutritionPlanUseCase;

    getPlanUseCase = {
      execute: vi.fn().mockResolvedValue(samplePlanDto),
    } as unknown as GetNutritionPlanUseCase;

    listPlansUseCase = {
      execute: vi.fn().mockResolvedValue([samplePlanDto]),
    } as unknown as ListNutritionPlansUseCase;

    getActivePlanUseCase = {
      execute: vi.fn().mockResolvedValue(samplePlanDto),
    } as unknown as GetActiveNutritionPlanUseCase;

    submitPlanUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.PENDING_APPROVAL }),
    };

    recallPlanUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.DRAFT }),
    };

    acceptPlanUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.ACTIVE }),
    };

    rejectPlanUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.DRAFT }),
    };

    requestDeletionUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.DELETION_PENDING }),
    };

    acceptDeletionUseCase = {
      execute: vi
        .fn()
        .mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.CANCELLED }),
    };

    rejectDeletionUseCase = {
      execute: vi.fn().mockResolvedValue({ ...samplePlanDto, status: NutritionPlanStatus.ACTIVE }),
    };

    getPendingPlanUseCase = {
      execute: vi.fn().mockResolvedValue(samplePlanDto),
    };

    controller = new NutritionPlanController(
      createPlanUseCase,
      updatePlanUseCase,
      createVersionUseCase,
      activatePlanUseCase,
      completePlanUseCase,
      deleteDraftUseCase,
      getPlanUseCase,
      getActivePlanUseCase,
      listPlansUseCase,
      submitPlanUseCase,
      recallPlanUseCase,
      acceptPlanUseCase,
      rejectPlanUseCase,
      requestDeletionUseCase,
      acceptDeletionUseCase,
      rejectDeletionUseCase,
      getPendingPlanUseCase,
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

  describe('createPlan', () => {
    it('should return 201 with created plan for authenticated trainer', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        body: {
          coachingRelationshipId: 'rel_123',
          title: 'Fat Loss Plan',
          durationWeeks: 4,
          nutritionDays: [],
        },
      } as any;

      await controller.createPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data.id).toBe('plan_123');
      expect(createPlanUseCase.execute).toHaveBeenCalledWith(mockReq.body, 'trainer_123');
    });

    it('should return 403 when trainer is unauthorized', async () => {
      (createPlanUseCase.execute as any).mockRejectedValue(
        new UnauthorizedNutritionActionException('create', 'Not your relationship'),
      );

      mockReq = {
        auth: { id: 'trainer_impostor', role: 'TRAINER' },
        body: { coachingRelationshipId: 'rel_123' },
      } as any;

      await controller.createPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(403);
      expect(responseData.success).toBe(false);
    });
  });

  describe('updatePlan', () => {
    it('should return 200 with updated plan for authenticated trainer', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
        body: { title: 'Updated Plan' },
      } as any;

      await controller.updatePlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.title).toBe('Updated Plan');
      expect(updatePlanUseCase.execute).toHaveBeenCalledWith(
        { planId: 'plan_123', title: 'Updated Plan' },
        'trainer_123',
      );
    });

    it('should return 422 when attempting to update an active plan', async () => {
      (updatePlanUseCase.execute as any).mockRejectedValue(
        new ActiveNutritionPlanImmutableException('plan_123'),
      );

      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
        body: { title: 'Illegal Edit' },
      } as any;

      await controller.updatePlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(422);
      expect(responseData.success).toBe(false);
    });
  });

  describe('createVersion', () => {
    it('should return 201 with new version', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
        body: { title: 'Version 2' },
      } as any;

      await controller.createVersion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data.version).toBe(2);
      expect(createVersionUseCase.execute).toHaveBeenCalledWith(
        { planId: 'plan_123', title: 'Version 2' },
        'trainer_123',
      );
    });

    it('should return 409 when concurrent version creation causes duplicate key conflict', async () => {
      (createVersionUseCase.execute as any).mockRejectedValue(
        new NutritionConcurrencyConflictException('plan_123'),
      );

      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.createVersion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(409);
      expect(responseData.success).toBe(false);
    });
  });

  describe('activatePlan', () => {
    it('should return 200 with activated plan', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.activatePlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.status).toBe(NutritionPlanStatus.ACTIVE);
      expect(activatePlanUseCase.execute).toHaveBeenCalledWith('plan_123', 'trainer_123');
    });

    it('should return 409 if another active plan conflict is raised', async () => {
      (activatePlanUseCase.execute as any).mockRejectedValue(
        new ActiveNutritionPlanAlreadyExistsException('rel_123', 'existing_active'),
      );

      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.activatePlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(409);
      expect(responseData.success).toBe(false);
    });
  });

  describe('completePlan', () => {
    it('should return 200 with completed plan', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.completePlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.status).toBe(NutritionPlanStatus.COMPLETED);
    });
  });

  describe('deleteDraft', () => {
    it('should return 200 when draft plan is deleted', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.deleteDraft(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(deleteDraftUseCase.execute).toHaveBeenCalledWith('plan_123', 'trainer_123');
    });

    it('should return 422 when attempting to delete an active plan', async () => {
      (deleteDraftUseCase.execute as any).mockRejectedValue(
        new ActiveNutritionPlanImmutableException('plan_123'),
      );

      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.deleteDraft(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(422);
      expect(responseData.success).toBe(false);
    });
  });

  describe('getPlan & listPlans', () => {
    it('should return 200 with plan details', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        params: { planId: 'plan_123' },
      } as any;

      await controller.getPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.id).toBe('plan_123');
    });

    it('should return 404 when plan not found', async () => {
      (getPlanUseCase.execute as any).mockRejectedValue(
        new NutritionPlanNotFoundException('plan_missing'),
      );

      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        params: { planId: 'plan_missing' },
      } as any;

      await controller.getPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(404);
      expect(responseData.success).toBe(false);
    });

    it('should return 200 with assigned active plan for client', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
      } as any;

      await controller.getAssignedPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.id).toBe('plan_123');
      expect(getActivePlanUseCase.execute).toHaveBeenCalledWith('client_123');
    });

    it('should return 200 with pending plan proposal for relationship', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { relationshipId: 'rel_123' },
      } as any;

      await controller.getPendingPlan(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.id).toBe('plan_123');
      expect(getPendingPlanUseCase.execute).toHaveBeenCalledWith('trainer_123', 'rel_123');
    });

    it('should return 200 with pending plan proposal for authenticated client', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
      } as any;

      await controller.getPendingPlanForClient(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.id).toBe('plan_123');
      expect(getPendingPlanUseCase.execute).toHaveBeenCalledWith('client_123');
    });
  });
});
