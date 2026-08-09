'use client';

import React from 'react';

export const ClientDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Loading dashboard content">
      {/* Welcome Skeleton */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-28 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-alt)] shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="w-32 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-48 h-5 bg-[var(--color-surface-alt)] rounded" />
        </div>
      </div>

      {/* Hero Coaching & Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-7 h-64 space-y-4">
          <div className="w-24 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-64 h-6 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-12 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-36 h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-64 space-y-4">
          <div className="w-24 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-40 h-5 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-20 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
      </div>

      {/* Grid: Workouts & Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-52 space-y-3">
          <div className="w-28 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-44 h-5 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-52 space-y-3">
          <div className="w-28 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-44 h-5 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
      </div>

      {/* Grid: Progress & Consultation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-52 space-y-3">
          <div className="w-28 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-44 h-5 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 h-52 space-y-3">
          <div className="w-28 h-3 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-44 h-5 bg-[var(--color-surface-alt)] rounded" />
          <div className="w-full h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>
      </div>
    </div>
  );
};
