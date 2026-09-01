import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerCoachingRealtimeRules } from '../../infrastructure/realtime/coachingRealtimeBridge';
import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { COACHING_QUERY_KEYS } from '../../application/queryKeys';

describe('Frontend Coaching Realtime Bridge Tests', () => {
  let bridge: RealtimeQueryBridge;
  const registeredRules: Record<string, (event: any) => any> = {};

  beforeEach(() => {
    bridge = {
      registerRule: vi.fn().mockImplementation((eventType, ruleFn) => {
        registeredRules[eventType] = ruleFn;
        return vi.fn();
      }),
    } as unknown as RealtimeQueryBridge;

    registerCoachingRealtimeRules(bridge);
  });

  it('should register rules for all 6 canonical coaching socket events', () => {
    expect(bridge.registerRule).toHaveBeenCalledTimes(6);
    expect(registeredRules['coaching:relationship_created']).toBeDefined();
    expect(registeredRules['coaching:relationship_activated']).toBeDefined();
    expect(registeredRules['coaching:relationship_completed']).toBeDefined();
    expect(registeredRules['coaching:relationship_cancelled']).toBeDefined();
    expect(registeredRules['coaching:relationship_disputed']).toBeDefined();
    expect(registeredRules['coaching:relationship_refunded']).toBeDefined();
  });

  it('should invalidate active, list, and detail queries on coaching:relationship_completed', () => {
    const keys = registeredRules['coaching:relationship_completed']({
      payload: { relationshipId: 'rel_100' },
    });

    expect(keys).toContainEqual(COACHING_QUERY_KEYS.all);
    expect(keys).toContainEqual(COACHING_QUERY_KEYS.active());
    expect(keys).toContainEqual(COACHING_QUERY_KEYS.lists());
    expect(keys).toContainEqual(COACHING_QUERY_KEYS.detail('rel_100'));
  });
});
