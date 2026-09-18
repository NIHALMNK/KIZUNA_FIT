'use client';

import React from 'react';
import { Activity, Dumbbell, Utensils } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../../../../shared/components/ui/Button';

interface ProgressEmptyStateProps {
  title?: string;
  description?: string;
  isTrainer?: boolean;
}

export const ProgressEmptyState: React.FC<ProgressEmptyStateProps> = ({
  title = 'No Progress Logged Yet',
  description = 'As workouts and nutrition days are completed, detailed adherence graphs, volume trends, and coaching period analytics will automatically populate here.',
  isTrainer = false,
}) => {
  return (
    <div className="p-10 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
        <Activity className="w-7 h-7 animate-pulse" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-base font-bold text-[var(--color-heading)]">{title}</h3>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
      </div>

      {!isTrainer && (
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/client/workouts">
            <Button size="sm" className="gap-2 rounded-xl text-xs font-semibold">
              <Dumbbell className="w-3.5 h-3.5" />
              Go to Workouts
            </Button>
          </Link>
          <Link href="/client/nutrition">
            <Button variant="outline" size="sm" className="gap-2 rounded-xl text-xs font-semibold">
              <Utensils className="w-3.5 h-3.5" />
              Log Nutrition
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
