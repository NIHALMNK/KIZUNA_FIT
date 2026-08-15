'use client';

import React from 'react';
import Link from 'next/link';
import { useConsultationDetail } from '@/modules/consultation/application/hooks/useConsultationQueries';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { Button } from '@/shared/components/ui/Button';
import { Avatar } from '@/shared/components/ui/Avatar';
import { ROUTES } from '@/shared/constants/routes';

export default function TrainerConsultationRoomPage({
  params,
}: {
  params: Promise<{ consultationId: string }>;
}) {
  const { consultationId } = React.use(params);

  const { data: consultation, isLoading, isError, refetch } = useConsultationDetail(consultationId);

  if (isLoading) {
    return <LoadingState message="Connecting to client consultation session..." count={2} />;
  }

  if (isError || !consultation) {
    return (
      <ErrorState
        title="Room Unavailable"
        message="Unable to access client consultation session room."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Session Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
        <div className="flex items-center gap-3">
          <Avatar fallback="CL" size="md" />
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE SESSION READY (TRAINER PORTAL)
            </span>
            <h1 className="text-base font-bold text-[var(--color-heading)]">
              Consultation with Client #{consultation.clientId.slice(0, 8)}
            </h1>
          </div>
        </div>

        <Link href={ROUTES.TRAINER_CONSULTATION_DETAIL(consultationId)}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
          >
            Leave Session
          </Button>
        </Link>
      </div>

      {/* Video Viewport Container (Phase F5 Target) */}
      <div className="relative aspect-video w-full rounded-2xl bg-neutral-900 border border-[var(--color-border)] shadow-2xl overflow-hidden flex items-center justify-center text-center p-6">
        <div className="space-y-3 max-w-md">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
            P2P
          </div>
          <h2 className="text-lg font-bold text-white">Trainer Live Session Room</h2>
          <p className="text-xs text-neutral-400">
            WebRTC video conference signaling for room{' '}
            <span className="font-mono text-emerald-400 font-bold">{consultation.roomId}</span> will
            be initialized in Phase F5.
          </p>
        </div>
      </div>
    </div>
  );
}
