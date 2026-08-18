'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useWebRTCConsultation } from '../../application/hooks/useWebRTCConsultation';
import { useCompleteConsultation } from '../../application/hooks/useConsultationMutations';
import { Button } from '@/shared/components/ui/Button';
import { Dialog, DialogFooter } from '@/shared/components/ui/Dialog';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROUTES } from '@/shared/constants/routes';

export interface ConsultationVideoRoomProps {
  consultation: {
    id?: string;
    consultationId?: string;
    clientId: string;
    trainerId: string;
    roomId?: string;
    status: string;
  };
  role: 'CLIENT' | 'TRAINER';
  currentUserId: string;
  peerName?: string;
  peerAvatarUrl?: string;
  onLeave?: () => void;
  onCompleted?: () => void;
}

/**
 * Custom hook analyzing local microphone audio amplitude using Web Audio API AnalyserNode.
 * Does NOT modify WebRTC signaling.
 */
function useAudioActivity(stream: MediaStream | null, isMuted: boolean): number {
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || isMuted) {
      setAudioLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0 || !audioTracks[0].enabled) {
      setAudioLevel(0);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;

      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((average / 128) * 100));

        setAudioLevel(normalized);
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch {
      // Ignore Web Audio API initialization errors gracefully
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (source) {
        source.disconnect();
      }
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, [stream, isMuted]);

  return audioLevel;
}

export const ConsultationVideoRoom: React.FC<ConsultationVideoRoomProps> = ({
  consultation,
  role,
  currentUserId,
  peerName,
  peerAvatarUrl,
  onLeave,
  onCompleted,
}) => {
  const router = useRouter();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState<boolean>(false);
  const [isRemoteVideoRendering, setIsRemoteVideoRendering] = useState<boolean>(false);

  const targetConsultationId = consultation.id || consultation.consultationId || '';

  const completeConsultationMutation = useCompleteConsultation();

  const {
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
  } = useWebRTCConsultation({
    consultationId: targetConsultationId,
    userId: currentUserId,
    role,
    autoJoin: true,
  });

  // Calculate local microphone audio level using AnalyserNode
  const localAudioLevel = useAudioActivity(localStream, isMuted);

  // Ref callback to guarantee immediate srcObject assignment and playback on local preview video mount
  const setLocalVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      localVideoRef.current = node;
      if (node && localStream) {
        node.srcObject = localStream;
        node.muted = true;
        node.play().catch(() => {});
      }
    },
    [localStream],
  );

  // Synchronize localStream when localStream updates
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.muted = true;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Ref callback to guarantee immediate srcObject assignment and unmuted audio playback on remote video mount
  const setRemoteVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      remoteVideoRef.current = node;
      if (node && remoteStream) {
        node.srcObject = remoteStream;
        node.muted = false; // CRITICAL: Ensure remote audio playback is unmuted
        node
          .play()
          .then(() => {
            setIsRemoteVideoRendering(true);
          })
          .catch(() => {
            // Autoplay handled by browser media policies or user gesture
          });
      }
    },
    [remoteStream],
  );

  // Synchronize remoteStream when remoteStream updates
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.muted = false;
      remoteVideoRef.current
        .play()
        .then(() => {
          setIsRemoteVideoRendering(true);
        })
        .catch(() => {});
    } else if (!remoteStream) {
      setIsRemoteVideoRendering(false);
    }
  }, [remoteStream]);

  const handleLeave = () => {
    leave();
    if (onLeave) {
      onLeave();
    } else {
      const redirectUrl =
        role === 'TRAINER'
          ? ROUTES.TRAINER_CONSULTATION_DETAIL(targetConsultationId)
          : ROUTES.CLIENT_CONSULTATION_DETAIL(targetConsultationId);
      router.push(redirectUrl);
    }
  };

  const handleConfirmComplete = async () => {
    try {
      await completeConsultationMutation.mutateAsync(targetConsultationId);
      setIsCompleteDialogOpen(false);
      leave();
      if (onCompleted) {
        onCompleted();
      } else {
        router.push(ROUTES.TRAINER_CONSULTATION_DETAIL(targetConsultationId));
      }
    } catch {
      // Error handled by useCompleteConsultation toast notification
    }
  };

  const displayPeerName =
    peerName ||
    (role === 'CLIENT' ? 'Assigned Trainer' : `Client #${consultation.clientId.slice(0, 8)}`);

  // Require ACTUAL remote stream and video rendering before declaring LIVE
  const hasLiveRemoteTracks =
    remoteStream !== null &&
    remoteStream.getTracks().some((t) => t.readyState === 'live' || t.enabled);

  const isLiveConnected =
    connectionState === 'connected' && hasLiveRemoteTracks && isRemoteVideoRendering;

  const renderBadge = () => {
    if (isLiveConnected) {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          LIVE CONNECTED
        </span>
      );
    }
    if (connectionState === 'connected' && !isRemoteVideoRendering) {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          WAITING FOR MEDIA...
        </span>
      );
    }
    if (connectionState === 'connecting') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          CONNECTING...
        </span>
      );
    }
    if (connectionState === 'waiting') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 flex items-center gap-1.5 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          WAITING FOR PARTICIPANT
        </span>
      );
    }
    if (connectionState === 'evicted') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
          <AlertTriangle className="h-3 w-3" />
          EVICTED (NEW TAB OPENED)
        </span>
      );
    }
    if (connectionState === 'failed') {
      return (
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 flex items-center gap-1.5 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
          <AlertTriangle className="h-3 w-3" />
          CONNECTION FAILED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-full">
        INITIALIZING
      </span>
    );
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Session Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar
            src={peerAvatarUrl}
            fallback={displayPeerName.slice(0, 2).toUpperCase()}
            size="md"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {renderBadge()}
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {role} ROOM
              </span>
            </div>
            <h1 className="text-base font-bold text-[var(--color-heading)]">
              Consultation with {displayPeerName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Trainer-Only Complete Consultation Action */}
          {role === 'TRAINER' ? (
            <Button
              variant="success"
              size="sm"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1.5"
              onClick={() => setIsCompleteDialogOpen(true)}
            >
              <CheckCircle className="h-4 w-4" />
              Complete Consultation
            </Button>
          ) : null}

          <Button
            variant="outline"
            size="sm"
            className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10 flex items-center gap-1.5"
            onClick={handleLeave}
          >
            <PhoneOff className="h-3.5 w-3.5" />
            Leave Session
          </Button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative aspect-video w-full rounded-2xl bg-neutral-950 border border-[var(--color-border)] shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Remote Video Viewport - NOT MIRRORED / MUTED FALSE FOR AUDIO */}
        {connectionState === 'connected' && remoteStream ? (
          <video
            ref={setRemoteVideoRef}
            autoPlay
            playsInline
            muted={false}
            onLoadedMetadata={() => setIsRemoteVideoRendering(true)}
            onPlaying={() => setIsRemoteVideoRendering(true)}
            onError={() => setIsRemoteVideoRendering(false)}
            className={`w-full h-full object-cover transform-none scale-x-100 ${
              isRemoteVideoRendering ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Overlay when remote media is not yet rendering */}
        {!isLiveConnected ? (
          <div className="absolute inset-0 p-8 text-center space-y-4 max-w-md mx-auto flex flex-col items-center justify-center z-10 bg-neutral-950/80 backdrop-blur-sm">
            {connectionState === 'waiting' ? (
              <>
                <div className="mx-auto h-20 w-20 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 animate-pulse">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold text-white">Waiting for Participant</h2>
                <p className="text-xs text-neutral-400">
                  {role === 'TRAINER'
                    ? 'Waiting for Client to enter the consultation room...'
                    : 'Waiting for Trainer to enter the consultation room...'}
                </p>
              </>
            ) : null}

            {connectionState === 'connecting' ||
            (connectionState === 'connected' && !isRemoteVideoRendering) ? (
              <>
                <div className="mx-auto h-20 w-20 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Loader2 className="h-10 w-10 animate-spin" />
                </div>
                <h2 className="text-lg font-bold text-white">Establishing Live Video & Audio</h2>
                <p className="text-xs text-neutral-400">
                  Exchanging SDP offer/answer and rendering media...
                </p>
              </>
            ) : null}

            {connectionState === 'evicted' ? (
              <>
                <div className="mx-auto h-20 w-20 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold text-white">Tab Disconnected</h2>
                <p className="text-xs text-neutral-400">
                  This consultation was opened in another tab or window.
                </p>
              </>
            ) : null}

            {connectionState === 'failed' ? (
              <>
                <div className="mx-auto h-20 w-20 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <h2 className="text-lg font-bold text-white">Connection Failed</h2>
                <p className="text-xs text-neutral-400">
                  {error || 'Unable to connect to video session.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs text-white border-neutral-700"
                  onClick={() => join()}
                >
                  Re-try Connection
                </Button>
              </>
            ) : null}
          </div>
        ) : null}

        {/* Local Video Preview Overlay - MIRRORED */}
        <div className="absolute top-4 right-4 w-40 sm:w-48 aspect-video rounded-xl bg-neutral-900 border border-neutral-700 shadow-xl overflow-hidden flex flex-col justify-between p-2 z-20">
          {localStream && !isVideoOff ? (
            <video
              ref={setLocalVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-neutral-850 text-neutral-400 gap-1 p-2">
              <VideoOff className="h-5 w-5 text-neutral-500" />
              <span className="text-[10px] font-semibold">Camera Off</span>
            </div>
          )}

          {/* Camera & Audio Activity Indicators on Local Preview */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
              YOU
            </span>

            <div className="flex items-center gap-1">
              {/* Camera Active Indicator */}
              <span
                className={`h-2 w-2 rounded-full ${
                  !isVideoOff ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'
                }`}
                title={!isVideoOff ? 'Camera ON' : 'Camera OFF'}
              />

              {/* Microphone Active Indicator */}
              {!isMuted ? (
                <Volume2 className="h-3 w-3 text-emerald-400" />
              ) : (
                <VolumeX className="h-3 w-3 text-red-400" />
              )}
            </div>
          </div>

          {/* Microphone Amplitude Waveform Bar */}
          {!isMuted && localStream && (
            <div className="relative z-10 w-full h-1 bg-neutral-800 rounded-full overflow-hidden mt-auto">
              <div
                className="h-full bg-emerald-400 transition-all duration-75"
                style={{ width: `${localAudioLevel}%` }}
              />
            </div>
          )}
        </div>

        {/* Bottom Floating Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 shadow-2xl z-30">
          <button
            type="button"
            onClick={toggleMicrophone}
            aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-3 rounded-full transition-colors ${
              isMuted
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
            }`}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={toggleCamera}
            aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
            className={`p-3 rounded-full transition-colors ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40'
                : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
            }`}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </button>

          <div className="h-6 w-px bg-neutral-700 mx-1" />

          <button
            type="button"
            onClick={handleLeave}
            aria-label="Leave session"
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Trainer Confirmation Modal for Business Completion */}
      {role === 'TRAINER' ? (
        <Dialog
          isOpen={isCompleteDialogOpen}
          onClose={() => setIsCompleteDialogOpen(false)}
          title="Complete Consultation"
          description="Are you sure you want to mark this consultation as completed? This is a business action that will conclude the session and enable creating a Coaching Offer."
        >
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompleteDialogOpen(false)}
              disabled={completeConsultationMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleConfirmComplete}
              disabled={completeConsultationMutation.isPending}
            >
              {completeConsultationMutation.isPending ? 'Completing...' : 'Confirm Completion'}
            </Button>
          </DialogFooter>
        </Dialog>
      ) : null}
    </div>
  );
};
