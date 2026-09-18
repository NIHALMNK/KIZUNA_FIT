import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { NUTRITION_QUERY_KEYS } from '../../application/queryKeys';

export interface NutritionRealtimePayload {
  nutritionPlanId?: string;
  planId?: string;
  completionId?: string;
  coachingRelationshipId?: string;
  clientId?: string;
  trainerId?: string;
}

export const registerNutritionRealtimeRules = (bridge: RealtimeQueryBridge): (() => void) => {
  const unsubs: (() => void)[] = [];

  const handlePlanEvent = (event: { payload?: NutritionRealtimePayload; entityId?: string }) => {
    const planId = event.payload?.nutritionPlanId || event.payload?.planId || event.entityId;
    const relId = event.payload?.coachingRelationshipId;
    const keys: (readonly unknown[])[] = [
      NUTRITION_QUERY_KEYS.all,
      NUTRITION_QUERY_KEYS.plans.all,
      NUTRITION_QUERY_KEYS.plans.active(relId),
      NUTRITION_QUERY_KEYS.plans.active(undefined),
      NUTRITION_QUERY_KEYS.plans.pending(undefined),
      ['client-dashboard'],
      ['client-dashboard', 'active-nutrition'],
    ];

    if (relId) {
      keys.push(NUTRITION_QUERY_KEYS.plans.pending(relId));
    }

    if (planId) {
      keys.push(NUTRITION_QUERY_KEYS.plans.detail(planId));
    }

    return keys;
  };

  const handleCompletionEvent = (event: {
    payload?: NutritionRealtimePayload;
    entityId?: string;
  }) => {
    const completionId = event.payload?.completionId || event.entityId;
    const keys: (readonly unknown[])[] = [
      NUTRITION_QUERY_KEYS.all,
      NUTRITION_QUERY_KEYS.completions.all,
    ];

    if (completionId) {
      keys.push(NUTRITION_QUERY_KEYS.completions.detail(completionId));
    }

    return keys;
  };

  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_created', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_activated', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_completed', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_submitted', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_recalled', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_accepted', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:plan_rejected', handlePlanEvent),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>(
      'nutrition:plan_deletion_requested',
      handlePlanEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>(
      'nutrition:plan_deletion_accepted',
      handlePlanEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>(
      'nutrition:plan_deletion_rejected',
      handlePlanEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>(
      'nutrition:completion_started',
      handleCompletionEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>(
      'nutrition:completion_updated',
      handleCompletionEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<NutritionRealtimePayload>('nutrition:completed', handleCompletionEvent),
  );

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
};
