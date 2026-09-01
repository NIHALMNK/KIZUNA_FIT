'use client';

import React from 'react';
import { CoachingTimeline } from '../../domain/types/coaching.types';

interface CoachingTimelineViewProps {
  timeline: CoachingTimeline;
  createdAt: string;
}

export const CoachingTimelineView: React.FC<CoachingTimelineViewProps> = ({
  timeline,
  createdAt,
}) => {
  const events = [
    {
      label: 'Agreement Created',
      timestamp: createdAt,
      color: 'bg-zinc-400',
    },
    timeline.activatedAt && {
      label: 'Coaching Activated',
      timestamp: timeline.activatedAt,
      color: 'bg-emerald-500',
    },
    timeline.disputedAt && {
      label: 'Dispute Raised',
      timestamp: timeline.disputedAt,
      color: 'bg-orange-500',
    },
    timeline.refundedAt && {
      label: 'Refund Processed',
      timestamp: timeline.refundedAt,
      color: 'bg-purple-500',
    },
    timeline.completedAt && {
      label: 'Program Completed',
      timestamp: timeline.completedAt,
      color: 'bg-blue-500',
    },
    timeline.cancelledAt && {
      label: 'Program Cancelled',
      timestamp: timeline.cancelledAt,
      color: 'bg-rose-500',
    },
    timeline.expiredAt && {
      label: 'Program Expired',
      timestamp: timeline.expiredAt,
      color: 'bg-zinc-400',
    },
  ].filter(Boolean) as { label: string; timestamp: string; color: string }[];

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-extrabold text-[var(--color-heading)] uppercase tracking-wider">
        Lifecycle Timeline
      </h4>
      <div className="relative pl-6 border-l-2 border-[var(--color-border)] space-y-6">
        {events.map((evt, idx) => (
          <div key={idx} className="relative group">
            <div
              className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-card)] shadow-xs ${evt.color}`}
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <span className="text-xs font-bold text-[var(--color-text-primary)]">
                {evt.label}
              </span>
              <span className="text-[11px] text-[var(--color-text-secondary)] font-mono font-medium">
                {formatDate(evt.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
