import { RealtimeQueryBridge } from '../../../../shared/infrastructure/realtime/realtimeQueryBridge';
import { COACHING_QUERY_KEYS } from '../../application/queryKeys';

export interface CoachingRealtimePayload {
  relationshipId: string;
  clientId?: string;
  trainerId?: string;
  status?: string;
}

export const registerCoachingRealtimeRules = (bridge: RealtimeQueryBridge): (() => void) => {
  const unsubs: (() => void)[] = [];

  const handleCoachingEvent = (event: { payload?: CoachingRealtimePayload; entityId?: string }) => {
    const relationshipId = event.payload?.relationshipId || event.entityId;
    const keys: (readonly unknown[])[] = [
      COACHING_QUERY_KEYS.all,
      COACHING_QUERY_KEYS.active(),
      COACHING_QUERY_KEYS.lists(),
      COACHING_QUERY_KEYS.history(),
    ];

    if (relationshipId) {
      keys.push(COACHING_QUERY_KEYS.detail(relationshipId));
    }

    return keys;
  };

  const unCreated = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_created',
    handleCoachingEvent,
  );
  unsubs.push(unCreated);

  const unActivated = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_activated',
    handleCoachingEvent,
  );
  unsubs.push(unActivated);

  const unCompleted = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_completed',
    handleCoachingEvent,
  );
  unsubs.push(unCompleted);

  const unCancelled = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_cancelled',
    handleCoachingEvent,
  );
  unsubs.push(unCancelled);

  const unDisputed = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_disputed',
    handleCoachingEvent,
  );
  unsubs.push(unDisputed);

  const unRefunded = bridge.registerRule<CoachingRealtimePayload>(
    'coaching:relationship_refunded',
    handleCoachingEvent,
  );
  unsubs.push(unRefunded);

  return () => {
    unsubs.forEach((un) => un());
  };
};
