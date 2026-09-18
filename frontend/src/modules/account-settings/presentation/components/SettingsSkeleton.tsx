'use client';

import React from 'react';

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-[var(--color-surface-alt)] rounded-xl" />
        <div className="h-4 w-72 bg-[var(--color-surface-alt)] rounded" />
      </div>

      {/* Card 1 Skeleton */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="h-6 w-36 bg-[var(--color-surface-alt)] rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-16 bg-[var(--color-surface-alt)] rounded-xl" />
          <div className="h-16 bg-[var(--color-surface-alt)] rounded-xl" />
          <div className="h-16 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
      </div>

      {/* Card 2 Skeleton */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="h-6 w-36 bg-[var(--color-surface-alt)] rounded" />
        <div className="h-16 bg-[var(--color-surface-alt)] rounded-xl" />
      </div>
    </div>
  );
};
