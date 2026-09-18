import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nutritionPlanApi } from '../../infrastructure/api/nutritionPlanApi';
import { nutritionCompletionApi } from '../../infrastructure/api/nutritionCompletionApi';
import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  NutritionPlanStatus,
  NutritionCompletionStatus,
  MealType,
  MealCompletionStatus,
} from '../../domain/types/nutrition.types';

vi.mock('../../../../infrastructure/api/HttpClient', () => ({
  httpClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Nutrition API Adapters Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('nutritionPlanApi', () => {
    const samplePlan = {
      id: 'np_100',
      coachingRelationshipId: 'cr_100',
      trainerId: 'usr_trainer_1',
      clientId: 'usr_client_1',
      version: 1,
      title: 'Hypertrophy Meal Plan',
      durationWeeks: 4,
      status: NutritionPlanStatus.ACTIVE,
      nutritionDays: [
        {
          id: 'nd_1',
          dayNumber: 1,
          name: 'High Carb Training Day',
          targetCalories: 2500,
          dailyMacroTargets: { calories: 2500, protein: 180, carbohydrates: 300, fats: 65 },
          hydrationGoal: { targetMl: 3500 },
          meals: [
            {
              id: 'm_1',
              mealType: MealType.BREAKFAST,
              name: 'Power Breakfast',
              targetCalories: 600,
              foodEntries: [
                {
                  name: 'Oats',
                  quantity: 100,
                  unit: 'g',
                  calories: 380,
                  protein: 13,
                  carbohydrates: 68,
                  fats: 7,
                },
              ],
            },
          ],
        },
      ],
      createdAt: '2026-09-01T00:00:00.000Z',
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    it('list() invokes GET /nutrition-plans with params and unwraps response', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([samplePlan]);

      const result = await nutritionPlanApi.list({ status: NutritionPlanStatus.ACTIVE });

      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-plans', {
        params: { status: NutritionPlanStatus.ACTIVE },
      });
      expect(result.plans).toHaveLength(1);
      expect(result.plans[0].id).toBe('np_100');
      expect(result.total).toBe(1);
    });

    it('getById() invokes GET /nutrition-plans/:planId', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const result = await nutritionPlanApi.getById('np_100');
      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-plans/np_100');
      expect(result.title).toBe('Hypertrophy Meal Plan');
    });

    it('getActive() without coachingRelationshipId queries canonical GET /nutrition-plans/assigned', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const result = await nutritionPlanApi.getActive();
      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-plans/assigned');
      expect(result?.id).toBe('np_100');
    });

    it('getActive() with coachingRelationshipId queries GET /nutrition-plans with status=ACTIVE and limit=1', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([samplePlan]);

      const result = await nutritionPlanApi.getActive('cr_100');
      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-plans', {
        params: {
          status: NutritionPlanStatus.ACTIVE,
          coachingRelationshipId: 'cr_100',
          limit: 1,
        },
      });
      expect(result?.id).toBe('np_100');
    });

    it('create() invokes POST /nutrition-plans with payload', async () => {
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const payload = {
        coachingRelationshipId: 'cr_100',
        title: 'Hypertrophy Meal Plan',
        durationWeeks: 4,
        nutritionDays: [],
      };

      const result = await nutritionPlanApi.create(payload);
      expect(httpClient.post).toHaveBeenCalledWith('/nutrition-plans', payload);
      expect(result.id).toBe('np_100');
    });

    it('createVersion() invokes POST /nutrition-plans/:planId/version', async () => {
      const versionDraft = {
        ...samplePlan,
        id: 'np_101',
        version: 2,
        status: NutritionPlanStatus.DRAFT,
      };
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(versionDraft);

      const result = await nutritionPlanApi.createVersion('np_100', { title: 'Hypertrophy v2' });
      expect(httpClient.post).toHaveBeenCalledWith('/nutrition-plans/np_100/version', {
        title: 'Hypertrophy v2',
      });
      expect(result.id).toBe('np_101');
      expect(result.version).toBe(2);
      expect(result.status).toBe(NutritionPlanStatus.DRAFT);
    });

    it('activate() invokes POST /nutrition-plans/:planId/activate', async () => {
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const result = await nutritionPlanApi.activate('np_100');
      expect(httpClient.post).toHaveBeenCalledWith('/nutrition-plans/np_100/activate');
      expect(result.status).toBe(NutritionPlanStatus.ACTIVE);
    });

    it('complete() invokes POST /nutrition-plans/:planId/complete', async () => {
      const completedPlan = { ...samplePlan, status: NutritionPlanStatus.COMPLETED };
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(completedPlan);

      const result = await nutritionPlanApi.complete('np_100');
      expect(httpClient.post).toHaveBeenCalledWith('/nutrition-plans/np_100/complete');
      expect(result.status).toBe(NutritionPlanStatus.COMPLETED);
    });

    it('deleteDraft() invokes DELETE /nutrition-plans/:planId', async () => {
      (httpClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue({});

      await nutritionPlanApi.deleteDraft('np_100');
      expect(httpClient.delete).toHaveBeenCalledWith('/nutrition-plans/np_100');
    });
  });

  describe('nutritionCompletionApi', () => {
    const sampleCompletion = {
      id: 'nc_200',
      coachingRelationshipId: 'cr_100',
      nutritionPlanId: 'np_100',
      clientId: 'usr_client_1',
      trainerId: 'usr_trainer_1',
      dayNumber: 1,
      nutritionDaySnapshot: {
        dayNumber: 1,
        name: 'High Carb Training Day',
        targetCalories: 2500,
        dailyMacroTargets: { calories: 2500, protein: 180, carbohydrates: 300, fats: 65 },
        hydrationGoal: { targetMl: 3500 },
        meals: [],
      },
      mealCompletions: [
        {
          mealId: 'm_1',
          mealType: MealType.BREAKFAST,
          name: 'Power Breakfast',
          isCompleted: true,
          state: MealCompletionStatus.COMPLETED,
          consumedItems: [],
          consumedCalories: 600,
          consumedMacros: { calories: 600, protein: 45, carbohydrates: 70, fats: 15 },
        },
      ],
      hydrationSummary: { loggedMl: 3000, targetMl: 3500 },
      macroSummary: { totalCalories: 600, protein: 45, carbohydrates: 70, fats: 15 },
      status: NutritionCompletionStatus.IN_PROGRESS,
      startedAt: '2026-09-02T08:00:00.000Z',
      createdAt: '2026-09-02T08:00:00.000Z',
      updatedAt: '2026-09-02T08:00:00.000Z',
    };

    it('list() invokes GET /nutrition-completions with params', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue([sampleCompletion]);

      const result = await nutritionCompletionApi.list({ clientId: 'usr_client_1' });
      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-completions', {
        params: { clientId: 'usr_client_1' },
      });
      expect(result.completions).toHaveLength(1);
      expect(result.completions[0].id).toBe('nc_200');
    });

    it('getById() invokes GET /nutrition-completions/:completionId', async () => {
      (httpClient.get as ReturnType<typeof vi.fn>).mockResolvedValue(sampleCompletion);

      const result = await nutritionCompletionApi.getById('nc_200');
      expect(httpClient.get).toHaveBeenCalledWith('/nutrition-completions/nc_200');
      expect(result.id).toBe('nc_200');
    });

    it('start() invokes POST /nutrition-completions with payload', async () => {
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(sampleCompletion);

      const payload = { nutritionPlanId: 'np_100', dayNumber: 1 };
      const result = await nutritionCompletionApi.start(payload);
      expect(httpClient.post).toHaveBeenCalledWith('/nutrition-completions', payload);
      expect(result.id).toBe('nc_200');
    });

    it('updateExecution() invokes PATCH /nutrition-completions/:completionId with payload', async () => {
      (httpClient.patch as ReturnType<typeof vi.fn>).mockResolvedValue(sampleCompletion);

      const payload = { hydrationSummary: { loggedMl: 3500, targetMl: 3500 } };
      const result = await nutritionCompletionApi.updateExecution('nc_200', payload);
      expect(httpClient.patch).toHaveBeenCalledWith('/nutrition-completions/nc_200', payload);
      expect(result.id).toBe('nc_200');
    });

    it('complete() invokes POST /nutrition-completions/:completionId/complete with payload', async () => {
      const completed = { ...sampleCompletion, status: NutritionCompletionStatus.COMPLETED };
      (httpClient.post as ReturnType<typeof vi.fn>).mockResolvedValue(completed);

      const payload = { feedback: { rating: 5, energyLevel: 4 } };
      const result = await nutritionCompletionApi.complete('nc_200', payload);
      expect(httpClient.post).toHaveBeenCalledWith(
        '/nutrition-completions/nc_200/complete',
        payload,
      );
      expect(result.status).toBe(NutritionCompletionStatus.COMPLETED);
    });
  });
});
