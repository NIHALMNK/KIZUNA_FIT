'use client';

import React from 'react';
import { CoachingOfferStatus } from '../../domain/types/offer.types';

interface OfferStatusBadgeProps {
  status: CoachingOfferStatus;
  className?: string;
}

export const OfferStatusBadge: React.FC<OfferStatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusStyles = () => {
    switch (status) {
      case CoachingOfferStatus.DRAFT:
        return 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
      case CoachingOfferStatus.SENT:
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case CoachingOfferStatus.ACCEPTED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case CoachingOfferStatus.DECLINED:
        return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      case CoachingOfferStatus.EXPIRED:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case CoachingOfferStatus.DRAFT:
        return 'Draft';
      case CoachingOfferStatus.SENT:
        return 'Sent (Pending)';
      case CoachingOfferStatus.ACCEPTED:
        return 'Accepted';
      case CoachingOfferStatus.DECLINED:
        return 'Declined';
      case CoachingOfferStatus.EXPIRED:
        return 'Expired';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${getStatusStyles()} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === CoachingOfferStatus.SENT
            ? 'bg-amber-500 animate-pulse'
            : status === CoachingOfferStatus.ACCEPTED
              ? 'bg-emerald-500'
              : status === CoachingOfferStatus.DECLINED
                ? 'bg-rose-500'
                : 'bg-zinc-400'
        }`}
      />
      {getStatusLabel()}
    </span>
  );
};
