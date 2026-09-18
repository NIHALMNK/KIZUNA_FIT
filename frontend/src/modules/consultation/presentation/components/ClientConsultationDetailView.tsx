import React, { useState } from 'react';
import Link from 'next/link';
import { useConsultationDetail } from '../../application/hooks/useConsultationQueries';
import { useConfirmSchedule } from '../../application/hooks/useConsultationMutations';
import { ConsultationStatus } from '../../domain/types/consultation.types';
import { ConsultationStatusBadge } from './ConsultationStatusBadge';
import { BookSlotModal } from './BookSlotModal';
import { ScheduleConsultationModal } from './ScheduleConsultationModal';
import { CancelConsultationModal } from './CancelConsultationModal';
import { RescheduleConsultationModal } from './RescheduleConsultationModal';
import { SwitchTrainerModal } from '../../../marketplace/presentation/components/SwitchTrainerModal';
import { useGetPublicTrainerProfile } from '../../../profile/presentation/hooks/usePublicTrainers';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { ErrorState } from '../../../../shared/components/feedback/ErrorState';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';
import { ROUTES } from '../../../../shared/constants/routes';

interface ClientConsultationDetailViewProps {
  consultationId: string;
}

export const ClientConsultationDetailView: React.FC<ClientConsultationDetailViewProps> = ({
  consultationId,
}) => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const { data: consultation, isLoading, isError, refetch } = useConsultationDetail(consultationId);
  const { data: trainerProfile, isLoading: isLoadingTrainer } = useGetPublicTrainerProfile(
    consultation?.trainerId || '',
  );

  const confirmScheduleMutation = useConfirmSchedule();

  if (isLoading) {
    return <LoadingState message="Loading consultation details..." count={2} />;
  }

  if (isError || !consultation) {
    return (
      <ErrorState
        title="Consultation Not Found"
        message="The requested consultation record could not be loaded."
        onRetry={() => refetch()}
      />
    );
  }

  const formatIso = (isoString?: string | null) => {
    if (!isoString) return { date: 'N/A', time: 'N/A' };
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  const slotStart = formatIso(consultation.slot.scheduledStartAt);
  const slotEnd = formatIso(consultation.slot.scheduledEndAt);
  const isTerminal =
    consultation.status === ConsultationStatus.COMPLETED ||
    consultation.status === ConsultationStatus.NO_SHOW ||
    consultation.status === ConsultationStatus.CANCELLED;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link href={ROUTES.CLIENT_CONSULTATIONS}>
          <Button variant="ghost" size="sm" className="text-xs text-[var(--color-text-secondary)]">
            &larr; Back to My Consultations
          </Button>
        </Link>
        <ConsultationStatusBadge status={consultation.status} />
      </div>

      {/* Main Detail Hero Card */}
      <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-6">
        {/* Trainer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <Avatar
              src={trainerProfile?.avatarUrl || undefined}
              fallback={trainerProfile?.fullName?.slice(0, 2) || 'TR'}
              size="lg"
            />

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
                YOUR ASSIGNED COACH
              </span>
              <h1 className="text-xl font-bold text-[var(--color-heading)]">
                {isLoadingTrainer
                  ? 'Loading Profile...'
                  : trainerProfile?.fullName || 'Assigned Coach'}
              </h1>
              {trainerProfile?.headline && (
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  {trainerProfile.headline}
                </p>
              )}
            </div>
          </div>

          {trainerProfile?.userId && (
            <Link href={ROUTES.PUBLIC_TRAINER_DETAILS(trainerProfile.userId)}>
              <Button variant="outline" size="sm" className="text-xs">
                View Coach Profile
              </Button>
            </Link>
          )}
        </div>

        {/* Schedule & Timing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Scheduled Date & Time
            </span>
            <div>
              <p className="text-base font-bold text-[var(--color-text-primary)]">
                {slotStart.date}
              </p>
              <p className="text-sm font-bold text-[var(--color-primary)]">
                {slotStart.time} - {slotEnd.time} ({consultation.slot.timezone})
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-2">
            <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Meeting Platform & Room ID
            </span>
            <div>
              <p className="text-base font-bold text-[var(--color-text-primary)]">
                {consultation.platform || 'WEBRTC Video Call'}
              </p>
              <p className="text-xs font-mono text-[var(--color-text-secondary)] mt-1">
                Room ID: {consultation.roomId}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions / Cancellation Details if applicable */}
        {consultation.meetingDetails?.instructions && (
          <div className="p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] space-y-1 text-xs">
            <span className="font-bold text-[var(--color-text-primary)]">
              Meeting Instructions:
            </span>
            <p className="text-[var(--color-text-secondary)]">
              {consultation.meetingDetails.instructions}
            </p>
          </div>
        )}

        {consultation.status === ConsultationStatus.CANCELLED && consultation.cancellation && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs space-y-1">
            <span className="font-bold text-red-500">
              Cancelled by {consultation.cancellation.cancelledBy} on{' '}
              {formatIso(consultation.cancellation.cancelledAt).date}:
            </span>
            <p className="text-red-400">
              {consultation.cancellation.reason || 'No cancellation reason provided.'}
            </p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--color-border)]">
          <div className="text-xs text-[var(--color-text-secondary)]">
            Consultation ID:{' '}
            <span className="font-mono text-[11px]">{consultation.consultationId}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            {!isTerminal && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-amber-400 border-amber-500/40 hover:bg-amber-500/10"
                  onClick={() => setIsSwitchModalOpen(true)}
                >
                  Switch Coach
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
                  onClick={() => setIsCancelModalOpen(true)}
                >
                  Cancel Session
                </Button>
              </>
            )}

            {consultation.status === ConsultationStatus.CREATED && (
              <Button variant="primary" size="sm" onClick={() => setIsBookModalOpen(true)}>
                Book Preferred Slot
              </Button>
            )}

            {consultation.status === ConsultationStatus.SLOT_BOOKED && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(true)}>
                  Reschedule
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={confirmScheduleMutation.isPending}
                  onClick={() => confirmScheduleMutation.mutate(consultation.consultationId)}
                >
                  Confirm Schedule
                </Button>
              </>
            )}

            {consultation.status === ConsultationStatus.SCHEDULED && (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsRescheduleModalOpen(true)}>
                  Reschedule
                </Button>
                <Link href={ROUTES.CLIENT_CONSULTATION_ROOM(consultation.consultationId)}>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    Join Live Session
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookSlotModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        consultationId={consultation.consultationId}
        initialStartAt={consultation.slot.scheduledStartAt}
        initialTimezone={consultation.slot.timezone}
      />

      <ScheduleConsultationModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        consultationId={consultation.consultationId}
        initialStartAt={consultation.slot.scheduledStartAt}
        initialTimezone={consultation.slot.timezone}
        initialPlatform={consultation.platform}
      />

      <CancelConsultationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        consultationId={consultation.consultationId}
      />

      <RescheduleConsultationModal
        isOpen={isRescheduleModalOpen}
        onClose={() => setIsRescheduleModalOpen(false)}
        consultationId={consultation.consultationId}
        initialStartAt={consultation.slot.scheduledStartAt}
        initialTimezone={consultation.slot.timezone}
      />

      <SwitchTrainerModal isOpen={isSwitchModalOpen} onClose={() => setIsSwitchModalOpen(false)} />
    </div>
  );
};
