import { QueryClient } from '@tanstack/react-query';
import { RealtimeEventPayload } from '../../../infrastructure/realtime/realtime.types';
import { socketClientService } from '../../../infrastructure/realtime/SocketClientService';

export type RealtimeQueryInvalidationRule<T = unknown> = (
  event: RealtimeEventPayload<T>,
) => (string | readonly unknown[])[];

/**
 * Reusable TanStack Query bridge that maps incoming realtime events to QueryKey invalidations.
 */
export class RealtimeQueryBridge {
  private invalidationRules: Map<string, RealtimeQueryInvalidationRule[]> = new Map();

  constructor(private readonly queryClient: QueryClient) {}

  /**
   * Registers a QueryKey invalidation rule for a specific realtime event type.
   */
  public registerRule<T = unknown>(
    eventType: string,
    rule: RealtimeQueryInvalidationRule<T>,
  ): () => void {
    const existingRules = this.invalidationRules.get(eventType) || [];
    this.invalidationRules.set(eventType, [
      ...existingRules,
      rule as RealtimeQueryInvalidationRule,
    ]);

    const unsubscribeSocket = socketClientService.subscribe<T>(eventType, (event) => {
      this.handleEvent(eventType, event);
    });

    return () => {
      unsubscribeSocket();
      const rules = this.invalidationRules.get(eventType) || [];
      const updated = rules.filter((r) => r !== rule);
      if (updated.length > 0) {
        this.invalidationRules.set(eventType, updated);
      } else {
        this.invalidationRules.delete(eventType);
      }
    };
  }

  private handleEvent<T>(eventType: string, event: RealtimeEventPayload<T>): void {
    const rules = this.invalidationRules.get(eventType);
    if (!rules || rules.length === 0) return;

    for (const rule of rules) {
      try {
        const queryKeys = rule(event);
        for (const queryKey of queryKeys) {
          const keyArray = Array.isArray(queryKey) ? queryKey : [queryKey];
          this.queryClient.invalidateQueries({ queryKey: keyArray });
        }
      } catch {
        // Ignore rule evaluation errors safely
      }
    }
  }

  /**
   * Performs global query invalidation on reconnection to catch up missed events.
   */
  public handleReconnect(): void {
    this.queryClient.invalidateQueries();
  }
}
