'use client';

import React from 'react';
import { useActiveCoachingRelationship } from '../../../../modules/coaching/application/queries/useActiveCoachingRelationship';
import { ClientCoachingOverview } from '../../../../modules/coaching/presentation/client/ClientCoachingOverview';
import { ClientCoachingHistory } from '../../../../modules/coaching/presentation/client/ClientCoachingHistory';
import { ActiveCoachingBanner } from '../../../../modules/coaching/presentation/client/ActiveCoachingBanner';

export default function ClientCoachingPage() {
  const { data: activeList, isLoading } = useActiveCoachingRelationship();
  const activeRelationship = activeList && activeList.length > 0 ? activeList[0] : null;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          CLIENT DASHBOARD
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          My Coaching
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Manage your active coaching relationship, check-in history, and training lifecycle.
        </p>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]" />
      ) : activeRelationship ? (
        <ClientCoachingOverview relationship={activeRelationship} />
      ) : (
        <ActiveCoachingBanner relationship={null} />
      )}

      <div className="space-y-4 pt-4 border-t border-[var(--color-border)]">
        <div>
          <h2 className="text-lg font-extrabold text-[var(--color-heading)]">Coaching History</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Archive of your previous coaching engagements and completed fitness programs.
          </p>
        </div>
        <ClientCoachingHistory />
      </div>
    </div>
  );
}
