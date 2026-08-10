import {
  IRealtimePublisher,
  RealtimeEventPayload,
} from '../../../shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../shared/contracts/ILogger';
import { SocketIOManager } from '../SocketIOManager';
import { UserRoom } from '../utils/user-room.util';

export class SocketIORealtimePublisher implements IRealtimePublisher {
  constructor(
    private readonly socketIOManager: SocketIOManager,
    private readonly logger: ILogger,
  ) {}

  public publishToUser<T>(userId: string, event: RealtimeEventPayload<T>): void {
    const userRoom = UserRoom.forUser(userId);
    this.publishToRoom(userRoom, event);
  }

  public publishToRoom<T>(roomName: string, event: RealtimeEventPayload<T>): void {
    try {
      const io = this.socketIOManager.getIO();
      io.to(roomName).emit(event.type, event);
      this.logger.debug(
        `[SocketIORealtimePublisher] Emitted event '${event.type}' to room '${roomName}'`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `[SocketIORealtimePublisher] Failed to emit event '${event.type}' to room '${roomName}'`,
        { error },
      );
    }
  }

  public publishToAll<T>(event: RealtimeEventPayload<T>): void {
    try {
      const io = this.socketIOManager.getIO();
      io.emit(event.type, event);
      this.logger.debug(
        `[SocketIORealtimePublisher] Emitted event '${event.type}' to all connected clients`,
      );
    } catch (error: unknown) {
      this.logger.error(
        `[SocketIORealtimePublisher] Failed to emit event '${event.type}' to all clients`,
        { error },
      );
    }
  }
}
