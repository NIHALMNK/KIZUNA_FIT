'use client';

import React from 'react';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';

interface CoachingStatusBadgeProps {
  status: CoachingRelationshipStatus;
  className?: string;
}

export const CoachingStatusBadge: React.FC<CoachingStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case CoachingRelationshipStatus.ACTIVE:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
          dot: 'bg-emerald-500 animate-pulse',
          label: 'Active',
        };
      case CoachingRelationshipStatus.PENDING:
        return {
          bg: 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400',
          dot: 'bg-amber-500',
          label: 'Pending',
        };
      case CoachingRelationshipStatus.COMPLETED:
        return {
          bg: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
          dot: 'bg-blue-500',
          label: 'Completed',
        };
      case CoachingRelationshipStatus.CANCELLED:
        return {
          bg: 'bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400',
          dot: 'bg-rose-500',
          label: 'Cancelled',
        };
      case CoachingRelationshipStatus.REFUNDED:
        return {
          bg: 'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
          dot: 'bg-purple-500',
          label: 'Refunded',
        };
      case CoachingRelationshipStatus.DISPUTED:
        return {
          bg: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
          dot: 'bg-orange-500 animate-pulse',
          label: 'Disputed',
        };
      case CoachingRelationshipStatus.EXPIRED:
        return {
          bg: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
          dot: 'bg-zinc-500',
          label: 'Expired',
        };
      default:
        return {
          bg: 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20 dark:text-zinc-400',
          dot: 'bg-zinc-500',
          label: status,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
