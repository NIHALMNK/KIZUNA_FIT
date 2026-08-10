export type RealtimeConnectionState =
  'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'ERROR';

export interface RealtimeEventPayload<T = unknown> {
  type: string;
  version: number;
  timestamp: string;
  entityId: string;
  payload: T;
}

export type RealtimeEventHandler<T = unknown> = (event: RealtimeEventPayload<T>) => void;

export type ConnectionStateListener = (state: RealtimeConnectionState) => void;
