import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { nutritionPlanApi } from '../../infrastructure/api/nutritionPlanApi';
import { nutritionCompletionApi } from '../../infrastructure/api/nutritionCompletionApi';
import { NutritionPlanStatus, NutritionCompletionStatus } from '../../domain/types/nutrition.types';

vi.mock('../../infrastructure/api/nutritionPlanApi', () => ({
  nutritionPlanApi: {
    list: vi.fn(),
    getById: vi.fn(),
    getActive: vi.fn(),
    create: vi.fn(),
    createVersion: vi.fn(),
    activate: vi.fn(),
    complete: vi.fn(),
    deleteDraft: vi.fn(),
  },
}));

vi.mock('../../infrastructure/api/nutritionCompletionApi', () => ({
  nutritionCompletionApi: {
    list: vi.fn(),
    getById: vi.fn(),
    start: vi.fn(),
    updateExecution: vi.fn(),
    complete: vi.fn(),
  },
}));

describe('NutritionRepository Implementation Tests', () => {
  let repository: NutritionRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new NutritionRepository();
  });

  it('delegates listPlans and getPlan to nutritionPlanApi', async () => {
    (nutritionPlanApi.list as ReturnType<typeof vi.fn>).mockResolvedValue({ plans: [], total: 0 });
    await repository.listPlans({ status: NutritionPlanStatus.DRAFT });
    expect(nutritionPlanApi.list).toHaveBeenCalledWith({ status: NutritionPlanStatus.DRAFT });

    (nutritionPlanApi.getById as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'np_1' });
    const plan = await repository.getPlan('np_1');
    expect(nutritionPlanApi.getById).toHaveBeenCalledWith('np_1');
    expect(plan.id).toBe('np_1');
  });

  it('delegates getActivePlan to nutritionPlanApi.getActive', async () => {
    (nutritionPlanApi.getActive as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'np_active' });
    const plan = await repository.getActivePlan('cr_100');
    expect(nutritionPlanApi.getActive).toHaveBeenCalledWith('cr_100');
    expect(plan?.id).toBe('np_active');
  });

  it('delegates plan mutations (create, createVersion, activate, complete, deleteDraft)', async () => {
    (nutritionPlanApi.create as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'np_new' });
    await repository.createPlan({
      coachingRelationshipId: 'cr_1',
      title: 'T',
      durationWeeks: 4,
      nutritionDays: [],
    });
    expect(nutritionPlanApi.create).toHaveBeenCalled();

    (nutritionPlanApi.createVersion as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'np_v2' });
    await repository.createVersion('np_1', { title: 'V2' });
    expect(nutritionPlanApi.createVersion).toHaveBeenCalledWith('np_1', { title: 'V2' });

    (nutritionPlanApi.activate as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'np_1',
      status: NutritionPlanStatus.ACTIVE,
    });
    await repository.activatePlan('np_1');
    expect(nutritionPlanApi.activate).toHaveBeenCalledWith('np_1');

    (nutritionPlanApi.complete as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'np_1',
      status: NutritionPlanStatus.COMPLETED,
    });
    await repository.completePlan('np_1');
    expect(nutritionPlanApi.complete).toHaveBeenCalledWith('np_1');

    (nutritionPlanApi.deleteDraft as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    await repository.deleteDraftPlan('np_1');
    expect(nutritionPlanApi.deleteDraft).toHaveBeenCalledWith('np_1');
  });

  it('delegates completion operations to nutritionCompletionApi', async () => {
    (nutritionCompletionApi.list as ReturnType<typeof vi.fn>).mockResolvedValue({
      completions: [],
      total: 0,
    });
    await repository.listCompletions();
    expect(nutritionCompletionApi.list).toHaveBeenCalled();

    (nutritionCompletionApi.getById as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'nc_1' });
    await repository.getCompletion('nc_1');
    expect(nutritionCompletionApi.getById).toHaveBeenCalledWith('nc_1');

    (nutritionCompletionApi.start as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 'nc_1' });
    await repository.startCompletion({ nutritionPlanId: 'np_1', dayNumber: 1 });
    expect(nutritionCompletionApi.start).toHaveBeenCalledWith({
      nutritionPlanId: 'np_1',
      dayNumber: 1,
    });

    (nutritionCompletionApi.updateExecution as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'nc_1',
    });
    await repository.updateExecution('nc_1', { hydrationSummary: { loggedMl: 1000 } });
    expect(nutritionCompletionApi.updateExecution).toHaveBeenCalledWith('nc_1', {
      hydrationSummary: { loggedMl: 1000 },
    });

    (nutritionCompletionApi.complete as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'nc_1',
      status: NutritionCompletionStatus.COMPLETED,
    });
    await repository.completeCompletion('nc_1', { feedback: { rating: 5 } });
    expect(nutritionCompletionApi.complete).toHaveBeenCalledWith('nc_1', {
      feedback: { rating: 5 },
    });
  });
});
