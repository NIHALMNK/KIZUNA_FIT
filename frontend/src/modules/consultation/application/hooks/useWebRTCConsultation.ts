import { useState, useRef, useCallback, useEffect } from 'react';
import { socketClientService } from '../../../../infrastructure/realtime/SocketClientService';

export type WebRTCConnectionState =
  'idle' | 'connecting' | 'connected' | 'waiting' | 'failed' | 'closed' | 'evicted';

export interface UseWebRTCConsultationOptions {
  consultationId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER';
  token?: string;
  autoJoin?: boolean;
  iceServers?: RTCIceServer[];
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
  fromSocketId: string;
  fromUserId?: string;
  offer: RTCSessionDescriptionInit;
}

export interface WebRTCAnswerPayload {
  fromSocketId: string;
  fromUserId?: string;
  answer: RTCSessionDescriptionInit;
}

export interface WebRTCIceCandidatePayload {
  fromSocketId: string;
  fromUserId?: string;
  candidate: RTCIceCandidateInit;
}

export interface WebRTCUserLeftPayload {
  socketId: string;
  userId: string;
  role: 'CLIENT' | 'TRAINER';
}

export interface WebRTCPeerEvictedPayload {
  reason: string;
}

export interface WebRTCJoinErrorPayload {
  reason: string;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

export function useWebRTCConsultation(options: UseWebRTCConsultationOptions) {
  const {
    consultationId,
    userId,
    role,
    token,
    autoJoin = false,
    iceServers = DEFAULT_ICE_SERVERS,
  } = options;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<WebRTCConnectionState>('idle');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const targetSocketIdRef = useRef<string | null>(null);
  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const isMountedRef = useRef<boolean>(true);
  const joinedRoomRef = useRef<string | null>(null);
  const isJoinedRef = useRef<boolean>(false);

  const safeSetState = useCallback((fn: () => void) => {
    if (isMountedRef.current) {
      fn();
    }
  }, []);

  const cleanupPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.oniceconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    targetSocketIdRef.current = null;
    iceCandidateQueueRef.current = [];
    remoteStreamRef.current = null;
    safeSetState(() => setRemoteStream(null));
  }, [safeSetState]);

  const flushIceCandidateQueue = useCallback(async (pc: RTCPeerConnection) => {
    if (!pc || !pc.remoteDescription) return;
    const queue = [...iceCandidateQueueRef.current];
    iceCandidateQueueRef.current = [];
    for (const candidate of queue) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        // Ignore individual candidate addition errors safely
      }
    }
  }, []);

  const createPeerConnection = useCallback(
    (targetSocketId: string): RTCPeerConnection => {
      cleanupPeerConnection();

      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionRef.current = pc;
      targetSocketIdRef.current = targetSocketId;

      // Add local media tracks to Peer Connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketClientService.emit('webrtc:ice-candidate', {
            toSocketId: targetSocketId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (event) => {
        // Obtain or initialize composite remote MediaStream containing ALL incoming tracks (audio + video)
        let compositeStream = remoteStreamRef.current;
        if (!compositeStream) {
          compositeStream = event.streams[0] ? event.streams[0] : new MediaStream();
          remoteStreamRef.current = compositeStream;
        }

        // Ensure incoming track (audio or video) is added to composite remote stream
        if (!compositeStream.getTracks().some((t) => t.id === event.track.id)) {
          compositeStream.addTrack(event.track);
        }

        // Attach track onended handler to update stream state if peer track disappears
        event.track.onended = () => {
          if (remoteStreamRef.current) {
            const liveTracks = remoteStreamRef.current
              .getTracks()
              .filter((t) => t.readyState === 'live');
            if (liveTracks.length === 0) {
              remoteStreamRef.current = null;
              safeSetState(() => {
                setRemoteStream(null);
                setConnectionState('waiting');
              });
            }
          }
        };

        // Construct updated MediaStream wrapper to trigger React state update with all tracks
        const updatedStream = new MediaStream(compositeStream.getTracks());
        remoteStreamRef.current = updatedStream;

        safeSetState(() => {
          setRemoteStream(updatedStream);
          setConnectionState('connected');
        });
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        safeSetState(() => {
          if (state === 'connecting') setConnectionState('connecting');
          else if (state === 'connected') setConnectionState('connected');
          else if (state === 'failed' || state === 'disconnected') {
            remoteStreamRef.current = null;
            setRemoteStream(null);
            setConnectionState('failed');
          } else if (state === 'closed') {
            remoteStreamRef.current = null;
            setRemoteStream(null);
            setConnectionState('closed');
          }
        });
      };

      return pc;
    },
    [cleanupPeerConnection, iceServers, safeSetState],
  );

  const createAndSendOffer = useCallback(
    async (targetSocketId: string) => {
      try {
        // Guard: Prevent duplicate offer creation if PC is already active for this target socket in 'have-local-offer' or 'stable'
        if (
          peerConnectionRef.current &&
          targetSocketIdRef.current === targetSocketId &&
          (peerConnectionRef.current.signalingState === 'have-local-offer' ||
            peerConnectionRef.current.signalingState === 'stable') &&
          peerConnectionRef.current.connectionState !== 'closed' &&
          peerConnectionRef.current.connectionState !== 'failed'
        ) {
          return;
        }

        const pc = createPeerConnection(targetSocketId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketClientService.emit('webrtc:offer', {
          toSocketId: targetSocketId,
          offer: pc.localDescription,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'OFFER_CREATION_FAILED';
        safeSetState(() => {
          setError(msg);
          setConnectionState('failed');
        });
      }
    },
    [createPeerConnection, safeSetState],
  );

  const handleOffer = useCallback(
    async (payload: WebRTCOfferPayload) => {
      try {
        const { fromSocketId, offer } = payload;
        const pc = createPeerConnection(fromSocketId);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        await flushIceCandidateQueue(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketClientService.emit('webrtc:answer', {
          toSocketId: fromSocketId,
          answer: pc.localDescription,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'ANSWER_CREATION_FAILED';
        safeSetState(() => {
          setError(msg);
          setConnectionState('failed');
        });
      }
    },
    [createPeerConnection, flushIceCandidateQueue, safeSetState],
  );

  const handleAnswer = useCallback(
    async (payload: WebRTCAnswerPayload) => {
      try {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        // Guard 1: Verify socket ID match
        if (targetSocketIdRef.current && payload.fromSocketId !== targetSocketIdRef.current) {
          return;
        }

        // Guard 2: Verify signalingState is 'have-local-offer'. If already 'stable', safely ignore duplicate/stale answer.
        if (pc.signalingState !== 'have-local-offer') {
          return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(payload.answer));
        await flushIceCandidateQueue(pc);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'SET_REMOTE_ANSWER_FAILED';
        safeSetState(() => {
          setError(msg);
          setConnectionState('failed');
        });
      }
    },
    [flushIceCandidateQueue, safeSetState],
  );

  const handleIceCandidate = useCallback(async (payload: WebRTCIceCandidatePayload) => {
    try {
      const pc = peerConnectionRef.current;
      if (pc && pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } else {
        iceCandidateQueueRef.current.push(payload.candidate);
      }
    } catch (err) {
      // Ignore candidate errors safely
    }
  }, []);

  const leave = useCallback(() => {
    if (joinedRoomRef.current) {
      socketClientService.emit('webrtc:leave-room', { roomId: joinedRoomRef.current });
      joinedRoomRef.current = null;
    }

    isJoinedRef.current = false;
    cleanupPeerConnection();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      safeSetState(() => setLocalStream(null));
    }

    safeSetState(() => {
      setConnectionState('idle');
      setIsMuted(false);
      setIsVideoOff(false);
      setError(null);
    });
  }, [cleanupPeerConnection, safeSetState]);

  const join = useCallback(async () => {
    try {
      safeSetState(() => {
        setConnectionState('connecting');
        setError(null);
      });

      // Connect socket if token provided
      if (token) {
        socketClientService.connect(token);
      }

      // Request getUserMedia if local stream not acquired
      if (!localStreamRef.current) {
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error('BROWSER_UNSUPPORTED');
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        localStreamRef.current = stream;
        safeSetState(() => {
          setLocalStream(stream);
          setIsMuted(!stream.getAudioTracks().some((t) => t.enabled));
          setIsVideoOff(!stream.getVideoTracks().some((t) => t.enabled));
        });
      }

      const roomId = `consultation:${consultationId}`;
      joinedRoomRef.current = roomId;
      isJoinedRef.current = true;

      // Register socket event handlers
      const socket = socketClientService.getSocket();
      if (socket) {
        socket.off('webrtc:user-joined');
        socket.off('webrtc:offer');
        socket.off('webrtc:answer');
        socket.off('webrtc:ice-candidate');
        socket.off('webrtc:user-left');
        socket.off('webrtc:peer-evicted');
        socket.off('webrtc:join-error');

        socket.on('webrtc:user-joined', (payload: WebRTCUserJoinedPayload) => {
          if (!isJoinedRef.current) return;
          // Deterministic Initiator: TRAINER creates offer when peer joins
          if (role === 'TRAINER') {
            createAndSendOffer(payload.socketId);
          } else {
            safeSetState(() => setConnectionState('waiting'));
          }
        });

        socket.on('webrtc:offer', (payload: WebRTCOfferPayload) => {
          if (!isJoinedRef.current) return;
          handleOffer(payload);
        });

        socket.on('webrtc:answer', (payload: WebRTCAnswerPayload) => {
          if (!isJoinedRef.current) return;
          handleAnswer(payload);
        });

        socket.on('webrtc:ice-candidate', (payload: WebRTCIceCandidatePayload) => {
          if (!isJoinedRef.current) return;
          handleIceCandidate(payload);
        });

        socket.on('webrtc:user-left', (payload: WebRTCUserLeftPayload) => {
          if (!isJoinedRef.current) return;
          cleanupPeerConnection();
          safeSetState(() => setConnectionState('waiting'));
        });

        socket.on('webrtc:peer-evicted', (payload: WebRTCPeerEvictedPayload) => {
          cleanupPeerConnection();
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
            safeSetState(() => setLocalStream(null));
          }
          isJoinedRef.current = false;
          safeSetState(() => {
            setConnectionState('evicted');
            setError('NEW_TAB_CONNECTED');
          });
        });

        socket.on('webrtc:join-error', (payload: WebRTCJoinErrorPayload) => {
          safeSetState(() => {
            setConnectionState('failed');
            setError(payload.reason || 'JOIN_ERROR');
          });
        });
      }

      // Emit join-room with ack callback
      socketClientService.emit('webrtc:join-room', { roomId }, (response: WebRTCJoinRoomAck) => {
        if (!isJoinedRef.current) return;
        if (!response || !response.success) {
          safeSetState(() => {
            setConnectionState('failed');
            setError(response?.error || 'JOIN_REJECTED');
          });
          return;
        }

        const existingPeer = response.existingParticipants?.[0];
        if (existingPeer) {
          // Peer already present in room
          if (role === 'TRAINER') {
            // Trainer joins second -> Trainer initiates offer to existing Client
            createAndSendOffer(existingPeer.socketId);
          } else {
            // Client joins second -> Client waits for Trainer offer
            safeSetState(() => setConnectionState('waiting'));
          }
        } else {
          // First to join -> wait for peer
          safeSetState(() => setConnectionState('waiting'));
        }
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'JOIN_FAILED';
      safeSetState(() => {
        setConnectionState('failed');
        setError(msg);
      });
    }
  }, [
    consultationId,
    role,
    token,
    safeSetState,
    createAndSendOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    cleanupPeerConnection,
  ]);

  const toggleMicrophone = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      if (audioTracks.length > 0) {
        const nextEnabled = !audioTracks[0].enabled;
        audioTracks.forEach((track) => {
          track.enabled = nextEnabled;
        });
        safeSetState(() => setIsMuted(!nextEnabled));
      }
    }
  }, [safeSetState]);

  const toggleCamera = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      if (videoTracks.length > 0) {
        const nextEnabled = !videoTracks[0].enabled;
        videoTracks.forEach((track) => {
          track.enabled = nextEnabled;
        });
        safeSetState(() => setIsVideoOff(!nextEnabled));
      }
    }
  }, [safeSetState]);

  useEffect(() => {
    isMountedRef.current = true;
    if (autoJoin) {
      join();
    }
    return () => {
      isMountedRef.current = false;
      leave();
    };
  }, [autoJoin]);

  return {
    localStream,
    remoteStream,
    connectionState,
    isMuted,
    isVideoOff,
    error,
    join,
    leave,
    toggleMicrophone,
    toggleCamera,
  };
}
