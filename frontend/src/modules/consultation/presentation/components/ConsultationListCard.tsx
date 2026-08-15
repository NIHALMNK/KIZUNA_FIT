import React from 'react';
import Link from 'next/link';
import { ConsultationResponseDTO, ConsultationStatus } from '../../domain/types/consultation.types';
import { ConsultationStatusBadge } from './ConsultationStatusBadge';
import { useGetPublicTrainerProfile } from '../../../profile/presentation/hooks/usePublicTrainers';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';
import { ROUTES } from '../../../../shared/constants/routes';

interface ConsultationListCardProps {
  consultation: ConsultationResponseDTO;
  role?: 'CLIENT' | 'TRAINER';
  onBookSlotClick?: (consultation: ConsultationResponseDTO) => void;
  onCancelClick?: (consultation: ConsultationResponseDTO) => void;
}

export const ConsultationListCard: React.FC<ConsultationListCardProps> = ({
  consultation,
  role = 'CLIENT',
  onBookSlotClick,
  onCancelClick,
}) => {
  const isTrainer = role === 'TRAINER';

  const { data: trainerProfile, isLoading: isLoadingTrainer } = useGetPublicTrainerProfile(
    consultation.trainerId,
  );

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: isoString, time: '' };
    }
  };

  const slotTimes = formatDate(consultation.slot.scheduledStartAt);
  const isTerminal =
    consultation.status === ConsultationStatus.COMPLETED ||
    consultation.status === ConsultationStatus.NO_SHOW ||
    consultation.status === ConsultationStatus.CANCELLED;

  const detailRoute = isTrainer
    ? ROUTES.TRAINER_CONSULTATION_DETAIL(consultation.consultationId)
    : ROUTES.CLIENT_CONSULTATION_DETAIL(consultation.consultationId);

  const roomRoute = isTrainer
    ? ROUTES.TRAINER_CONSULTATION_ROOM(consultation.consultationId)
    : ROUTES.CLIENT_CONSULTATION_ROOM(consultation.consultationId);

  return (
    <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm space-y-4 transition-all hover:border-[var(--color-primary)]/40">
      {/* Header row: Participant info & Status badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <Avatar
            src={isTrainer ? undefined : trainerProfile?.avatarUrl || undefined}
            fallback={isTrainer ? 'CL' : trainerProfile?.fullName?.slice(0, 2) || 'TR'}
            size="md"
          />

          <div>
            <h3 className="text-sm font-bold text-[var(--color-heading)]">
              {isTrainer
                ? `Client #${consultation.clientId.slice(0, 8)}`
                : isLoadingTrainer
                  ? 'Loading Coach Profile...'
                  : trainerProfile?.fullName || 'Assigned Coach'}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
              {isTrainer
                ? `Pipeline ID: ${consultation.acquisitionPipelineId}`
                : trainerProfile?.headline || 'Fitness & Wellness Coach'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <ConsultationStatusBadge status={consultation.status} />
        </div>
      </div>

      {/* Body Grid: Schedule & Meeting Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1 bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)]">
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Scheduled Date & Time
          </span>
          <p className="font-bold text-[var(--color-text-primary)]">{slotTimes.date}</p>
          <p className="font-semibold text-[var(--color-primary)]">
            {slotTimes.time} ({consultation.slot.timezone})
          </p>
        </div>

        <div className="space-y-1 bg-[var(--color-surface-alt)] p-3 rounded-xl border border-[var(--color-border)]">
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Platform & Room
          </span>
          <p className="font-semibold text-[var(--color-text-primary)]">
            {consultation.platform || 'WEBRTC Video Call'}
          </p>
          <p className="text-[var(--color-text-secondary)] truncate">
            Room: <span className="font-mono text-[11px]">{consultation.roomId}</span>
          </p>
        </div>
      </div>

      {/* Cancellation Banner if cancelled */}
      {consultation.status === ConsultationStatus.CANCELLED && consultation.cancellation && (
        <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs space-y-1">
          <span className="font-bold text-[var(--color-text-muted)]">
            Cancelled by {consultation.cancellation.cancelledBy}:
          </span>
          <p className="text-[var(--color-text-secondary)]">
            {consultation.cancellation.reason || 'No reason specified.'}
          </p>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link href={detailRoute}>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[var(--color-primary)] hover:underline"
          >
            View Consultation Details &rarr;
          </Button>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isTerminal && onCancelClick && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
              onClick={() => onCancelClick(consultation)}
            >
              Cancel
            </Button>
          )}

          {!isTrainer && consultation.status === ConsultationStatus.CREATED && onBookSlotClick && (
            <Button variant="primary" size="sm" onClick={() => onBookSlotClick(consultation)}>
              Book Preferred Slot
            </Button>
          )}

          {consultation.status === ConsultationStatus.SCHEDULED && (
            <Link href={roomRoute}>
              <Button
                variant="primary"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Join Live Session
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
