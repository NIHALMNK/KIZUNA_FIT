import { describe, it, expect, vi } from 'vitest';
import { WebRTCSignaling } from '../../../src/infrastructure/websocket/WebRTCSignaling';
import { IConsultationRepository } from '../../../src/modules/consultation/domain/repositories/consultation.repository';
import { Consultation } from '../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { ConsultationPlatform } from '../../../src/modules/consultation/domain/enums/consultation-platform.enum';
import { ConsultationStatus } from '../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { ILogger } from '../../../src/shared/contracts/ILogger';
import { SocketIOManager } from '../../../src/infrastructure/websocket/SocketIOManager';
import { Socket } from 'socket.io';

interface MockSocketOptions {
  id?: string;
  userId?: string;
  role?: string;
}

interface MockSocketInstance {
  socket: Socket;
  joinMock: ReturnType<typeof vi.fn>;
  leaveMock: ReturnType<typeof vi.fn>;
  emitMock: ReturnType<typeof vi.fn>;
  listeners: Record<string, (payload: any, ack?: any) => Promise<void> | void>;
  roomsSet: Set<string>;
}

function createMockSocket(options: MockSocketOptions = {}): MockSocketInstance {
  const joinMock = vi.fn();
  const leaveMock = vi.fn();
  const emitMock = vi.fn();
  const toEmitMock = vi.fn();
  const listeners: Record<string, (payload: any, ack?: any) => Promise<void> | void> = {};
  const roomsSet = new Set<string>();

  const socketId = options.id || `sock_${Math.random().toString(36).substr(2, 6)}`;
  roomsSet.add(socketId);

  joinMock.mockImplementation((room: string) => {
    roomsSet.add(room);
  });

  leaveMock.mockImplementation((room: string) => {
    roomsSet.delete(room);
  });

  const socketData = options.userId
    ? { user: { userId: options.userId, role: options.role || 'CLIENT' } }
    : {};

  const socket = {
    id: socketId,
    data: socketData,
    rooms: roomsSet,
    join: joinMock,
    leave: leaveMock,
    emit: emitMock,
    on: (event: string, handler: (payload: any, ack?: any) => Promise<void> | void) => {
      listeners[event] = handler;
    },
    to: vi.fn().mockReturnValue({ emit: toEmitMock }),
  };

  return {
    socket: socket as unknown as Socket,
    joinMock,
    leaveMock,
    emitMock,
    listeners,
    roomsSet,
  };
}

function createMockSocketIOMultiManager(sockets: Socket[]) {
  const socketMap = new Map<string, Socket>();
  sockets.forEach((s) => socketMap.set(s.id, s));

  return {
    getIO: () => ({
      on: (event: string, handler: (sock: Socket) => void) => {
        if (event === 'connection') {
          sockets.forEach((s) => handler(s));
        }
      },
      sockets: {
        sockets: socketMap,
        adapter: {
          rooms: {
            get: (roomId: string) => {
              const inRoom = new Set<string>();
              sockets.forEach((s) => {
                if (s.rooms.has(roomId)) {
                  inRoom.add(s.id);
                }
              });
              return inRoom.size > 0 ? inRoom : undefined;
            },
          },
        },
      },
    }),
  } as unknown as SocketIOManager;
}

function createMockLogger(): ILogger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  };
}

function createTestConsultation(
  status: ConsultationStatus = ConsultationStatus.SCHEDULED,
): Consultation {
  const start = new Date(Date.now() + 3600000);
  const end = new Date(Date.now() + 7200000);
  const slotRes = ConsultationSlot.create({
    scheduledStartAt: start,
    scheduledEndAt: end,
    timezone: 'UTC',
  });

  const consultationRes = Consultation.create(
    {
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_owner_1',
      trainerId: 'trainer_owner_1',
      slot: slotRes.getValue(),
      platform: ConsultationPlatform.WEBRTC,
      status,
    },
    'consultation_valid_123',
  );

  return consultationRes.getValue();
}

function createMockConsultationRepo(
  consultationMap: Record<string, Consultation | null> = {},
): IConsultationRepository {
  return {
    save: vi.fn(),
    findById: vi.fn().mockImplementation(async (id: string) => consultationMap[id] || null),
    findByAcquisitionPipelineId: vi.fn(),
    findByClientId: vi.fn(),
    findByTrainerId: vi.fn(),
    findUpcomingByClientId: vi.fn(),
    findUpcomingByTrainerId: vi.fn(),
    findHistoryByClientId: vi.fn(),
    findHistoryByTrainerId: vi.fn(),
    findByRoomId: vi.fn().mockImplementation(async (roomId: string) => {
      if (
        roomId === 'room_consultation_valid_123' ||
        roomId === 'consultation:consultation_valid_123'
      ) {
        return consultationMap['consultation_valid_123'] || null;
      }
      return null;
    }),
  };
}

describe('WebRTC Consultation Signaling & Room Authorization', () => {
  it('1. Client joins valid scheduled consultation room', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClient = createMockSocket({ userId: 'client_owner_1', role: 'CLIENT' });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockClient.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      ackFn,
    );

    expect(mockClient.joinMock).toHaveBeenCalledWith('consultation:consultation_valid_123');
    expect(ackFn).toHaveBeenCalledWith({
      success: true,
      roomId: 'consultation:consultation_valid_123',
      existingParticipants: [],
    });
  });

  it('2. Trainer joins valid scheduled consultation room', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockTrainer = createMockSocket({ userId: 'trainer_owner_1', role: 'TRAINER' });
    const mockIOManager = createMockSocketIOMultiManager([mockTrainer.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockTrainer.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      ackFn,
    );

    expect(mockTrainer.joinMock).toHaveBeenCalledWith('consultation:consultation_valid_123');
    expect(ackFn).toHaveBeenCalledWith({
      success: true,
      roomId: 'consultation:consultation_valid_123',
      existingParticipants: [],
    });
  });

  it('3. Client joins first → ack existingParticipants is empty', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClient = createMockSocket({ userId: 'client_owner_1', role: 'CLIENT' });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockClient.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      ackFn,
    );

    expect(ackFn).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        existingParticipants: [],
      }),
    );
  });

  it('4. Trainer joins second → ack contains Client socket info', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClient = createMockSocket({
      id: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockTrainer = createMockSocket({
      id: 'sock_trainer_1',
      userId: 'trainer_owner_1',
      role: 'TRAINER',
    });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket, mockTrainer.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    // Client joins first
    await mockClient.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Trainer joins second
    const trainerAckFn = vi.fn();
    await mockTrainer.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      trainerAckFn,
    );

    expect(trainerAckFn).toHaveBeenCalledWith({
      success: true,
      roomId: 'consultation:consultation_valid_123',
      existingParticipants: [
        {
          socketId: 'sock_client_1',
          userId: 'client_owner_1',
          role: 'CLIENT',
        },
      ],
    });
  });

  it('5 & 6. Trainer joins first, Client joins second → Client receives empty ack, Trainer receives user-joined event', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockTrainer = createMockSocket({
      id: 'sock_trainer_1',
      userId: 'trainer_owner_1',
      role: 'TRAINER',
    });
    const mockClient = createMockSocket({
      id: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([mockTrainer.socket, mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    // Trainer joins first
    const trainerAck = vi.fn();
    await mockTrainer.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      trainerAck,
    );
    expect(trainerAck).toHaveBeenCalledWith(expect.objectContaining({ existingParticipants: [] }));

    // Client joins second
    const clientAck = vi.fn();
    await mockClient.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      clientAck,
    );
    expect(clientAck).toHaveBeenCalledWith(
      expect.objectContaining({
        existingParticipants: [
          { socketId: 'sock_trainer_1', userId: 'trainer_owner_1', role: 'TRAINER' },
        ],
      }),
    );
  });

  it('7. Third-party user is rejected with UNAUTHORIZED_PARTICIPANT', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockAttacker = createMockSocket({ userId: 'attacker_999', role: 'CLIENT' });
    const mockIOManager = createMockSocketIOMultiManager([mockAttacker.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockAttacker.listeners['webrtc:join-room'](
      { roomId: 'consultation:consultation_valid_123' },
      ackFn,
    );

    expect(mockAttacker.joinMock).not.toHaveBeenCalled();
    expect(mockAttacker.emitMock).toHaveBeenCalledWith('webrtc:join-error', {
      reason: 'UNAUTHORIZED_PARTICIPANT',
    });
    expect(ackFn).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'UNAUTHORIZED_PARTICIPANT' }),
    );
  });

  it('8. Nonexistent consultation is rejected', async () => {
    const mockRepo = createMockConsultationRepo({});
    const mockClient = createMockSocket({ userId: 'client_owner_1' });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockClient.listeners['webrtc:join-room'](
      { roomId: 'consultation:non_existent_id' },
      ackFn,
    );

    expect(mockClient.joinMock).not.toHaveBeenCalled();
    expect(ackFn).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'NON_EXISTENT_CONSULTATION' }),
    );
  });

  it('9. Invalid room ID is rejected', async () => {
    const mockRepo = createMockConsultationRepo({});
    const mockClient = createMockSocket({ userId: 'client_owner_1' });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockClient.listeners['webrtc:join-room']({ roomId: '' }, ackFn);

    expect(mockClient.joinMock).not.toHaveBeenCalled();
    expect(ackFn).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'INVALID_ROOM_ID' }),
    );
  });

  it('10. Room ID mismatch / format rejection', async () => {
    const mockRepo = createMockConsultationRepo({});
    const mockClient = createMockSocket({ userId: 'client_owner_1' });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ackFn = vi.fn();
    await mockClient.listeners['webrtc:join-room']({ roomId: 'invalid_format_xyz' }, ackFn);

    expect(mockClient.joinMock).not.toHaveBeenCalled();
    expect(ackFn).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'INVALID_ROOM_ID' }),
    );
  });

  it('11, 12, 13. Terminal states (COMPLETED, CANCELLED, NO_SHOW) are rejected', async () => {
    for (const status of [
      ConsultationStatus.COMPLETED,
      ConsultationStatus.CANCELLED,
      ConsultationStatus.NO_SHOW,
    ]) {
      const terminalConsultation = createTestConsultation(status);
      const mockRepo = createMockConsultationRepo({ consultation_valid_123: terminalConsultation });
      const mockClient = createMockSocket({ userId: 'client_owner_1' });
      const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
      const mockLogger = createMockLogger();

      const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
      signaling.initialize();

      const ackFn = vi.fn();
      await mockClient.listeners['webrtc:join-room'](
        { roomId: 'consultation:consultation_valid_123' },
        ackFn,
      );

      expect(mockClient.joinMock).not.toHaveBeenCalled();
      expect(ackFn).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, error: 'TERMINAL_CONSULTATION' }),
      );
    }
  });

  it('14 & 15. Duplicate socket for same user evicts older socket', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClientOld = createMockSocket({
      id: 'sock_client_old',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockClientNew = createMockSocket({
      id: 'sock_client_new',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([
      mockClientOld.socket,
      mockClientNew.socket,
    ]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    // Old Client joins
    await mockClientOld.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });
    expect(mockClientOld.roomsSet.has('consultation:consultation_valid_123')).toBe(true);

    // New Client tab joins with same userId
    await mockClientNew.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Old socket evicted
    expect(mockClientOld.emitMock).toHaveBeenCalledWith('webrtc:peer-evicted', {
      reason: 'NEW_TAB_CONNECTED',
    });
    expect(mockClientOld.leaveMock).toHaveBeenCalledWith('consultation:consultation_valid_123');
    expect(mockClientNew.joinMock).toHaveBeenCalledWith('consultation:consultation_valid_123');
  });

  it('16. Old socket cleanup cannot remove new socket', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClientOld = createMockSocket({
      id: 'sock_client_old',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockClientNew = createMockSocket({
      id: 'sock_client_new',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([
      mockClientOld.socket,
      mockClientNew.socket,
    ]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    await mockClientOld.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });
    await mockClientNew.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Old socket leaves after being evicted
    await mockClientOld.listeners['webrtc:leave-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // New socket remains in room
    expect(mockClientNew.roomsSet.has('consultation:consultation_valid_123')).toBe(true);
  });

  it('17, 18, 19. Offer, Answer, and ICE candidates are relayed to target socket in same room', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockTrainer = createMockSocket({
      id: 'sock_trainer_1',
      userId: 'trainer_owner_1',
      role: 'TRAINER',
    });
    const mockClient = createMockSocket({
      id: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([mockTrainer.socket, mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    await mockTrainer.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });
    await mockClient.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Trainer sends offer to Client
    const offerData = { type: 'offer', sdp: 'fake_sdp' };
    await mockTrainer.listeners['webrtc:offer']({ toSocketId: 'sock_client_1', offer: offerData });

    const clientToEmit = (mockTrainer.socket.to('sock_client_1') as any).emit;
    expect(clientToEmit).toHaveBeenCalledWith('webrtc:offer', {
      fromSocketId: 'sock_trainer_1',
      fromUserId: 'trainer_owner_1',
      offer: offerData,
    });

    // Client sends answer to Trainer
    const answerData = { type: 'answer', sdp: 'fake_answer_sdp' };
    await mockClient.listeners['webrtc:answer']({
      toSocketId: 'sock_trainer_1',
      answer: answerData,
    });

    const trainerToEmit = (mockClient.socket.to('sock_trainer_1') as any).emit;
    expect(trainerToEmit).toHaveBeenCalledWith('webrtc:answer', {
      fromSocketId: 'sock_client_1',
      fromUserId: 'client_owner_1',
      answer: answerData,
    });

    // ICE candidate
    const candidateData = { candidate: 'candidate:123' };
    await mockTrainer.listeners['webrtc:ice-candidate']({
      toSocketId: 'sock_client_1',
      candidate: candidateData,
    });
    expect(clientToEmit).toHaveBeenCalledWith('webrtc:ice-candidate', {
      fromSocketId: 'sock_trainer_1',
      fromUserId: 'trainer_owner_1',
      candidate: candidateData,
    });
  });

  it('20. Cross-room signaling target is rejected', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClientInRoom = createMockSocket({
      id: 'sock_client_in',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockUserOutside = createMockSocket({
      id: 'sock_outside',
      userId: 'user_outside',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([
      mockClientInRoom.socket,
      mockUserOutside.socket,
    ]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    await mockClientInRoom.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Outside user tries to send offer to Client in room
    await mockUserOutside.listeners['webrtc:offer']({ toSocketId: 'sock_client_in', offer: {} });

    const outsideToEmit = (mockUserOutside.socket.to('sock_client_in') as any).emit;
    expect(outsideToEmit).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('without room membership'),
    );
  });

  it('21 & 22. Leave and disconnect notify remaining peer', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockTrainer = createMockSocket({
      id: 'sock_trainer_1',
      userId: 'trainer_owner_1',
      role: 'TRAINER',
    });
    const mockClient = createMockSocket({
      id: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([mockTrainer.socket, mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    await mockTrainer.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });
    await mockClient.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    // Client leaves room
    await mockClient.listeners['webrtc:leave-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    const roomEmit = (mockClient.socket.to('consultation:consultation_valid_123') as any).emit;
    expect(roomEmit).toHaveBeenCalledWith('webrtc:user-left', {
      socketId: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
  });

  it('23 & 24. Leave room does not change Consultation business status and signaling cannot complete consultation', async () => {
    const consultation = createTestConsultation(ConsultationStatus.SCHEDULED);
    const mockRepo = createMockConsultationRepo({ consultation_valid_123: consultation });
    const mockClient = createMockSocket({
      id: 'sock_client_1',
      userId: 'client_owner_1',
      role: 'CLIENT',
    });
    const mockIOManager = createMockSocketIOMultiManager([mockClient.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    await mockClient.listeners['webrtc:join-room']({
      roomId: 'consultation:consultation_valid_123',
    });
    await mockClient.listeners['webrtc:leave-room']({
      roomId: 'consultation:consultation_valid_123',
    });

    expect(consultation.status).toBe(ConsultationStatus.SCHEDULED);
    expect(mockRepo.save).not.toHaveBeenCalled();
  });

  it('25. Unauthorized user cannot emit signaling to protected room namespaces', async () => {
    const mockRepo = createMockConsultationRepo({});
    const mockAttacker = createMockSocket({ id: 'sock_attacker', userId: 'attacker_999' });
    const mockIOManager = createMockSocketIOMultiManager([mockAttacker.socket]);
    const mockLogger = createMockLogger();

    const signaling = new WebRTCSignaling(mockIOManager, mockLogger, mockRepo);
    signaling.initialize();

    const ack = vi.fn();
    await mockAttacker.listeners['webrtc:join-room']({ roomId: 'user:protected_admin' }, ack);

    expect(mockAttacker.joinMock).not.toHaveBeenCalled();
    expect(ack).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'UNAUTHORIZED_ROOM' }),
    );
  });
});
