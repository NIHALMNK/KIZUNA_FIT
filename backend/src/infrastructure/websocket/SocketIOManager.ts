import { Server, Socket } from 'socket.io';
import http from 'http';
import { ILogger } from '../../shared/contracts/ILogger';
import { RedisManager } from '../cache/RedisManager';
import { createAdapter } from '@socket.io/redis-adapter';

export class SocketIOManager {
  private io!: Server;

  constructor(private logger: ILogger, private redisManager: RedisManager) {}

  public initialize(httpServer: http.Server): Server {
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // To be restricted via config in production
        methods: ['GET', 'POST']
      }
    });

    const pubClient = this.redisManager.getClient();
    const subClient = pubClient.duplicate();
    
    // Wire redis adapter for scale-out
    this.io.adapter(createAdapter(pubClient, subClient));

    this.io.on('connection', (socket: Socket) => {
      this.logger.debug(`Socket connected: ${socket.id}`);
      
      socket.on('disconnect', () => {
        this.logger.debug(`Socket disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  public getIO(): Server {
    if (!this.io) {
      throw new Error("Socket.IO has not been initialized.");
    }
    return this.io;
  }

  public getStatus(): string {
    return this.io ? 'connected' : 'disconnected';
  }
}
