import { Socket } from 'socket.io';
import { ILogger } from '../../shared/contracts/ILogger';

import { SocketIOManager } from './SocketIOManager';

interface JoinRoomPayload {
  roomId: string;
}

interface LeaveRoomPayload {
  roomId: string;
}

interface OfferPayload {
  to: string;
  offer: unknown;
}

interface AnswerPayload {
  to: string;
  answer: unknown;
}

interface IceCandidatePayload {
  to: string;
  candidate: unknown;
}

export class WebRTCSignaling {
  constructor(
    private readonly socketIOManager: SocketIOManager,
    private readonly logger: ILogger,
  ) {}

  public initialize(): void {
    const io = this.socketIOManager.getIO();
    this.logger.info('✅ WebRTC Signaling initialized');

    io.on('connection', (socket: Socket) => {
      this.logger.info(`🔌 Socket connected: ${socket.id}`);

      this.registerJoinRoom(socket);
      this.registerLeaveRoom(socket);
      this.registerOffer(socket);
      this.registerAnswer(socket);
      this.registerIceCandidate(socket);
      this.registerDisconnect(socket);
    });
  }

  private isProtectedRoom(roomId: string): boolean {
    if (!roomId || typeof roomId !== 'string') return true;
    return roomId.startsWith('user:') || roomId.startsWith('role:');
  }

  private registerJoinRoom(socket: Socket): void {
    socket.on('webrtc:join-room', ({ roomId }: JoinRoomPayload) => {
      try {
        if (this.isProtectedRoom(roomId)) {
          this.logger.warn(
            `⚠️ [Security] Socket ${socket.id} attempted unauthorized manual join to protected room '${roomId}'`,
          );
          return;
        }

        socket.join(roomId);

        this.logger.info(`📹 ${socket.id} joined WebRTC room ${roomId}`);

        socket.to(roomId).emit('webrtc:user-joined', {
          userId: socket.id,
        });
      } catch (error) {
        this.logger.error(`Join room failed: ${String(error)}`);
      }
    });
  }

  private registerLeaveRoom(socket: Socket): void {
    socket.on('webrtc:leave-room', ({ roomId }: LeaveRoomPayload) => {
      try {
        if (this.isProtectedRoom(roomId)) {
          return;
        }

        socket.leave(roomId);

        this.logger.info(`👋 ${socket.id} left WebRTC room ${roomId}`);

        socket.to(roomId).emit('webrtc:user-left', {
          userId: socket.id,
        });
      } catch (error) {
        this.logger.error(`Leave room failed: ${String(error)}`);
      }
    });
  }

  private registerOffer(socket: Socket): void {
    socket.on('webrtc:offer', ({ to, offer }: OfferPayload) => {
      try {
        this.logger.debug(`Offer: ${socket.id} → ${to}`);

        socket.to(to).emit('webrtc:offer', {
          from: socket.id,
          offer,
        });
      } catch (error) {
        this.logger.error(`Offer failed: ${String(error)}`);
      }
    });
  }

  private registerAnswer(socket: Socket): void {
    socket.on('webrtc:answer', ({ to, answer }: AnswerPayload) => {
      try {
        this.logger.debug(`Answer: ${socket.id} → ${to}`);

        socket.to(to).emit('webrtc:answer', {
          from: socket.id,
          answer,
        });
      } catch (error) {
        this.logger.error(`Answer failed: ${String(error)}`);
      }
    });
  }

  private registerIceCandidate(socket: Socket): void {
    socket.on('webrtc:ice-candidate', ({ to, candidate }: IceCandidatePayload) => {
      try {
        this.logger.debug(`ICE Candidate: ${socket.id} → ${to}`);

        socket.to(to).emit('webrtc:ice-candidate', {
          from: socket.id,
          candidate,
        });
      } catch (error) {
        this.logger.error(`ICE Candidate failed: ${String(error)}`);
      }
    });
  }

  private registerDisconnect(socket: Socket): void {
    socket.on('disconnect', (reason) => {
      this.logger.info(`❌ Socket disconnected: ${socket.id} (${reason})`);
    });
  }
}
