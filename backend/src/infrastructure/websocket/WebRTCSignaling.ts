import { Socket } from 'socket.io';
import { ILogger } from '../../shared/contracts/ILogger';

import { SocketIOManager } from './SocketIOManager';
import { IConsultationRepository } from '../../modules/consultation/domain/repositories/consultation.repository';
import { ConsultationRoom } from './utils/consultation-room.util';

export interface WebRTCJoinRoomPayload {
  roomId: string;
}

export interface WebRTCParticipantInfo {
  socketId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER';
}

export interface WebRTCJoinRoomAck {
  success: boolean;
  roomId: string;
  existingParticipants: WebRTCParticipantInfo[];
  error?: string;
}

export interface WebRTCUserJoinedPayload {
  socketId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER';
}

export interface WebRTCOfferPayload {
  toSocketId?: string;
  to?: string;
  offer: unknown;
}

export interface WebRTCAnswerPayload {
  toSocketId?: string;
  to?: string;
  answer: unknown;
}

export interface WebRTCIceCandidatePayload {
  toSocketId?: string;
  to?: string;
  candidate: unknown;
}

export interface WebRTCLeaveRoomPayload {
  roomId: string;
}

export interface WebRTCUserLeftPayload {
  socketId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER';
}

export class WebRTCSignaling {
  constructor(
    private readonly socketIOManager: SocketIOManager,
    private readonly logger: ILogger,
    private readonly consultationRepo?: IConsultationRepository,
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

  private getSocketRoom(socket: Socket): string | null {
    for (const room of socket.rooms) {
      if (
        room.startsWith('consultation:') ||
        room.startsWith('room_') ||
        room.startsWith('call_room_')
      ) {
        return room;
      }
    }
    return null;
  }

  private registerJoinRoom(socket: Socket): void {
    socket.on(
      'webrtc:join-room',
      async (payload: WebRTCJoinRoomPayload, ack?: (response: WebRTCJoinRoomAck) => void) => {
        try {
          const roomId = payload?.roomId;
          const respondErr = (reason: string) => {
            socket.emit('webrtc:join-error', { reason });
            if (typeof ack === 'function') {
              ack({
                success: false,
                roomId: roomId || '',
                existingParticipants: [],
                error: reason,
              });
            }
          };

          if (!roomId || typeof roomId !== 'string' || roomId.trim() === '') {
            this.logger.warn(`⚠️ [Security] Socket ${socket.id} provided invalid room ID`);
            respondErr('INVALID_ROOM_ID');
            return;
          }

          if (this.isProtectedRoom(roomId)) {
            this.logger.warn(
              `⚠️ [Security] Socket ${socket.id} attempted unauthorized manual join to protected room '${roomId}'`,
            );
            respondErr('UNAUTHORIZED_ROOM');
            return;
          }

          if (!ConsultationRoom.isValid(roomId)) {
            this.logger.warn(
              `⚠️ [Security] Socket ${socket.id} requested invalid room format '${roomId}'`,
            );
            respondErr('INVALID_ROOM_ID');
            return;
          }

          const authenticatedUserId = socket.data?.user?.userId;
          if (!authenticatedUserId) {
            this.logger.warn(
              `⚠️ [Security] Unauthenticated socket ${socket.id} attempted join to room '${roomId}'`,
            );
            respondErr('UNAUTHENTICATED');
            return;
          }

          let userRole: 'CLIENT' | 'TRAINER' = 'CLIENT';

          if (this.consultationRepo) {
            let consultation = await this.consultationRepo.findByRoomId(roomId);
            if (!consultation) {
              const extractedId = ConsultationRoom.extractConsultationId(roomId);
              if (extractedId) {
                consultation = await this.consultationRepo.findById(extractedId);
              }
            }

            if (consultation) {
              const isParticipant =
                authenticatedUserId === consultation.clientId ||
                authenticatedUserId === consultation.trainerId;

              if (!isParticipant) {
                this.logger.warn(
                  `⚠️ [Security] Socket ${socket.id} (User: ${authenticatedUserId}) unauthorized to join consultation room '${roomId}'`,
                );
                respondErr('UNAUTHORIZED_PARTICIPANT');
                return;
              }

              if (consultation.isTerminal()) {
                this.logger.warn(
                  `⚠️ [Security] Socket ${socket.id} attempted to join room '${roomId}' for terminal consultation state '${consultation.status}'`,
                );
                respondErr('TERMINAL_CONSULTATION');
                return;
              }

              userRole = authenticatedUserId === consultation.clientId ? 'CLIENT' : 'TRAINER';
            } else {
              this.logger.warn(
                `⚠️ [Security] Socket ${socket.id} requested non-existent consultation room '${roomId}'`,
              );
              respondErr('NON_EXISTENT_CONSULTATION');
              return;
            }
          }

          const io = this.socketIOManager.getIO();
          const roomSocketIds = io.sockets.adapter.rooms.get(roomId);
          const existingParticipants: WebRTCParticipantInfo[] = [];

          if (roomSocketIds) {
            for (const socketId of roomSocketIds) {
              const existingSocket = io.sockets.sockets.get(socketId);
              if (existingSocket && existingSocket.id !== socket.id) {
                const existingUserId = existingSocket.data?.user?.userId;
                // Duplicate Connection Eviction
                if (existingUserId === authenticatedUserId) {
                  this.logger.info(
                    `🔄 Evicting older socket ${existingSocket.id} for user ${authenticatedUserId} in room ${roomId}`,
                  );
                  existingSocket.emit('webrtc:peer-evicted', { reason: 'NEW_TAB_CONNECTED' });
                  existingSocket.leave(roomId);
                } else if (existingUserId) {
                  const existingRole: 'CLIENT' | 'TRAINER' =
                    existingSocket.data?.user?.role === 'TRAINER' ? 'TRAINER' : 'CLIENT';
                  existingParticipants.push({
                    socketId: existingSocket.id,
                    userId: existingUserId,
                    role: existingRole,
                  });
                }
              }
            }
          }

          socket.join(roomId);

          this.logger.info(
            `📹 Socket ${socket.id} (User: ${authenticatedUserId}, Role: ${userRole}) joined room ${roomId}`,
          );

          if (typeof ack === 'function') {
            ack({
              success: true,
              roomId,
              existingParticipants,
            });
          }

          socket.to(roomId).emit('webrtc:user-joined', {
            socketId: socket.id,
            userId: authenticatedUserId,
            role: userRole,
          } satisfies WebRTCUserJoinedPayload);
        } catch (error) {
          this.logger.error(`Join room failed: ${String(error)}`);
          if (typeof ack === 'function') {
            ack({
              success: false,
              roomId: payload?.roomId || '',
              existingParticipants: [],
              error: 'INTERNAL_ERROR',
            });
          }
        }
      },
    );
  }

  private registerLeaveRoom(socket: Socket): void {
    socket.on('webrtc:leave-room', ({ roomId }: WebRTCLeaveRoomPayload) => {
      try {
        if (this.isProtectedRoom(roomId)) {
          return;
        }

        const authenticatedUserId = socket.data?.user?.userId;
        const userRole: 'CLIENT' | 'TRAINER' =
          socket.data?.user?.role === 'TRAINER' ? 'TRAINER' : 'CLIENT';

        socket.leave(roomId);

        this.logger.info(`👋 Socket ${socket.id} left WebRTC room ${roomId}`);

        socket.to(roomId).emit('webrtc:user-left', {
          socketId: socket.id,
          userId: authenticatedUserId || socket.id,
          role: userRole,
        } satisfies WebRTCUserLeftPayload);
      } catch (error) {
        this.logger.error(`Leave room failed: ${String(error)}`);
      }
    });
  }

  private validateSignalingTarget(
    socket: Socket,
    targetSocketId: string,
  ): { targetSocket: Socket; roomId: string } | null {
    const authenticatedUserId = socket.data?.user?.userId;
    if (!authenticatedUserId) {
      this.logger.warn(`⚠️ [Security] Unauthenticated socket ${socket.id} attempted signaling`);
      return null;
    }

    const roomId = this.getSocketRoom(socket);
    if (!roomId) {
      this.logger.warn(
        `⚠️ [Security] Socket ${socket.id} attempted signaling without room membership`,
      );
      return null;
    }

    const io = this.socketIOManager.getIO();
    const targetSocket = io.sockets.sockets.get(targetSocketId);
    if (!targetSocket) {
      this.logger.debug(
        `Target socket ${targetSocketId} not found for signaling from ${socket.id}`,
      );
      return null;
    }

    if (!targetSocket.rooms.has(roomId)) {
      this.logger.warn(
        `⚠️ [Security] Socket ${socket.id} attempted cross-room signaling to target ${targetSocketId} outside room ${roomId}`,
      );
      return null;
    }

    return { targetSocket, roomId };
  }

  private registerOffer(socket: Socket): void {
    socket.on('webrtc:offer', (payload: WebRTCOfferPayload) => {
      try {
        const targetSocketId = payload?.toSocketId || payload?.to;
        if (!targetSocketId || typeof targetSocketId !== 'string') return;

        const validation = this.validateSignalingTarget(socket, targetSocketId);
        if (!validation) return;

        const authenticatedUserId = socket.data?.user?.userId;

        this.logger.debug(`Offer: Socket ${socket.id} → Socket ${targetSocketId}`);

        socket.to(targetSocketId).emit('webrtc:offer', {
          fromSocketId: socket.id,
          fromUserId: authenticatedUserId,
          offer: payload.offer,
        });
      } catch (error) {
        this.logger.error(`Offer failed: ${String(error)}`);
      }
    });
  }

  private registerAnswer(socket: Socket): void {
    socket.on('webrtc:answer', (payload: WebRTCAnswerPayload) => {
      try {
        const targetSocketId = payload?.toSocketId || payload?.to;
        if (!targetSocketId || typeof targetSocketId !== 'string') return;

        const validation = this.validateSignalingTarget(socket, targetSocketId);
        if (!validation) return;

        const authenticatedUserId = socket.data?.user?.userId;

        this.logger.debug(`Answer: Socket ${socket.id} → Socket ${targetSocketId}`);

        socket.to(targetSocketId).emit('webrtc:answer', {
          fromSocketId: socket.id,
          fromUserId: authenticatedUserId,
          answer: payload.answer,
        });
      } catch (error) {
        this.logger.error(`Answer failed: ${String(error)}`);
      }
    });
  }

  private registerIceCandidate(socket: Socket): void {
    socket.on('webrtc:ice-candidate', (payload: WebRTCIceCandidatePayload) => {
      try {
        const targetSocketId = payload?.toSocketId || payload?.to;
        if (!targetSocketId || typeof targetSocketId !== 'string') return;

        const validation = this.validateSignalingTarget(socket, targetSocketId);
        if (!validation) return;

        const authenticatedUserId = socket.data?.user?.userId;

        this.logger.debug(`ICE Candidate: Socket ${socket.id} → Socket ${targetSocketId}`);

        socket.to(targetSocketId).emit('webrtc:ice-candidate', {
          fromSocketId: socket.id,
          fromUserId: authenticatedUserId,
          candidate: payload.candidate,
        });
      } catch (error) {
        this.logger.error(`ICE Candidate failed: ${String(error)}`);
      }
    });
  }

  private registerDisconnect(socket: Socket): void {
    socket.on('disconnect', (reason) => {
      const authenticatedUserId = socket.data?.user?.userId;
      const userRole: 'CLIENT' | 'TRAINER' =
        socket.data?.user?.role === 'TRAINER' ? 'TRAINER' : 'CLIENT';

      this.logger.info(`❌ Socket disconnected: ${socket.id} (${reason})`);

      for (const room of socket.rooms) {
        if (
          room.startsWith('consultation:') ||
          room.startsWith('room_') ||
          room.startsWith('call_room_')
        ) {
          socket.to(room).emit('webrtc:user-left', {
            socketId: socket.id,
            userId: authenticatedUserId || socket.id,
            role: userRole,
          } satisfies WebRTCUserLeftPayload);
        }
      }
    });
  }
}
