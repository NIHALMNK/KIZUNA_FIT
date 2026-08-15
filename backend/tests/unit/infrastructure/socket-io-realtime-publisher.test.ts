import { describe, it, expect, vi } from 'vitest';
import { SocketIORealtimePublisher } from '../../../src/infrastructure/websocket/publishers/SocketIORealtimePublisher';
import { UserRoom } from '../../../src/infrastructure/websocket/utils/user-room.util';

describe('SocketIORealtimePublisher (TEST R4, R5, R10)', () => {
  it('TEST R4 & R5 — should generate user:<userId> room name and emit formatted realtime envelope', () => {
    const mockTo = vi.fn().mockReturnValue({ emit: vi.fn() });
    const mockSocketIOManager: any = {
      getIO: vi.fn().mockReturnValue({ to: mockTo, emit: vi.fn() }),
    };
    const mockLogger: any = { debug: vi.fn(), error: vi.fn() };

    const publisher = new SocketIORealtimePublisher(mockSocketIOManager, mockLogger);

    const userId = 'usr_777';
    expect(UserRoom.forUser(userId)).toBe('user:usr_777');

    publisher.publishToUser(userId, {
      type: 'marketplace:request:created',
      version: 1,
      timestamp: new Date().toISOString(),
      entityId: 'req_123',
      payload: { goal: 'Fitness' },
    });

    expect(mockTo).toHaveBeenCalledWith('user:usr_777');
  });

  it('TEST R10 — should safely publish to all connected clients', () => {
    const mockEmit = vi.fn();
    const mockSocketIOManager: any = {
      getIO: vi.fn().mockReturnValue({ emit: mockEmit }),
    };
    const mockLogger: any = { debug: vi.fn(), error: vi.fn() };

    const publisher = new SocketIORealtimePublisher(mockSocketIOManager, mockLogger);

    publisher.publishToAll({
      type: 'system:maintenance',
      version: 1,
      timestamp: new Date().toISOString(),
      entityId: 'system',
      payload: { message: 'Server update' },
    });

    expect(mockEmit).toHaveBeenCalledWith(
      'system:maintenance',
      expect.objectContaining({
        type: 'system:maintenance',
      }),
    );
  });
});
