export interface RealtimeEventPayload<T = unknown> {
  type: string;
  version: number;
  timestamp: string;
  entityId: string;
  payload: T;
}

/**
 * Platform Contract for Realtime Event Publishing.
 * Isolates domain/application layers from direct dependency on Socket.IO or WebSocket details.
 */
export interface IRealtimePublisher {
  publishToUser<T>(userId: string, event: RealtimeEventPayload<T>): void;
  publishToRoom<T>(roomName: string, event: RealtimeEventPayload<T>): void;
  publishToAll<T>(event: RealtimeEventPayload<T>): void;
}
