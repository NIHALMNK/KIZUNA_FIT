'use client';

import React from 'react';

export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-slate-950/80 border-r border-slate-800/80 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-slate-900" />
        <div className="space-y-1.5 flex-1">
          <div className="w-24 h-4 rounded bg-slate-900" />
          <div className="w-16 h-3 rounded bg-slate-900" />
        </div>
      </div>

      {/* Body Items Skeleton */}
      <div className="flex-1 space-y-4 py-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-2xl bg-slate-900/50">
            <div className="w-5 h-5 rounded-lg bg-slate-900" />
            <div className="w-32 h-4 rounded bg-slate-900" />
          </div>
        ))}
      </div>

      {/* Footer User Card Skeleton */}
      <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900" />
        <div className="space-y-1.5 flex-1">
          <div className="w-28 h-3.5 rounded bg-slate-900" />
          <div className="w-20 h-3 rounded bg-slate-900" />
        </div>
      </div>
    </div>
  );
};
