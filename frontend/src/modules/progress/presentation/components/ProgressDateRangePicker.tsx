'use client';

import React from 'react';
import { ProgressGranularity } from '../../domain/types/progress.types';

interface ProgressDateRangePickerProps {
  granularity: ProgressGranularity;
  onGranularityChange: (g: ProgressGranularity) => void;
  preset: string;
  onPresetChange: (preset: '14d' | '30d' | '90d' | 'all') => void;
  fromDate?: string;
  toDate?: string;
  onCustomDateChange?: (from: string, to: string) => void;
}

export const ProgressDateRangePicker: React.FC<ProgressDateRangePickerProps> = ({
  granularity,
  onGranularityChange,
  preset,
  onPresetChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs">
      {/* Presets */}
      <div className="flex items-center gap-1.5 bg-[var(--color-surface-alt)] p-1 rounded-xl border border-[var(--color-border)]">
        {(
          [
            { id: '14d', label: '14 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: 'all', label: 'All History' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPresetChange(item.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              preset === item.id
                ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast,#ffffff)] shadow-xs'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Granularity */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
          Group by:
        </span>
        <div className="flex items-center gap-1 bg-[var(--color-surface-alt)] p-1 rounded-xl border border-[var(--color-border)]">
          {(
            [
              { id: 'daily', label: 'Daily' },
              { id: 'weekly', label: 'Weekly' },
              { id: 'monthly', label: 'Monthly' },
            ] as const
          ).map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onGranularityChange(g.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                granularity === g.id
                  ? 'bg-[var(--color-card)] text-[var(--color-text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
