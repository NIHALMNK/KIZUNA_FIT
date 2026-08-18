import { io, Socket } from 'socket.io-client';
import {
  RealtimeConnectionState,
  RealtimeEventHandler,
  RealtimeEventPayload,
  ConnectionStateListener,
} from './realtime.types';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export class SocketClientService {
  private socket: Socket | null = null;
  private state: RealtimeConnectionState = 'DISCONNECTED';
  private currentToken: string | null = null;
  private stateListeners: Set<ConnectionStateListener> = new Set();
  private eventHandlers: Map<string, Set<RealtimeEventHandler<any>>> = new Map();

  public getState(): RealtimeConnectionState {
    return this.state;
  }

  public onStateChange(listener: ConnectionStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.state);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private setState(newState: RealtimeConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach((listener) => {
        try {
          listener(newState);
        } catch {
          // Ignore listener errors
        }
      });
    }
  }

  public connect(accessToken: string): void {
    if (!accessToken) {
      this.disconnect();
      return;
    }

    // If socket exists and token hasn't changed, keep current connection
    if (this.socket && this.currentToken === accessToken) {
      if (this.socket.connected) {
        this.setState('CONNECTED');
      }
      return;
    }

    // If token changed on active socket, update auth payload and reconnect
    if (this.socket && this.currentToken !== accessToken) {
      this.currentToken = accessToken;
      this.socket.auth = { token: `Bearer ${accessToken}` };
      if (!this.socket.connected) {
        this.setState('CONNECTING');
        this.socket.connect();
      }
      return;
    }

    this.currentToken = accessToken;
    this.setState('CONNECTING');

    this.socket = io(SOCKET_SERVER_URL, {
      auth: { token: `Bearer ${accessToken}` },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.setupSocketListeners();
  }

  private activeProfileSubscriptions: Set<string> = new Set();

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.setState('CONNECTED');
      // Re-subscribe active profile room subscriptions on reconnect
      this.activeProfileSubscriptions.forEach((profileId) => {
        this.socket?.emit('profile:subscribe', { profileId });
      });
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server disconnected the socket (e.g. invalid auth), do not auto-reconnect with invalid token
        this.setState('DISCONNECTED');
      } else {
        this.setState('RECONNECTING');
      }
    });

    this.socket.on('connect_error', (error) => {
      if (error?.message?.includes('Authentication error')) {
        this.setState('ERROR');
        this.socket?.disconnect();
      } else {
        this.setState('RECONNECTING');
      }
    });

    // Re-attach registered custom event handlers to the socket
    this.eventHandlers.forEach((handlers, eventType) => {
      this.socket?.off(eventType);
      this.socket?.on(eventType, (data: RealtimeEventPayload) => {
        this.dispatchRealtimeEvent(eventType, data);
      });
    });
  }

  public subscribeToTrainerProfile(profileId: string): void {
    if (!profileId) return;
    this.activeProfileSubscriptions.add(profileId);
    if (this.socket && this.socket.connected) {
      this.socket.emit('profile:subscribe', { profileId });
    }
  }

  public unsubscribeFromTrainerProfile(profileId: string): void {
    if (!profileId) return;
    this.activeProfileSubscriptions.delete(profileId);
    if (this.socket && this.socket.connected) {
      this.socket.emit('profile:unsubscribe', { profileId });
    }
  }

  public subscribe<T = unknown>(eventType: string, handler: RealtimeEventHandler<T>): () => void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());

      // Wire listener to raw socket if socket is active
      if (this.socket) {
        this.socket.off(eventType);
        this.socket.on(eventType, (data: RealtimeEventPayload<T>) => {
          this.dispatchRealtimeEvent(eventType, data);
        });
      }
    }

    const handlers = this.eventHandlers.get(eventType)!;
    handlers.add(handler as RealtimeEventHandler<any>);

    return () => {
      this.unsubscribe(eventType, handler);
    };
  }

  public unsubscribe<T = unknown>(eventType: string, handler: RealtimeEventHandler<T>): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler as RealtimeEventHandler<any>);
      if (handlers.size === 0) {
        this.eventHandlers.delete(eventType);
        this.socket?.off(eventType);
      }
    }
  }

  private dispatchRealtimeEvent<T>(eventType: string, data: RealtimeEventPayload<T>): void {
    if (!data || typeof data !== 'object') {
      return; // Ignore malformed events safely
    }

    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch {
          // Ignore individual handler execution errors safely
        }
      });
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit(eventType: string, data?: unknown, ack?: unknown): void {
    if (this.socket) {
      if (typeof ack === 'function') {
        this.socket.emit(eventType, data, ack);
      } else {
        this.socket.emit(eventType, data);
      }
    }
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentToken = null;
    this.setState('DISCONNECTED');
  }
}

export const socketClientService = new SocketClientService();
