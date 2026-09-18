'use client';

import React from 'react';

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-[var(--color-sidebar)] border-r border-[var(--color-border)] animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border)]">
        <div className="w-9 h-9 rounded-xl bg-[var(--color-surface-alt)]" />
        <div className="space-y-1.5 flex-1">
          <div className="w-24 h-4 rounded bg-[var(--color-surface-alt)]" />
          <div className="w-16 h-3 rounded bg-[var(--color-surface-alt)]" />
        </div>
      </div>

      {/* Body Items Skeleton */}
      <div className="flex-1 space-y-4 py-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[var(--color-surface-alt)]/60">
            <div className="w-5 h-5 rounded-lg bg-[var(--color-surface-alt)]" />
            <div className="w-32 h-4 rounded bg-[var(--color-surface-alt)]" />
          </div>
        ))}
      </div>

      {/* Footer User Card Skeleton */}
      <div className="p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-alt)]" />
        <div className="space-y-1.5 flex-1">
          <div className="w-28 h-3.5 rounded bg-[var(--color-surface-alt)]" />
          <div className="w-20 h-3 rounded bg-[var(--color-surface-alt)]" />
        </div>
      </div>
    </div>
  );
};
