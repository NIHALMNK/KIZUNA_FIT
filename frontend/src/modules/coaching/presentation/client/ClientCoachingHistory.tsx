'use client';

import React from 'react';
import { useCoachingHistory } from '../../application/queries/useCoachingHistory';
import { CoachingCard } from '../components/CoachingCard';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { History } from 'lucide-react';

export const ClientCoachingHistory: React.FC = () => {
  const { data, isLoading, error } = useCoachingHistory({ limit: 20 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
        Failed to load coaching history. Please try refreshing.
      </div>
    );
  }

  const items = data?.relationships || [];

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<History className="w-10 h-10 text-[var(--color-text-muted)]" />}
        title="No Coaching History"
        description="Completed, expired, or cancelled coaching contracts will appear here once your current program ends."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((rel) => (
        <CoachingCard key={rel.relationshipId} relationship={rel} role="CLIENT" />
      ))}
    </div>
  );
};
