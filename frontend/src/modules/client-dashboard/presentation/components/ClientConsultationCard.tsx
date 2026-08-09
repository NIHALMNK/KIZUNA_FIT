'use client';

import React from 'react';
import Link from 'next/link';
import { ConsultationItem } from '../../domain/types/clientDashboard.types';
import { Button } from '../../../../shared/components/ui/Button';

interface ClientConsultationCardProps {
  consultations?: ConsultationItem[];
}

export const ClientConsultationCard: React.FC<ClientConsultationCardProps> = ({ consultations = [] }) => {
  const nextConsultation = consultations[0];

  const formatScheduledDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { day: dateStr, time: '' };
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          NEXT CONSULTATION
        </span>
        {nextConsultation && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
            Scheduled
          </span>
        )}
      </div>

      {nextConsultation ? (
        <div className="space-y-3">
          <div>
            <span className="text-lg font-extrabold text-[var(--color-heading)] block">
              {formatScheduledDate(nextConsultation.scheduledAt).day}
            </span>
            <span className="text-xs font-semibold text-[var(--color-primary)]">
              {formatScheduledDate(nextConsultation.scheduledAt).time}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs space-y-1">
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Trainer</span>
              <span className="font-bold text-[var(--color-text-primary)]">
                {nextConsultation.trainerName || 'Assigned Coach'}
              </span>
            </div>
            <div className="flex items-center justify-between text-[var(--color-text-secondary)]">
              <span>Duration</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {nextConsultation.durationMinutes} min • {nextConsultation.meetingMode || 'Video Call'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-2 space-y-1.5">
          <p className="text-sm font-bold text-[var(--color-heading)]">No upcoming consultations</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Schedule a 1-on-1 video call with a coach to align on your fitness goals.
          </p>
        </div>
      )}

      <Link href="/client/consultations">
        <Button
          variant="outline"
          size="md"
          fullWidth
          className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
        >
          View Consultations
        </Button>
      </Link>
    </div>
  );
};
