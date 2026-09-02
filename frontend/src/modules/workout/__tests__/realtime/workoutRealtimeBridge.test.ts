import { describe, it, expect, vi } from 'vitest';
import { registerWorkoutRealtimeRules } from '../../infrastructure/realtime/workoutRealtimeBridge';
import { WORKOUT_QUERY_KEYS } from '../../application/queryKeys';

describe('Frontend Workout Realtime Bridge Tests', () => {
  it('registers all 4 workout event rules on the RealtimeQueryBridge', () => {
    const rules: Record<string, Function> = {};
    const mockBridge: any = {
      registerRule: vi.fn((type: string, handler: Function) => {
        rules[type] = handler;
        return vi.fn();
      }),
    };

    const cleanup = registerWorkoutRealtimeRules(mockBridge);

    expect(mockBridge.registerRule).toHaveBeenCalledTimes(4);
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'workout:program_created',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'workout:program_activated',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith(
      'workout:completion_started',
      expect.any(Function),
    );
    expect(mockBridge.registerRule).toHaveBeenCalledWith('workout:completed', expect.any(Function));

    // Test program_activated rule
    const programKeys = rules['workout:program_activated']({
      payload: { programId: 'wp_100', coachingRelationshipId: 'cr_100' },
    });
    expect(programKeys).toContainEqual(WORKOUT_QUERY_KEYS.all);
    expect(programKeys).toContainEqual(WORKOUT_QUERY_KEYS.programs());
    expect(programKeys).toContainEqual(WORKOUT_QUERY_KEYS.programDetail('wp_100'));
    expect(programKeys).toContainEqual(WORKOUT_QUERY_KEYS.assignedProgram('cr_100'));
    expect(programKeys).toContainEqual(WORKOUT_QUERY_KEYS.assignedProgram(undefined));
    expect(programKeys).toContainEqual(['client-dashboard']);
    expect(programKeys).toContainEqual(['client-dashboard', 'assigned-workouts']);

    // Test completed rule
    const completionKeys = rules['workout:completed']({
      payload: { completionId: 'wc_200', clientId: 'usr_client_01' },
    });
    expect(completionKeys).toContainEqual(WORKOUT_QUERY_KEYS.all);
    expect(completionKeys).toContainEqual(WORKOUT_QUERY_KEYS.completions());
    expect(completionKeys).toContainEqual(WORKOUT_QUERY_KEYS.completionDetail('wc_200'));
    expect(completionKeys).toContainEqual(WORKOUT_QUERY_KEYS.workoutHistory('usr_client_01'));

    cleanup();
  });

  it('unsubscribes all listeners when cleanup function is invoked', () => {
    const unsub1 = vi.fn();
    const unsub2 = vi.fn();
    const unsub3 = vi.fn();
    const unsub4 = vi.fn();

    const mockBridge: any = {
      registerRule: vi
        .fn()
        .mockReturnValueOnce(unsub1)
        .mockReturnValueOnce(unsub2)
        .mockReturnValueOnce(unsub3)
        .mockReturnValueOnce(unsub4),
    };

    const cleanup = registerWorkoutRealtimeRules(mockBridge);
    cleanup();

    expect(unsub1).toHaveBeenCalledTimes(1);
    expect(unsub2).toHaveBeenCalledTimes(1);
    expect(unsub3).toHaveBeenCalledTimes(1);
    expect(unsub4).toHaveBeenCalledTimes(1);
  });
});
