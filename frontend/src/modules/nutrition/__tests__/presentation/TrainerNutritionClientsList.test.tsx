import { describe, it, expect } from 'vitest';
import { resolveClientPlanState } from '../../presentation/trainer/TrainerNutritionClientsList';
import { NutritionPlan, NutritionPlanStatus, Weekday } from '../../domain/types/nutrition.types';

const mockPlan = (id: string, version: number, status: NutritionPlanStatus): NutritionPlan => ({
  id,
  coachingRelationshipId: 'rel_1',
  trainerId: 'trainer_1',
  clientId: 'client_1',
  version,
  title: `Nutrition Plan v${version}`,
  durationWeeks: 4,
  nutritionDays: [
    {
      id: 'day_1',
      weekday: Weekday.MONDAY,
      dayNumber: 1,
      name: 'Monday',
      meals: [],
    },
  ],
  status,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('Trainer Nutrition Client Card State Resolution (Authoritative Business Rules)', () => {
  it('CASE 1: No plans -> No Plan / Create Plan', () => {
    const state = resolveClientPlanState([]);
    expect(state.hasNutritionHistory).toBe(false);
    expect(state.type).toBe('NO_PLAN');
    expect(state.statusLabel).toBe('No Plan');
    expect(state.actionLabel).toBe('Create Plan');
    expect(state.activePlan).toBeUndefined();
    expect(state.primaryPlan).toBeUndefined();
  });

  it('CASE 2: One ACTIVE plan -> Active Plan / View Plan', () => {
    const active = mockPlan('p_active', 1, NutritionPlanStatus.ACTIVE);
    const state = resolveClientPlanState([active]);
    expect(state.hasNutritionHistory).toBe(true);
    expect(state.type).toBe('ACTIVE');
    expect(state.statusLabel).toBe('Active Plan');
    expect(state.actionLabel).toBe('View Plan');
    expect(state.activePlan?.id).toBe('p_active');
    expect(state.primaryPlan?.id).toBe('p_active');
  });

  it('CASE 3: One COMPLETED plan -> Plan History / View Plan', () => {
    const completed = mockPlan('p_comp1', 1, NutritionPlanStatus.COMPLETED);
    const state = resolveClientPlanState([completed]);
    expect(state.hasNutritionHistory).toBe(true);
    expect(state.type).toBe('HISTORY_ONLY');
    expect(state.statusLabel).toBe('Plan History');
    expect(state.actionLabel).toBe('View Plan');
    expect(state.completedPlan?.id).toBe('p_comp1');
    expect(state.primaryPlan?.id).toBe('p_comp1');
  });

  it('CASE 4: One CANCELLED plan -> Plan History / View Plan', () => {
    const cancelled = mockPlan('p_canc1', 1, NutritionPlanStatus.CANCELLED);
    const state = resolveClientPlanState([cancelled]);
    expect(state.hasNutritionHistory).toBe(true);
    expect(state.type).toBe('HISTORY_ONLY');
    expect(state.statusLabel).toBe('Plan History');
    expect(state.actionLabel).toBe('View Plan');
    expect(state.completedPlan?.id).toBe('p_canc1');
    expect(state.primaryPlan?.id).toBe('p_canc1');
  });

  it('CASE 5: V1 ACTIVE + V2 PENDING_APPROVAL -> History exists / View Plan', () => {
    const activeV1 = mockPlan('p_v1', 1, NutritionPlanStatus.ACTIVE);
    const pendingV2 = mockPlan('p_v2', 2, NutritionPlanStatus.PENDING_APPROVAL);
    const state = resolveClientPlanState([activeV1, pendingV2]);
    expect(state.hasNutritionHistory).toBe(true);
    expect(state.type).toBe('ACTIVE');
    expect(state.statusLabel).toBe('Active Plan');
    expect(state.actionLabel).toBe('View Plan');
    expect(state.activePlan?.id).toBe('p_v1');
    expect(state.pendingPlan?.id).toBe('p_v2');
    expect(state.primaryPlan?.id).toBe('p_v1');
  });

  it('CASE 6: V1 CANCELLED + no active plan -> History exists / View Plan', () => {
    const cancelledV1 = mockPlan('p_v1', 1, NutritionPlanStatus.CANCELLED);
    const state = resolveClientPlanState([cancelledV1]);
    expect(state.hasNutritionHistory).toBe(true);
    expect(state.type).toBe('HISTORY_ONLY');
    expect(state.statusLabel).toBe('Plan History');
    expect(state.actionLabel).toBe('View Plan');
    expect(state.activePlan).toBeUndefined();
    expect(state.completedPlan?.id).toBe('p_v1');
  });

  it('CASE 7: After creating the first plan, client immediately transitions from Create Plan to View Plan', () => {
    // Initial state: 0 plans
    const initialState = resolveClientPlanState([]);
    expect(initialState.hasNutritionHistory).toBe(false);
    expect(initialState.actionLabel).toBe('Create Plan');
    expect(initialState.statusLabel).toBe('No Plan');

    // Mutated state: first plan created (e.g. as draft or active)
    const newPlan = mockPlan('p_new', 1, NutritionPlanStatus.DRAFT);
    const updatedState = resolveClientPlanState([newPlan]);
    expect(updatedState.hasNutritionHistory).toBe(true);
    expect(updatedState.actionLabel).toBe('View Plan');
    expect(updatedState.type).toBe('DRAFT');
    expect(updatedState.statusLabel).toBe('Draft');

    // If activated:
    const activePlan = mockPlan('p_new', 1, NutritionPlanStatus.ACTIVE);
    const activeState = resolveClientPlanState([activePlan]);
    expect(activeState.hasNutritionHistory).toBe(true);
    expect(activeState.actionLabel).toBe('View Plan');
    expect(activeState.statusLabel).toBe('Active Plan');
  });
});
