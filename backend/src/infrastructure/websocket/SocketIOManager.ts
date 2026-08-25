import { Server, Socket } from 'socket.io';
import http from 'http';
import { ILogger } from '../../shared/contracts/ILogger';
import { RedisManager } from '../cache/RedisManager';
import { createAdapter } from '@socket.io/redis-adapter';
import { env } from '../../config/env.config';
import { socketAuthMiddleware } from './middleware/socket-auth.middleware';
import { UserRoom, TrainerProfileRoom } from './utils/user-room.util';

export class SocketIOManager {
  private io!: Server;

  constructor(
    private readonly logger: ILogger,
    private readonly redisManager: RedisManager,
  ) {}

  public initialize(httpServer: http.Server): Server {
    const allowedOrigins = Array.from(
      new Set([
        env.CORS_ORIGIN,
        env.FRONTEND_URL,
        'http://localhost:3100',
        'http://localhost:3002',
        'http://localhost:3000',
      ]),
    );

    this.io = new Server(httpServer, {
      cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST'],
      },
    });

    const pubClient = this.redisManager.getClient();
    const subClient = pubClient.duplicate();

    // Wire Redis adapter for scale-out
    this.io.adapter(createAdapter(pubClient, subClient));

    // Register authentication middleware
    this.io.use(socketAuthMiddleware);

    // Handle authenticated connections
    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;

      if (user?.userId) {
        const userRoom = UserRoom.forUser(user.userId);
        socket.join(userRoom);

        this.logger.info(
          `🔌 Socket authenticated & connected: ${socket.id} (User: ${user.userId}, Role: ${user.role}) joined ${userRoom}`,
        );
      } else {
        this.logger.debug(`Socket connected without identity: ${socket.id}`);
      }

      // Handle controlled subscription to public trainer profile viewer rooms
      socket.on('profile:subscribe', (data: { profileId: string }) => {
        if (!data || !data.profileId || !TrainerProfileRoom.isValid(data.profileId)) {
          this.logger.warn(
            `Rejected invalid profile subscription attempt from ${socket.id}: ${data?.profileId}`,
          );
          return;
        }
        const room = TrainerProfileRoom.forProfile(data.profileId);
        socket.join(room);
        this.logger.info(`🔌 Socket ${socket.id} joined profile room: ${room}`);
      });

      socket.on('profile:unsubscribe', (data: { profileId: string }) => {
        if (!data || !data.profileId || !TrainerProfileRoom.isValid(data.profileId)) {
          return;
        }
        const room = TrainerProfileRoom.forProfile(data.profileId);
        socket.leave(room);
        this.logger.info(`🔌 Socket ${socket.id} left profile room: ${room}`);
      });

      socket.on('disconnect', (reason: string) => {
        const userId = socket.data.user?.userId || 'anonymous';
        this.logger.info(
          `❌ Socket disconnected: ${socket.id} (User: ${userId}, Reason: ${reason})`,
        );
      });
    });

    return this.io;
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.IO has not been initialized.');
    }
    return this.io;
  }

  public getStatus(): string {
    return this.io ? 'connected' : 'disconnected';
  }
}
