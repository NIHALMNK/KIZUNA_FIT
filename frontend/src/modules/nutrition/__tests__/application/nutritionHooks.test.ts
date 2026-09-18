import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { NUTRITION_QUERY_KEYS } from '../../application/queryKeys';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import {
  NutritionPlanStatus,
  NutritionCompletionStatus,
  MealType,
  MealCompletionStatus,
} from '../../domain/types/nutrition.types';

vi.mock('../../infrastructure/repositories/NutritionRepository', () => ({
  nutritionRepository: {
    listPlans: vi.fn(),
    getPlan: vi.fn(),
    getActivePlan: vi.fn(),
    createPlan: vi.fn(),
    createVersion: vi.fn(),
    activatePlan: vi.fn(),
    completePlan: vi.fn(),
    deleteDraftPlan: vi.fn(),
    listCompletions: vi.fn(),
    getCompletion: vi.fn(),
    startCompletion: vi.fn(),
    updateExecution: vi.fn(),
    completeCompletion: vi.fn(),
  },
}));

describe('Nutrition Application Layer & TanStack Query Hooks Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.spyOn(queryClient, 'invalidateQueries');
  });

  const samplePlan = {
    id: 'np_100',
    coachingRelationshipId: 'cr_100',
    trainerId: 'usr_trainer_1',
    clientId: 'usr_client_1',
    version: 1,
    title: 'Hypertrophy Meal Plan',
    durationWeeks: 4,
    status: NutritionPlanStatus.ACTIVE,
    nutritionDays: [],
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  const sampleCompletion = {
    id: 'nc_200',
    coachingRelationshipId: 'cr_100',
    nutritionPlanId: 'np_100',
    clientId: 'usr_client_1',
    trainerId: 'usr_trainer_1',
    dayNumber: 1,
    nutritionDaySnapshot: { dayNumber: 1, meals: [] },
    mealCompletions: [],
    status: NutritionCompletionStatus.IN_PROGRESS,
    startedAt: '2026-09-02T00:00:00.000Z',
    createdAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
  };

  describe('1. Centralized Query Key Hierarchy', () => {
    it('generates exact NUTRITION_QUERY_KEYS structure for plans', () => {
      expect(NUTRITION_QUERY_KEYS.all).toEqual(['nutrition']);
      expect(NUTRITION_QUERY_KEYS.plans.all).toEqual(['nutrition', 'plans']);
      expect(NUTRITION_QUERY_KEYS.plans.list({ coachingRelationshipId: 'cr_100' })).toEqual([
        'nutrition',
        'plans',
        'list',
        { coachingRelationshipId: 'cr_100' },
      ]);
      expect(NUTRITION_QUERY_KEYS.plans.detail('np_100')).toEqual([
        'nutrition',
        'plans',
        'detail',
        'np_100',
      ]);
      expect(NUTRITION_QUERY_KEYS.plans.active('cr_100')).toEqual([
        'nutrition',
        'plans',
        'active',
        'cr_100',
      ]);
      expect(NUTRITION_QUERY_KEYS.plans.active(undefined)).toEqual([
        'nutrition',
        'plans',
        'active',
        undefined,
      ]);
    });

    it('generates exact NUTRITION_QUERY_KEYS structure for completions', () => {
      expect(NUTRITION_QUERY_KEYS.completions.all).toEqual(['nutrition', 'completions']);
      expect(NUTRITION_QUERY_KEYS.completions.list({ clientId: 'usr_client_1' })).toEqual([
        'nutrition',
        'completions',
        'list',
        { clientId: 'usr_client_1' },
      ]);
      expect(NUTRITION_QUERY_KEYS.completions.detail('nc_200')).toEqual([
        'nutrition',
        'completions',
        'detail',
        'nc_200',
      ]);
    });
  });

  describe('2. Plan Queries Behavior & Resolution', () => {
    it('executes listPlans via queryFn with provided filter parameters', async () => {
      (nutritionRepository.listPlans as ReturnType<typeof vi.fn>).mockResolvedValue({
        plans: [samplePlan],
        total: 1,
      });

      const params = { status: NutritionPlanStatus.ACTIVE, coachingRelationshipId: 'cr_100' };
      const data = await queryClient.fetchQuery({
        queryKey: NUTRITION_QUERY_KEYS.plans.list(params),
        queryFn: () => nutritionRepository.listPlans(params),
      });

      expect(nutritionRepository.listPlans).toHaveBeenCalledWith(params);
      expect(data.plans).toHaveLength(1);
      expect(data.plans[0].id).toBe('np_100');
    });

    it('executes getPlan via queryFn when planId is provided', async () => {
      (nutritionRepository.getPlan as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const data = await queryClient.fetchQuery({
        queryKey: NUTRITION_QUERY_KEYS.plans.detail('np_100'),
        queryFn: () => nutritionRepository.getPlan('np_100'),
      });

      expect(nutritionRepository.getPlan).toHaveBeenCalledWith('np_100');
      expect(data.title).toBe('Hypertrophy Meal Plan');
    });

    it('executes getActivePlan via queryFn for coaching relationship', async () => {
      (nutritionRepository.getActivePlan as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const data = await queryClient.fetchQuery({
        queryKey: NUTRITION_QUERY_KEYS.plans.active('cr_100'),
        queryFn: () => nutritionRepository.getActivePlan('cr_100'),
      });

      expect(nutritionRepository.getActivePlan).toHaveBeenCalledWith('cr_100');
      expect(data?.status).toBe(NutritionPlanStatus.ACTIVE);
    });
  });

  describe('3. Completion Queries Behavior & Resolution', () => {
    it('executes listCompletions via queryFn with filter parameters', async () => {
      (nutritionRepository.listCompletions as ReturnType<typeof vi.fn>).mockResolvedValue({
        completions: [sampleCompletion],
        total: 1,
      });

      const params = { clientId: 'usr_client_1', limit: 20 };
      const data = await queryClient.fetchQuery({
        queryKey: NUTRITION_QUERY_KEYS.completions.list(params),
        queryFn: () => nutritionRepository.listCompletions(params),
      });

      expect(nutritionRepository.listCompletions).toHaveBeenCalledWith(params);
      expect(data.completions).toHaveLength(1);
      expect(data.completions[0].id).toBe('nc_200');
    });

    it('executes getCompletion via queryFn when completionId is provided', async () => {
      (nutritionRepository.getCompletion as ReturnType<typeof vi.fn>).mockResolvedValue(
        sampleCompletion,
      );

      const data = await queryClient.fetchQuery({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail('nc_200'),
        queryFn: () => nutritionRepository.getCompletion('nc_200'),
      });

      expect(nutritionRepository.getCompletion).toHaveBeenCalledWith('nc_200');
      expect(data.id).toBe('nc_200');
    });
  });

  describe('4. Plan Mutations & Targeted Cache Invalidation', () => {
    it('useCreateNutritionPlan triggers createPlan and invalidates plan queries', async () => {
      (nutritionRepository.createPlan as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const payload = {
        coachingRelationshipId: 'cr_100',
        title: 'New Plan',
        durationWeeks: 4,
        nutritionDays: [],
      };

      const result = await nutritionRepository.createPlan(payload);
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(result.id) });

      expect(nutritionRepository.createPlan).toHaveBeenCalledWith(payload);
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'detail', 'np_100'],
      });
    });

    it('useCreateNutritionPlanVersion triggers createVersion and invalidates plan queries', async () => {
      const v2Plan = { ...samplePlan, id: 'np_101', version: 2, status: NutritionPlanStatus.DRAFT };
      (nutritionRepository.createVersion as ReturnType<typeof vi.fn>).mockResolvedValue(v2Plan);

      const result = await nutritionRepository.createVersion('np_100', { title: 'V2' });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(result.id) });

      expect(nutritionRepository.createVersion).toHaveBeenCalledWith('np_100', { title: 'V2' });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'detail', 'np_101'],
      });
    });

    it('useActivateNutritionPlan activates plan and performs targeted cache invalidations', async () => {
      (nutritionRepository.activatePlan as ReturnType<typeof vi.fn>).mockResolvedValue(samplePlan);

      const result = await nutritionRepository.activatePlan('np_100');
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(result.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(result.id) });

      expect(nutritionRepository.activatePlan).toHaveBeenCalledWith('np_100');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'active', 'cr_100'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'detail', 'np_100'],
      });
    });

    it('useCompleteNutritionPlan completes plan and performs targeted cache invalidations', async () => {
      const completedPlan = { ...samplePlan, status: NutritionPlanStatus.COMPLETED };
      (nutritionRepository.completePlan as ReturnType<typeof vi.fn>).mockResolvedValue(
        completedPlan,
      );

      const result = await nutritionRepository.completePlan('np_100');
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(result.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(result.id) });

      expect(nutritionRepository.completePlan).toHaveBeenCalledWith('np_100');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'active', 'cr_100'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans', 'detail', 'np_100'],
      });
    });

    it('useDeleteDraftNutritionPlan deletes draft and invalidates plans cache', async () => {
      (nutritionRepository.deleteDraftPlan as ReturnType<typeof vi.fn>).mockResolvedValue(
        undefined,
      );

      await nutritionRepository.deleteDraftPlan('np_draft_1');
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });

      expect(nutritionRepository.deleteDraftPlan).toHaveBeenCalledWith('np_draft_1');
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'plans'],
      });
    });
  });

  describe('5. Completion Mutations & Targeted Cache Invalidation', () => {
    it('useStartNutritionCompletion starts daily session and invalidates completion list', async () => {
      (nutritionRepository.startCompletion as ReturnType<typeof vi.fn>).mockResolvedValue(
        sampleCompletion,
      );

      const payload = { nutritionPlanId: 'np_100', dayNumber: 1 };
      const result = await nutritionRepository.startCompletion(payload);
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(result.id),
      });

      expect(nutritionRepository.startCompletion).toHaveBeenCalledWith(payload);
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions', 'detail', 'nc_200'],
      });
    });

    it('useUpdateNutritionCompletion updates execution and invalidates completion detail and list', async () => {
      (nutritionRepository.updateExecution as ReturnType<typeof vi.fn>).mockResolvedValue(
        sampleCompletion,
      );

      const payload = { hydrationSummary: { loggedMl: 2500 } };
      const result = await nutritionRepository.updateExecution('nc_200', payload);
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(result.id),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });

      expect(nutritionRepository.updateExecution).toHaveBeenCalledWith('nc_200', payload);
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions', 'detail', 'nc_200'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions'],
      });
    });

    it('useCompleteNutritionCompletion finalizes completion and invalidates completion detail and list', async () => {
      const completed = {
        ...sampleCompletion,
        status: NutritionCompletionStatus.COMPLETED,
        completedAt: '2026-09-02T22:00:00.000Z',
      };
      (nutritionRepository.completeCompletion as ReturnType<typeof vi.fn>).mockResolvedValue(
        completed,
      );

      const payload = { feedback: { rating: 5, energyLevel: 4 } };
      const result = await nutritionRepository.completeCompletion('nc_200', payload);
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(result.id),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });

      expect(nutritionRepository.completeCompletion).toHaveBeenCalledWith('nc_200', payload);
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions', 'detail', 'nc_200'],
      });
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['nutrition', 'completions'],
      });
    });
  });
});
