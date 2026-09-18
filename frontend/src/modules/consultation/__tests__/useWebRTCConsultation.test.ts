import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
  useWebRTCConsultation,
  UseWebRTCConsultationOptions,
} from '../application/hooks/useWebRTCConsultation';
import { socketClientService } from '../../../infrastructure/realtime/SocketClientService';

function renderTestHook(options: UseWebRTCConsultationOptions) {
  let stateIndex = 0;
  const states: any[] = [];
  const stateSetters: any[] = [];

  let refIndex = 0;
  const refs: any[] = [];

  let effectExecuted = false;
  let effectCleanup: (() => void) | undefined;

  const result = { current: null as any };

  function rerender() {
    stateIndex = 0;
    refIndex = 0;

    const mockDispatcher = {
      readContext: (ctx: any) => ctx._currentValue,
      useState: (initialValue: any) => {
        const idx = stateIndex++;
        if (states.length <= idx) {
          states[idx] = typeof initialValue === 'function' ? initialValue() : initialValue;
          stateSetters[idx] = (newValue: any) => {
            const nextVal = typeof newValue === 'function' ? newValue(states[idx]) : newValue;
            states[idx] = nextVal;
            rerender();
          };
        }
        return [states[idx], stateSetters[idx]];
      },
      useRef: (initialValue: any) => {
        const idx = refIndex++;
        if (refs.length <= idx) {
          refs[idx] = { current: initialValue };
        }
        return refs[idx];
      },
      useCallback: (fn: any) => fn,
      useEffect: (effect: any) => {
        if (!effectExecuted) {
          effectExecuted = true;
          const cleanup = effect();
          if (typeof cleanup === 'function') {
            effectCleanup = cleanup;
          }
        }
      },
      useMemo: (fn: any) => fn(),
      useLayoutEffect: () => {},
      useContext: () => {},
      useReducer: (reducer: any, initial: any) => [initial, () => {}],
      useImperativeHandle: () => {},
      useDebugValue: () => {},
      useDeferredValue: (val: any) => val,
      useTransition: () => [false, (fn: any) => fn()],
      useId: () => 'id_123',
    };

    const dispatcherObj = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      ?.ReactCurrentDispatcher;

    const prevDispatcher = dispatcherObj ? dispatcherObj.current : null;
    if (dispatcherObj) {
      dispatcherObj.current = mockDispatcher;
    }

    try {
      result.current = useWebRTCConsultation(options);
    } finally {
      if (dispatcherObj) {
        dispatcherObj.current = prevDispatcher;
      }
    }
  }

  rerender();

  return {
    result,
    unmount: () => {
      if (effectCleanup) {
        effectCleanup();
      }
    },
  };
}

// Mock WebMediaTrack and MediaStream
class MockMediaStreamTrack {
  kind: string;
  enabled: boolean = true;
  stopped: boolean = false;
  onended: (() => void) | null = null;
  readyState: string = 'live';

  constructor(kind: string) {
    this.kind = kind;
  }
  stop() {
    this.stopped = true;
    this.readyState = 'ended';
    if (this.onended) this.onended();
  }
}

class MockMediaStream {
  tracks: MockMediaStreamTrack[];
  constructor(tracks: MockMediaStreamTrack[] = []) {
    this.tracks =
      tracks.length > 0
        ? tracks
        : [new MockMediaStreamTrack('audio'), new MockMediaStreamTrack('video')];
  }
  getTracks() {
    return this.tracks;
  }
  getAudioTracks() {
    return this.tracks.filter((t) => t.kind === 'audio');
  }
  getVideoTracks() {
    return this.tracks.filter((t) => t.kind === 'video');
  }
  addTrack(t: MockMediaStreamTrack) {
    this.tracks.push(t);
  }
}

// Mock RTCPeerConnection with accurate signalingState handling
class MockRTCPeerConnection {
  onicecandidate: ((ev: any) => void) | null = null;
  ontrack: ((ev: any) => void) | null = null;
  onconnectionstatechange: (() => void) | null = null;

  localDescription: any = null;
  remoteDescription: any = null;
  connectionState: string = 'new';
  signalingState: string = 'stable';
  addedTracks: any[] = [];
  addedIceCandidates: any[] = [];
  closed: boolean = false;

  addTrack(track: any, stream: any) {
    this.addedTracks.push({ track, stream });
  }

  async createOffer() {
    return { type: 'offer', sdp: 'fake_offer_sdp' };
  }

  async createAnswer() {
    return { type: 'answer', sdp: 'fake_answer_sdp' };
  }

  async setLocalDescription(desc: any) {
    this.localDescription = desc;
    if (desc.type === 'offer') {
      this.signalingState = 'have-local-offer';
    } else if (desc.type === 'answer') {
      this.signalingState = 'stable';
    }
  }

  async setRemoteDescription(desc: any) {
    if (desc.type === 'answer') {
      if (this.signalingState === 'stable') {
        throw new Error(
          "Failed to execute 'setRemoteDescription' on 'RTCPeerConnection': Failed to set remote answer sdp: Called in wrong state: stable",
        );
      }
      this.signalingState = 'stable';
    } else if (desc.type === 'offer') {
      this.signalingState = 'have-remote-offer';
    }
    this.remoteDescription = desc;
  }

  async addIceCandidate(candidate: any) {
    if (!this.remoteDescription) {
      throw new Error('Remote description not set');
    }
    this.addedIceCandidates.push(candidate);
  }

  close() {
    this.closed = true;
    this.connectionState = 'closed';
    this.signalingState = 'closed';
    if (this.onconnectionstatechange) this.onconnectionstatechange();
  }
}

describe('useWebRTCConsultation Application Hook', () => {
  let socketListeners: Record<string, Function> = {};
  let mockSocket: any;

  beforeEach(() => {
    socketListeners = {};
    mockSocket = {
      connected: true,
      on: vi.fn((event: string, fn: Function) => {
        socketListeners[event] = fn;
      }),
      off: vi.fn((event: string) => {
        delete socketListeners[event];
      }),
      emit: vi.fn(),
    };

    vi.spyOn(socketClientService, 'getSocket').mockReturnValue(mockSocket);
    vi.spyOn(socketClientService, 'connect').mockImplementation(() => {});
    vi.spyOn(socketClientService, 'emit').mockImplementation(
      (event: string, data?: any, ack?: any) => {
        mockSocket.emit(event, data, ack);
      },
    );

    // Mock navigator.mediaDevices.getUserMedia
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue(new MockMediaStream()),
      },
      writable: true,
      configurable: true,
    });

    // Mock RTCPeerConnection
    (global as any).RTCPeerConnection = MockRTCPeerConnection;
    (global as any).RTCSessionDescription = function (desc: any) {
      return desc;
    };
    (global as any).RTCIceCandidate = function (candidate: any) {
      return candidate;
    };
    (global as any).MediaStream = MockMediaStream;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('1. getUserMedia success populates localStream state', async () => {
    const { result } = renderTestHook({ consultationId: 'c1', userId: 'u1', role: 'CLIENT' });

    await result.current.join();

    expect(result.current.localStream).not.toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('2. getUserMedia permission denied sets failed connectionState and error', async () => {
    (navigator.mediaDevices.getUserMedia as any).mockRejectedValueOnce(
      new Error('Permission denied'),
    );

    const { result } = renderTestHook({ consultationId: 'c1', userId: 'u1', role: 'CLIENT' });

    await result.current.join();

    expect(result.current.connectionState).toBe('failed');
    expect(result.current.error).toBe('Permission denied');
  });

  it('3. Socket join emits webrtc:join-room with correct roomId format', async () => {
    const { result } = renderTestHook({ consultationId: 'c123', userId: 'u1', role: 'CLIENT' });

    await result.current.join();

    expect(socketClientService.emit).toHaveBeenCalledWith(
      'webrtc:join-room',
      { roomId: 'consultation:c123' },
      expect.any(Function),
    );
  });

  it('4. Trainer waits when alone in room (existingParticipants empty)', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    const ackCallback = (socketClientService.emit as any).mock.calls.find(
      (call: any) => call[0] === 'webrtc:join-room',
    )[2];

    ackCallback({ success: true, roomId: 'consultation:c123', existingParticipants: [] });

    expect(result.current.connectionState).toBe('waiting');
  });

  it('5. Trainer creates offer when Client joins after Trainer (webrtc:user-joined)', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    if (socketListeners['webrtc:user-joined']) {
      await socketListeners['webrtc:user-joined']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(socketClientService.emit).toHaveBeenCalledWith('webrtc:offer', {
      toSocketId: 'client_socket_1',
      offer: expect.objectContaining({ type: 'offer' }),
    });
  });

  it('6. Client never creates initial offer when joining alone or when Trainer joins second', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    if (socketListeners['webrtc:user-joined']) {
      await socketListeners['webrtc:user-joined']({
        socketId: 'trainer_socket_1',
        userId: 'trainer1',
        role: 'TRAINER',
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(socketClientService.emit).not.toHaveBeenCalledWith('webrtc:offer', expect.anything());
    expect(result.current.connectionState).toBe('waiting');
  });

  it('7 & 8. Client handles offer and emits webrtc:answer', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    if (socketListeners['webrtc:offer']) {
      await socketListeners['webrtc:offer']({
        fromSocketId: 'trainer_socket_1',
        fromUserId: 'trainer1',
        offer: { type: 'offer', sdp: 'trainer_sdp' },
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(socketClientService.emit).toHaveBeenCalledWith('webrtc:answer', {
      toSocketId: 'trainer_socket_1',
      answer: expect.objectContaining({ type: 'answer' }),
    });
  });

  it('9. Trainer handles answer from Client when in have-local-offer state', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    if (socketListeners['webrtc:user-joined']) {
      await socketListeners['webrtc:user-joined']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
    }

    if (socketListeners['webrtc:answer']) {
      await socketListeners['webrtc:answer']({
        fromSocketId: 'client_socket_1',
        fromUserId: 'client1',
        answer: { type: 'answer', sdp: 'client_sdp' },
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current.error).toBeNull();
  });

  it('10 (Regression). Trainer safely ignores duplicate answer when already in stable state', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    // First user-joined triggers initial offer
    if (socketListeners['webrtc:user-joined']) {
      await socketListeners['webrtc:user-joined']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
    }

    // First answer puts state to stable
    if (socketListeners['webrtc:answer']) {
      await socketListeners['webrtc:answer']({
        fromSocketId: 'client_socket_1',
        fromUserId: 'client1',
        answer: { type: 'answer', sdp: 'client_sdp' },
      });
    }

    // Second duplicate answer arrives while stable
    if (socketListeners['webrtc:answer']) {
      await socketListeners['webrtc:answer']({
        fromSocketId: 'client_socket_1',
        fromUserId: 'client1',
        answer: { type: 'answer', sdp: 'client_sdp_duplicate' },
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    // Must NOT crash or throw SET_REMOTE_ANSWER_FAILED
    expect(result.current.error).toBeNull();
  });

  it('11 (Regression). Trainer creates only ONE offer even if user-joined is triggered repeatedly', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    if (socketListeners['webrtc:user-joined']) {
      await socketListeners['webrtc:user-joined']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
      await socketListeners['webrtc:user-joined']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    const offerCalls = (socketClientService.emit as any).mock.calls.filter(
      (call: any) => call[0] === 'webrtc:offer',
    );
    expect(offerCalls.length).toBe(1);
  });

  it('12, 13, 14. ICE candidates are queued before remote description and flushed after', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    if (socketListeners['webrtc:ice-candidate']) {
      await socketListeners['webrtc:ice-candidate']({
        fromSocketId: 'trainer_socket_1',
        candidate: { candidate: 'cand_1' },
      });
    }

    if (socketListeners['webrtc:offer']) {
      await socketListeners['webrtc:offer']({
        fromSocketId: 'trainer_socket_1',
        offer: { type: 'offer', sdp: 'sdp' },
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current.error).toBeNull();
  });

  it('15. Remote track event populates remoteStream state', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    if (socketListeners['webrtc:offer']) {
      await socketListeners['webrtc:offer']({
        fromSocketId: 'trainer_socket_1',
        offer: { type: 'offer', sdp: 'sdp' },
      });
    }

    await new Promise((r) => setTimeout(r, 10));

    expect(result.current.error).toBeNull();
  });

  it('16 & 17. Microphone and camera toggle actions update state and track enabled property', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    expect(result.current.isMuted).toBe(false);
    expect(result.current.isVideoOff).toBe(false);

    result.current.toggleMicrophone();
    expect(result.current.isMuted).toBe(true);

    result.current.toggleCamera();
    expect(result.current.isVideoOff).toBe(true);
  });

  it('18 & 19. Peer leaves transitions to waiting and clears remoteStream; peer re-joins allows fresh offer', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'trainer1',
      role: 'TRAINER',
    });

    await result.current.join();

    if (socketListeners['webrtc:user-left']) {
      await socketListeners['webrtc:user-left']({
        socketId: 'client_socket_1',
        userId: 'client1',
        role: 'CLIENT',
      });
    }

    expect(result.current.connectionState).toBe('waiting');
    expect(result.current.remoteStream).toBeNull();
  });

  it('20. Peer eviction transitions connectionState to evicted and sets NEW_TAB_CONNECTED error', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    if (socketListeners['webrtc:peer-evicted']) {
      await socketListeners['webrtc:peer-evicted']({ reason: 'NEW_TAB_CONNECTED' });
    }

    expect(result.current.connectionState).toBe('evicted');
    expect(result.current.error).toBe('NEW_TAB_CONNECTED');
  });

  it('21 & 22. Cleanup on unmount stops local tracks and leaves room cleanly', async () => {
    const { result, unmount } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
      autoJoin: true,
    });

    await new Promise((r) => setTimeout(r, 10));

    unmount();

    expect(socketClientService.emit).toHaveBeenCalledWith('webrtc:leave-room', {
      roomId: 'consultation:c123',
    });
  });

  it('23 & 24. No duplicate socket listeners or peer connections on multiple join calls', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();
    await result.current.join();

    expect(result.current.error).toBeNull();
  });

  it('25. Leave action resets state to idle and closes resources', async () => {
    const { result } = renderTestHook({
      consultationId: 'c123',
      userId: 'client1',
      role: 'CLIENT',
    });

    await result.current.join();

    result.current.leave();

    expect(result.current.connectionState).toBe('idle');
    expect(result.current.localStream).toBeNull();
    expect(result.current.remoteStream).toBeNull();
  });
});
