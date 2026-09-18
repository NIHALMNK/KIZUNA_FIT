import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { NutritionCompletionController } from '../../../../src/modules/nutrition/presentation/controllers/nutrition-completion.controller';
import { StartNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/start-nutrition-completion.use-case';
import { UpdateNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/update-nutrition-completion.use-case';
import { CompleteNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/complete-nutrition-completion.use-case';
import { GetNutritionCompletionUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/get-nutrition-completion.use-case';
import { ListNutritionCompletionsUseCase } from '../../../../src/modules/nutrition/application/use-cases/completion/list-nutrition-completions.use-case';
import {
  DuplicateNutritionCompletionException,
  NutritionCompletionImmutableException,
  NutritionCompletionNotFoundException,
  UnauthorizedNutritionActionException,
} from '../../../../src/modules/nutrition/domain/exceptions/nutrition-domain.exceptions';
import {
  MealCompletionStatus,
  MealType,
  NutritionCompletionStatus,
} from '../../../../src/modules/nutrition/domain/enums';

describe('NutritionCompletionController Unit Tests', () => {
  let startUseCase: StartNutritionCompletionUseCase;
  let updateUseCase: UpdateNutritionCompletionUseCase;
  let completeUseCase: CompleteNutritionCompletionUseCase;
  let getUseCase: GetNutritionCompletionUseCase;
  let listUseCase: ListNutritionCompletionsUseCase;
  let controller: NutritionCompletionController;

  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let responseData: any;
  let statusCode: number;

  const sampleCompletionDto = {
    id: 'comp_123',
    coachingRelationshipId: 'rel_123',
    nutritionPlanId: 'plan_123',
    clientId: 'client_123',
    trainerId: 'trainer_123',
    dayNumber: 1,
    nutritionDaySnapshot: {
      dayNumber: 1,
      name: 'Day 1',
      targetCalories: 2200,
      dailyMacroTargets: { calories: 2200, protein: 180, carbohydrates: 220, fats: 70 },
      hydrationGoal: { targetMl: 3000 },
      meals: [],
    },
    mealCompletions: [],
    status: NutritionCompletionStatus.IN_PROGRESS,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    startUseCase = {
      execute: vi.fn().mockResolvedValue(sampleCompletionDto),
    } as unknown as StartNutritionCompletionUseCase;

    updateUseCase = {
      execute: vi.fn().mockResolvedValue(sampleCompletionDto),
    } as unknown as UpdateNutritionCompletionUseCase;

    completeUseCase = {
      execute: vi.fn().mockResolvedValue({
        ...sampleCompletionDto,
        status: NutritionCompletionStatus.COMPLETED,
        completedAt: new Date().toISOString(),
      }),
    } as unknown as CompleteNutritionCompletionUseCase;

    getUseCase = {
      execute: vi.fn().mockResolvedValue(sampleCompletionDto),
    } as unknown as GetNutritionCompletionUseCase;

    listUseCase = {
      execute: vi.fn().mockResolvedValue([sampleCompletionDto]),
    } as unknown as ListNutritionCompletionsUseCase;

    controller = new NutritionCompletionController(
      startUseCase,
      updateUseCase,
      completeUseCase,
      getUseCase,
      listUseCase,
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

  describe('startCompletion', () => {
    it('should return 201 when client starts day completion', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        body: { nutritionPlanId: 'plan_123', dayNumber: 1 },
      } as any;

      await controller.startCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.data.id).toBe('comp_123');
      expect(startUseCase.execute).toHaveBeenCalledWith(
        { nutritionPlanId: 'plan_123', dayNumber: 1 },
        'client_123',
      );
    });

    it('should return 409 on duplicate completion start race', async () => {
      (startUseCase.execute as any).mockRejectedValue(
        new DuplicateNutritionCompletionException('plan_123', 1),
      );

      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        body: { nutritionPlanId: 'plan_123', dayNumber: 1 },
      } as any;

      await controller.startCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(409);
      expect(responseData.success).toBe(false);
    });
  });

  describe('updateCompletion', () => {
    it('should return 200 when client updates meal completion log', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        params: { completionId: 'comp_123' },
        body: {
          mealCompletions: [
            {
              mealId: 'm_1',
              mealType: MealType.BREAKFAST,
              name: 'Oats',
              isCompleted: true,
              state: MealCompletionStatus.COMPLETED,
            },
          ],
        },
      } as any;

      await controller.updateCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(updateUseCase.execute).toHaveBeenCalledWith('comp_123', mockReq.body, 'client_123');
    });

    it('should return 422 when attempting to update finalized completion', async () => {
      (updateUseCase.execute as any).mockRejectedValue(
        new NutritionCompletionImmutableException('comp_123', 'COMPLETED'),
      );

      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        params: { completionId: 'comp_123' },
        body: {},
      } as any;

      await controller.updateCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(422);
      expect(responseData.success).toBe(false);
    });
  });

  describe('completeCompletion', () => {
    it('should return 200 when day is completed', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        params: { completionId: 'comp_123' },
        body: {},
      } as any;

      await controller.completeCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.status).toBe(NutritionCompletionStatus.COMPLETED);
      expect(completeUseCase.execute).toHaveBeenCalledWith('comp_123', 'client_123', mockReq.body);
    });
  });

  describe('getCompletion & listCompletions', () => {
    it('should return 200 with completion details', async () => {
      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { completionId: 'comp_123' },
      } as any;

      await controller.getCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.id).toBe('comp_123');
    });

    it('should return 404 when completion not found', async () => {
      (getUseCase.execute as any).mockRejectedValue(
        new NutritionCompletionNotFoundException('comp_missing'),
      );

      mockReq = {
        auth: { id: 'trainer_123', role: 'TRAINER' },
        params: { completionId: 'comp_missing' },
      } as any;

      await controller.getCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(404);
      expect(responseData.success).toBe(false);
    });

    it('should return 403 when user is unauthorized to view completion', async () => {
      (getUseCase.execute as any).mockRejectedValue(
        new UnauthorizedNutritionActionException('view', 'Forbidden'),
      );

      mockReq = {
        auth: { id: 'client_impostor', role: 'CLIENT' },
        params: { completionId: 'comp_123' },
      } as any;

      await controller.getCompletion(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(403);
      expect(responseData.success).toBe(false);
    });

    it('should return 200 with list of completions', async () => {
      mockReq = {
        auth: { id: 'client_123', role: 'CLIENT' },
        query: { coachingRelationshipId: 'rel_123' },
      } as any;

      await controller.listCompletions(mockReq as Request, mockRes as Response);

      expect(statusCode).toBe(200);
      expect(responseData.data.length).toBe(1);
      expect(listUseCase.execute).toHaveBeenCalledWith('rel_123', 'client_123', 50, 0);
    });
  });
});
