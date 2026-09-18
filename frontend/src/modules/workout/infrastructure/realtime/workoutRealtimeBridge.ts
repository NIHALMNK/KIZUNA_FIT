import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { WORKOUT_QUERY_KEYS } from '../../application/queryKeys';

export interface WorkoutRealtimePayload {
  programId?: string;
  completionId?: string;
  coachingRelationshipId?: string;
  clientId?: string;
  trainerId?: string;
}

export const registerWorkoutRealtimeRules = (bridge: RealtimeQueryBridge): (() => void) => {
  const unsubs: (() => void)[] = [];

  const handleProgramEvent = (event: { payload?: WorkoutRealtimePayload; entityId?: string }) => {
    const programId = event.payload?.programId || event.entityId;
    const relId = event.payload?.coachingRelationshipId;
    const keys: (readonly unknown[])[] = [
      WORKOUT_QUERY_KEYS.all,
      WORKOUT_QUERY_KEYS.programs(),
      WORKOUT_QUERY_KEYS.assignedProgram(relId),
      WORKOUT_QUERY_KEYS.assignedProgram(undefined),
      ['client-dashboard'],
      ['client-dashboard', 'assigned-workouts'],
    ];

    if (programId) {
      keys.push(WORKOUT_QUERY_KEYS.programDetail(programId));
    }

    return keys;
  };

  const handleCompletionEvent = (event: {
    payload?: WorkoutRealtimePayload;
    entityId?: string;
  }) => {
    const completionId = event.payload?.completionId || event.entityId;
    const clientId = event.payload?.clientId;
    const keys: (readonly unknown[])[] = [
      WORKOUT_QUERY_KEYS.all,
      WORKOUT_QUERY_KEYS.completions(),
      WORKOUT_QUERY_KEYS.workoutHistory(clientId),
    ];

    if (completionId) {
      keys.push(WORKOUT_QUERY_KEYS.completionDetail(completionId));
    }

    return keys;
  };

  unsubs.push(
    bridge.registerRule<WorkoutRealtimePayload>('workout:program_created', handleProgramEvent),
  );
  unsubs.push(
    bridge.registerRule<WorkoutRealtimePayload>('workout:program_activated', handleProgramEvent),
  );
  unsubs.push(
    bridge.registerRule<WorkoutRealtimePayload>(
      'workout:completion_started',
      handleCompletionEvent,
    ),
  );
  unsubs.push(
    bridge.registerRule<WorkoutRealtimePayload>('workout:completed', handleCompletionEvent),
  );

  return () => {
    unsubs.forEach((unsub) => unsub());
  };
};
