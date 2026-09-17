'use client';

import React, { useState } from 'react';
import { TrainerRequestResponseDTO } from '@/modules/marketplace/domain/types';
import { useWithdrawTrainerRequest } from '@/modules/marketplace/application/useMarketplace';
import {
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Target,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

interface Stage3RequestPendingProps {
  request: TrainerRequestResponseDTO;
}

export const Stage3RequestPending: React.FC<Stage3RequestPendingProps> = ({ request }) => {
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const withdrawMutation = useWithdrawTrainerRequest();

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync(request.requestId);
      setShowWithdrawConfirm(false);
    } catch {
      // Toast handled by mutation hook
    }
  };

  const rawStatus = (request.requestStatus || request.status || 'PENDING').toUpperCase();
  const isAccepted = rawStatus === 'REQUEST_ACCEPTED' || rawStatus === 'ACCEPTED';
  const trainerName = request.trainerSnapshot?.fullName || 'Requested Coach';

  const formattedDate = request.submittedAt
    ? new Date(request.submittedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Recently';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Status Banner */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                isAccepted
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {isAccepted ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--color-text-muted)]">
                  Ref: {request.requestId.slice(-8)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                    isAccepted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rawStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[var(--color-heading)] mt-0.5">
                {isAccepted
                  ? 'Coaching Proposal Accepted!'
                  : 'Proposal Sent — Awaiting Coach Response'}
              </h2>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {isAccepted
            ? `${trainerName} has accepted your proposal! The next step is scheduling your 1-on-1 intake consultation.`
            : `Your coaching proposal has been delivered to ${trainerName}. Coaches typically review goals and respond within 24 hours.`}
        </p>

        {/* Coach Snapshot */}
        <div className="flex items-center gap-3.5 p-4 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
          <div className="relative w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
            {request.trainerSnapshot?.profileImage ? (
              <Image
                src={request.trainerSnapshot.profileImage}
                alt={trainerName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-[var(--color-text-muted)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)] truncate">
              {trainerName}
            </h3>
            {request.trainerSnapshot?.headline && (
              <p className="text-xs text-[var(--color-text-secondary)] truncate">
                {request.trainerSnapshot.headline}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--color-text-muted)]">
              <Calendar className="w-3 h-3" />
              <span>Submitted: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Proposal Details */}
        <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[var(--color-primary)]" />
              Primary Goal
            </span>
            <p className="text-xs sm:text-sm font-medium text-[var(--color-heading)] bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)]">
              {request.goal}
            </p>
          </div>

          {request.message && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Personal Message
              </span>
              <p className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)] leading-relaxed">
                {request.message}
              </p>
            </div>
          )}
        </div>

        {/* Actions: Withdraw */}
        {!isAccepted && (
          <div className="pt-2 border-t border-[var(--color-border)]">
            {!showWithdrawConfirm ? (
              <button
                type="button"
                onClick={() => setShowWithdrawConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span>Withdraw Request</span>
              </button>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Are you sure you want to withdraw this proposal? You can choose a different
                    coach afterwards.
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawConfirm(false)}
                    disabled={withdrawMutation.isPending}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[var(--color-text-secondary)] hover:bg-white border border-[var(--color-border)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={withdrawMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-xs transition-all"
                  >
                    {withdrawMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>Confirm Withdraw</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
