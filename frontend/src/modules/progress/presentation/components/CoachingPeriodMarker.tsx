'use client';

import React from 'react';
import { Calendar, User, ShieldCheck } from 'lucide-react';
import { CoachingPeriod } from '../../domain/types/progress.types';

interface CoachingPeriodMarkerProps {
  periods?: CoachingPeriod[];
  currentRelationshipId?: string | null;
}

export const CoachingPeriodMarker: React.FC<CoachingPeriodMarkerProps> = ({
  periods = [],
  currentRelationshipId,
}) => {
  if (!periods || periods.length === 0) return null;

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          Coaching History & Trainer Periods
        </h4>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {periods.map((period) => {
          const isScoped = currentRelationshipId === period.relationshipId;
          const isActive = period.status === 'ACTIVE';

          return (
            <div
              key={period.relationshipId}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border text-xs transition-all ${
                isScoped
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xs'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-alt)]'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-[var(--color-heading)]">
                <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                <span>Trainer: {period.trainerId.slice(0, 8)}...</span>
              </div>

              <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                <Calendar className="w-3 h-3 text-[var(--color-text-muted)]" />
                <span>
                  {formatDate(period.periodStart)} –{' '}
                  {period.periodEnd ? formatDate(period.periodEnd) : 'Present'}
                </span>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                }`}
              >
                {period.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
