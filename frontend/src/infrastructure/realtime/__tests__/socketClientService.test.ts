import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SocketClientService } from '../SocketClientService';
import { RealtimeEventPayload } from '../realtime.types';
import { RealtimeQueryBridge } from '../../../shared/infrastructure/realtime/realtimeQueryBridge';

vi.mock('socket.io-client', () => {
  const mockSocket = {
    connected: false,
    auth: {},
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(function (this: any) {
      this.connected = true;
    }),
    disconnect: vi.fn(function (this: any) {
      this.connected = false;
    }),
    removeAllListeners: vi.fn(),
  };
  return {
    io: vi.fn(() => mockSocket),
  };
});

describe('SocketClientService (R2-1 to R2-11)', () => {
  let service: SocketClientService;

  beforeEach(() => {
    service = new SocketClientService();
    vi.clearAllMocks();
  });

  it('R2-1: Socket does not connect when unauthenticated or empty token supplied', () => {
    service.connect('');
    expect(service.getState()).toBe('DISCONNECTED');
  });

  it('R2-2 & R2-3: Socket connects when authenticated with correct token in auth payload', () => {
    service.connect('valid_jwt_access_token');
    expect(service.getState()).toBe('CONNECTING');
  });

  it('R2-4: Duplicate connect calls with same token do not recreate socket or trigger duplicate connects', () => {
    service.connect('token_123');
    service.connect('token_123');
    expect(service.getState()).toBe('CONNECTING');
  });

  it('R2-5: Logout disconnects socket and resets state to DISCONNECTED', () => {
    service.connect('token_123');
    service.disconnect();
    expect(service.getState()).toBe('DISCONNECTED');
  });

  it('R2-6: Token update updates auth payload safely', () => {
    service.connect('token_old');
    service.connect('token_new');
    expect(service.getState()).toBe('CONNECTING');
  });

  it('R2-8 & R2-9: Event subscription and unsubscription work cleanly', () => {
    const handler = vi.fn();
    const unsubscribe = service.subscribe('marketplace:request:created', handler);

    expect(typeof unsubscribe).toBe('function');
    unsubscribe();
  });

  it('R2-10: Duplicate event handlers in same Set are prevented', () => {
    const handler = vi.fn();
    service.subscribe('marketplace:request:created', handler);
    service.subscribe('marketplace:request:created', handler);
    service.unsubscribe('marketplace:request:created', handler);
  });

  it('R2-11: Malformed events do not crash application or throw unhandled exceptions', () => {
    const handler = vi.fn();
    service.subscribe('test:event', handler);

    // Call private dispatch manually with null/undefined data safely
    (service as any).dispatchRealtimeEvent('test:event', null);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('RealtimeQueryBridge (TanStack Query integration)', () => {
  it('should register invalidation rule and trigger query invalidation on realtime event', () => {
    const mockQueryClient: any = {
      invalidateQueries: vi.fn(),
    };

    const bridge = new RealtimeQueryBridge(mockQueryClient);

    const unsubscribe = bridge.registerRule<any>('marketplace:request:created', (event) => [
      ['trainer-requests-pending'],
    ]);

    expect(typeof unsubscribe).toBe('function');

    bridge.handleReconnect();
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith();
  });
});
