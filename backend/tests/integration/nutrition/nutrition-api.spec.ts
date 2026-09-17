import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { nutritionModuleRouter } from '../../../src/modules/nutrition/routes';
import {
  MealType,
  NutritionPlanStatus,
  NutritionCompletionStatus,
} from '../../../src/modules/nutrition/domain/enums';
import { env } from '../../../src/config/env.config';

describe('Nutrition API Endpoints (Integration/E2E)', () => {
  let app: Express;
  const testSecret = env.JWT_ACCESS_SECRET || 'test_jwt_secret_for_integration_testing_123';

  const clientToken = jwt.sign(
    { sub: '507f1f77bcf86cd799439012', role: 'CLIENT', jti: 'jti_client' },
    testSecret,
  );

  const trainerToken = jwt.sign(
    { sub: '507f1f77bcf86cd799439011', role: 'TRAINER', jti: 'jti_trainer' },
    testSecret,
  );

  const samplePlanDto = {
    id: 'plan_100',
    coachingRelationshipId: 'rel_100',
    trainerId: '507f1f77bcf86cd799439011',
    clientId: '507f1f77bcf86cd799439012',
    version: 1,
    title: 'High Protein Cut',
    durationWeeks: 4,
    nutritionDays: [
      {
        id: 'day_1',
        dayNumber: 1,
        name: 'Training Day',
        meals: [
          {
            id: 'meal_1',
            mealType: MealType.BREAKFAST,
            name: 'Oats & Eggs',
            foodEntries: [
              {
                name: 'Oats',
                quantity: 80,
                unit: 'g',
              },
            ],
          },
        ],
      },
    ],
    status: NutritionPlanStatus.DRAFT,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleCompletionDto = {
    id: 'comp_100',
    coachingRelationshipId: 'rel_100',
    nutritionPlanId: 'plan_100',
    clientId: '507f1f77bcf86cd799439012',
    trainerId: '507f1f77bcf86cd799439011',
    dayNumber: 1,
    nutritionDaySnapshot: {
      dayNumber: 1,
      name: 'Training Day',
      meals: [],
    },
    mealCompletions: [],
    status: NutritionCompletionStatus.IN_PROGRESS,
    startedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockPlanController = {
    createPlan: vi.fn(async (req, res) => {
      res.status(201).json({ success: true, data: samplePlanDto });
    }),
    getAssignedPlan: vi.fn(async (req, res) => {
      res
        .status(200)
        .json({ success: true, data: { ...samplePlanDto, status: NutritionPlanStatus.ACTIVE } });
    }),
    getPlan: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, data: samplePlanDto });
    }),
    listPlans: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, data: [samplePlanDto], meta: { total: 1 } });
    }),
    createVersion: vi.fn(async (req, res) => {
      res.status(201).json({
        success: true,
        data: { ...samplePlanDto, version: 2 },
        message: 'New nutrition plan version created.',
      });
    }),
    activatePlan: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { ...samplePlanDto, status: NutritionPlanStatus.ACTIVE },
        message: 'Nutrition plan activated.',
      });
    }),
    completePlan: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { ...samplePlanDto, status: NutritionPlanStatus.COMPLETED },
        message: 'Nutrition plan completed.',
      });
    }),
    deleteDraft: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, message: 'Draft nutrition plan deleted.' });
    }),
  };

  const mockCompletionController = {
    startCompletion: vi.fn(async (req, res) => {
      res.status(201).json({ success: true, data: sampleCompletionDto });
    }),
    getCompletion: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, data: sampleCompletionDto });
    }),
    listCompletions: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, data: [sampleCompletionDto], meta: { total: 1 } });
    }),
    updateCompletion: vi.fn(async (req, res) => {
      res.status(200).json({ success: true, data: sampleCompletionDto });
    }),
    completeCompletion: vi.fn(async (req, res) => {
      res.status(200).json({
        success: true,
        data: { ...sampleCompletionDto, status: NutritionCompletionStatus.COMPLETED },
        message: 'Nutrition day marked as completed!',
      });
    }),
  };

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Inject Awilix scope resolution middleware
    app.use((req, _res, next) => {
      (req as unknown as Record<string, unknown>).scope = {
        resolve: (name: string) => {
          if (name === 'nutritionPlanController') return mockPlanController;
          if (name === 'nutritionCompletionController') return mockCompletionController;
          throw new Error(`Unknown dependency: ${name}`);
        },
      };
      next();
    });

    app.use('/api/v1', nutritionModuleRouter());
  });

  // -------------------------------------------------------------
  // Nutrition Plan Endpoints
  // -------------------------------------------------------------
  describe('POST /api/v1/nutrition-plans', () => {
    it('should allow TRAINER to create plan with valid payload (201 Created)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({
          coachingRelationshipId: 'rel_100',
          title: 'High Protein Cut',
          durationWeeks: 4,
          nutritionDays: [
            {
              dayNumber: 1,
              meals: [
                {
                  mealType: MealType.BREAKFAST,
                  name: 'Oats & Eggs',
                },
              ],
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.createPlan).toHaveBeenCalled();
    });

    it('should reject CLIENT attempting to create plan (403 Forbidden)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          coachingRelationshipId: 'rel_100',
          title: 'Plan',
          durationWeeks: 4,
          nutritionDays: [{ dayNumber: 1, meals: [{ mealType: MealType.LUNCH, name: 'Lunch' }] }],
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should reject unauthenticated request (401 Unauthorized)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans')
        .send({ coachingRelationshipId: 'rel_100' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid durationWeeks outside 1..52 (400 Bad Request)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({
          coachingRelationshipId: 'rel_100',
          title: 'Invalid Plan',
          durationWeeks: 53,
          nutritionDays: [{ dayNumber: 1, meals: [{ mealType: MealType.LUNCH, name: 'Lunch' }] }],
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/nutrition-plans/:planId/version (Canonical versioning)', () => {
    it('should allow TRAINER to create new version via /version (201 Created)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans/plan_100/version')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ title: 'High Protein Cut v2' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.createVersion).toHaveBeenCalled();
    });

    it('should return 404 for removed legacy /duplicate endpoint', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans/plan_100/duplicate')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ title: 'High Protein Cut v2' });

      expect(response.status).toBe(404);
    });

    it('should reject CLIENT from creating plan versions (403 Forbidden)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans/plan_100/version')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ title: 'Version by Client' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/nutrition-plans/assigned', () => {
    it('should allow CLIENT to retrieve assigned active plan (200 OK)', async () => {
      const response = await request(app)
        .get('/api/v1/nutrition-plans/assigned')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(NutritionPlanStatus.ACTIVE);
      expect(mockPlanController.getAssignedPlan).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/nutrition-plans/:planId/activate', () => {
    it('should allow TRAINER to activate plan (200 OK)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans/plan_100/activate')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.activatePlan).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/nutrition-plans/:planId/complete', () => {
    it('should allow TRAINER to complete plan (200 OK)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-plans/plan_100/complete')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.completePlan).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/v1/nutrition-plans/:planId', () => {
    it('should allow TRAINER to delete draft plan (200 OK)', async () => {
      const response = await request(app)
        .delete('/api/v1/nutrition-plans/plan_100')
        .set('Authorization', `Bearer ${trainerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.deleteDraft).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/nutrition-plans/:planId', () => {
    it('should allow authenticated client or trainer to get plan (200 OK)', async () => {
      const response = await request(app)
        .get('/api/v1/nutrition-plans/plan_100')
        .set('Authorization', `Bearer ${clientToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockPlanController.getPlan).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------
  // Nutrition Completion Endpoints
  // -------------------------------------------------------------
  describe('POST /api/v1/nutrition-completions', () => {
    it('should allow CLIENT to start completion (201 Created)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-completions')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          nutritionPlanId: 'plan_100',
          dayNumber: 1,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(mockCompletionController.startCompletion).toHaveBeenCalled();
    });

    it('should reject TRAINER from starting client completion (403 Forbidden)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-completions')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({
          nutritionPlanId: 'plan_100',
          dayNumber: 1,
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/nutrition-completions/:completionId', () => {
    it('should allow CLIENT to update meal execution (200 OK)', async () => {
      const response = await request(app)
        .patch('/api/v1/nutrition-completions/comp_100')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({
          mealCompletions: [
            {
              mealId: 'm_1',
              mealType: MealType.BREAKFAST,
              name: 'Oats',
              isCompleted: true,
            },
          ],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockCompletionController.updateCompletion).toHaveBeenCalled();
    });
  });

  describe('POST /api/v1/nutrition-completions/:completionId/complete', () => {
    it('should allow CLIENT to finalize day completion (200 OK)', async () => {
      const response = await request(app)
        .post('/api/v1/nutrition-completions/comp_100/complete')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockCompletionController.completeCompletion).toHaveBeenCalled();
    });
  });

  describe('Architectural Constraints & Security Verification', () => {
    it('should return 404 for generic PATCH on /nutrition-plans/:planId (no generic plan mutation)', async () => {
      const response = await request(app)
        .patch('/api/v1/nutrition-plans/plan_100')
        .set('Authorization', `Bearer ${trainerToken}`)
        .send({ title: 'Mutated Title' });

      expect(response.status).toBe(404);
    });

    it('should reject requests to /nutrition-plans with invalid query parameters (400 Bad Request)', async () => {
      const response = await request(app)
        .get('/api/v1/nutrition-plans')
        .set('Authorization', `Bearer ${trainerToken}`)
        .query({ limit: 'not-a-number' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject requests to /nutrition-completions with invalid status filter (400 Bad Request)', async () => {
      const response = await request(app)
        .get('/api/v1/nutrition-completions')
        .set('Authorization', `Bearer ${clientToken}`)
        .query({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
