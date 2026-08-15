import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading content...', count = 3 }) => {
  return (
    <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-6 my-4 animate-pulse shadow-sm">
      <div className="flex items-center space-x-4 mb-6">
        <div className="rounded-full bg-[var(--color-surface-alt)] h-14 w-14"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-[var(--color-surface-alt)] rounded w-1/3"></div>
          <div className="h-3 bg-[var(--color-surface-alt)] rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-[var(--color-surface-alt)] rounded w-full"></div>
        ))}
      </div>
      <p className="mt-4 text-xs text-[var(--color-text-muted)] text-center">{message}</p>
    </div>
  );
};

