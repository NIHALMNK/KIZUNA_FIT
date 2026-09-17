import { describe, it, expect, vi } from 'vitest';
import { registerNutritionRealtimeRules } from '../../infrastructure/realtime/nutritionRealtimeBridge';
import { NUTRITION_QUERY_KEYS } from '../../application/queryKeys';

describe('Frontend Nutrition Realtime Bridge Tests', () => {
  it('registers all 13 nutrition event rules on the RealtimeQueryBridge', () => {
    const rules: Record<string, Function> = {};
    const mockBridge: any = {
      registerRule: vi.fn((type: string, handler: Function) => {
        rules[type] = handler;
        return vi.fn();
      }),
    };

    const cleanup = registerNutritionRealtimeRules(mockBridge);

    expect(mockBridge.registerRule).toHaveBeenCalledTimes(13);
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_created',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_activated',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_completed',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_submitted',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_recalled',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_accepted',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_rejected',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_deletion_requested',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_deletion_accepted',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:plan_deletion_rejected',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:completion_started',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:completion_updated',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'nutrition:completed',
      expect.any(Function),
    );

    // Test plan_activated rule invalidations
    const planKeys = rules['nutrition:plan_activated']({
      payload: { nutritionPlanId: 'np_100', coachingRelationshipId: 'cr_100' },
    });
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.all);
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.plans.all);
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.plans.detail('np_100'));
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.plans.active('cr_100'));
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.plans.pending('cr_100'));
    expect(planKeys).toContainEqual(NUTRITION_QUERY_KEYS.plans.active(undefined));
    expect(planKeys).toContainEqual(['client-dashboard']);
    expect(planKeys).toContainEqual(['client-dashboard', 'active-nutrition']);

    // Test completed rule invalidations
    const completionKeys = rules['nutrition:completed']({
      payload: { completionId: 'nc_200' },
    });
    expect(completionKeys).toContainEqual(NUTRITION_QUERY_KEYS.all);
    expect(completionKeys).toContainEqual(NUTRITION_QUERY_KEYS.completions.all);
    expect(completionKeys).toContainEqual(NUTRITION_QUERY_KEYS.completions.detail('nc_200'));

    cleanup();
  });

  it('unsubscribes all listeners when cleanup function is invoked', () => {
    const unsubs = Array.from({ length: 13 }, () => vi.fn());

    let callCount = 0;
    const mockBridge: any = {
      registerRule: vi.fn(() => unsubs[callCount++]),
    };

    const cleanup = registerNutritionRealtimeRules(mockBridge);
    cleanup();

    unsubs.forEach((unsub) => {
      expect(unsub).toHaveBeenCalledTimes(1);
    });
  });
});
