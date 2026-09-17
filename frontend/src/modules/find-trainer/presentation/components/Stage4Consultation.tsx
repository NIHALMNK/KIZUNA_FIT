'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ConsultationResponseDTO,
  ConsultationStatus,
} from '@/modules/consultation/domain/types/consultation.types';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { BookSlotModal } from '@/modules/consultation/presentation/components/BookSlotModal';
import { CancelConsultationModal } from '@/modules/consultation/presentation/components/CancelConsultationModal';
import { ROUTES } from '@/shared/constants/routes';
import {
  Video,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';

interface Stage4ConsultationProps {
  consultation: ConsultationResponseDTO;
}

export const Stage4Consultation: React.FC<Stage4ConsultationProps> = ({ consultation }) => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  } | null>(null);

  const { data: trainerProfile } = useGetPublicTrainerProfile(consultation.trainerId);

  const displayName =
    trainerProfile?.fullName || trainerProfile?.trainerName || trainerProfile?.name || 'Your Coach';

  const scheduledStart = consultation.slot?.scheduledStartAt;
  const isScheduled =
    consultation.status === ConsultationStatus.SCHEDULED ||
    consultation.status === ConsultationStatus.SLOT_BOOKED;
  const isNeedsBooking =
    consultation.status === ConsultationStatus.CREATED && !consultation.slot?.scheduledStartAt;

  // Countdown calculation
  useEffect(() => {
    if (!scheduledStart) return;

    const calculateTime = () => {
      const diff = new Date(scheduledStart).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [scheduledStart]);

  const formattedDate = scheduledStart
    ? new Date(scheduledStart).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  const formattedTime = scheduledStart
    ? new Date(scheduledStart).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs space-y-6">
        {/* Header with status badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[var(--color-text-muted)]">
                  Session: {consultation.consultationId.slice(-8)}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-blue-100 text-blue-800">
                  {consultation.status.replace(/_/g, ' ')}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[var(--color-heading)] mt-0.5">
                {isNeedsBooking ? 'Book Your 1-on-1 Consultation' : 'Upcoming Consultation Session'}
              </h2>
            </div>
          </div>
        </div>

        {/* Coach card */}
        <div className="flex items-center gap-3.5 p-4 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)]">
          <div className="relative w-12 h-12 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shrink-0 flex items-center justify-center">
            {trainerProfile?.avatarUrl ? (
              <Image
                src={trainerProfile.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-[var(--color-text-muted)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)] truncate">
              {displayName}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] truncate">
              {trainerProfile?.headline || 'Coach & Fitness Consultant'}
            </p>
          </div>
        </div>

        {/* Scheduled details & countdown */}
        {isScheduled && formattedDate && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                    Date
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)]">
                    {formattedDate}
                  </span>
                </div>
              </div>

              <div className="bg-[var(--color-surface-alt)] p-4 rounded-xl border border-[var(--color-border)] flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-[var(--color-text-muted)]">
                    Time ({consultation.slot?.timezone || 'Local'})
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[var(--color-heading)]">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Banner */}
            {timeLeft && !timeLeft.isPast && (
              <div className="bg-gradient-to-r from-blue-500/10 to-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Session Starts In
                </span>
                <div className="flex items-center justify-center gap-2 font-mono text-base sm:text-lg font-black text-[var(--color-heading)]">
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
          {isNeedsBooking ? (
            <button
              type="button"
              onClick={() => setIsBookModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold bg-[var(--color-primary)] text-white hover:opacity-95 shadow-xs transition-all active:scale-[0.99]"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation Slot</span>
            </button>
          ) : (
            <>
              {/* Join Room CTA */}
              <Link
                href={ROUTES.CLIENT_CONSULTATION_ROOM(consultation.consultationId)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs sm:text-sm font-extrabold bg-[var(--color-primary)] text-white hover:opacity-95 shadow-xs transition-all active:scale-[0.99]"
              >
                <Video className="w-4 h-4" />
                <span>Join Video Room</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Link>

              {/* Secondary Actions: Reschedule & Cancel */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-heading)] hover:bg-[var(--color-surface-alt)] border border-[var(--color-border)] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCancelModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition-all"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancel Session</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals for Booking / Rescheduling and Canceling */}
      {isBookModalOpen && (
        <BookSlotModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          consultationId={consultation.consultationId}
          initialStartAt={consultation.slot?.scheduledStartAt}
          initialTimezone={consultation.slot?.timezone}
        />
      )}

      {isCancelModalOpen && (
        <CancelConsultationModal
          isOpen={isCancelModalOpen}
          onClose={() => setIsCancelModalOpen(false)}
          consultationId={consultation.consultationId}
        />
      )}
    </div>
  );
};
