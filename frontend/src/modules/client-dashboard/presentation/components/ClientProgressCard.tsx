'use client';

import React from 'react';
import Link from 'next/link';
import { Dumbbell, Utensils } from 'lucide-react';
import { useClientProgress } from '../../../progress/application/hooks/useClientProgress';
import { Button } from '../../../../shared/components/ui/Button';

export const ClientProgressCard: React.FC = () => {
  const { data, isLoading, isError } = useClientProgress({ granularity: 'weekly' });

  const latestWorkout = data?.workout?.[data.workout.length - 1];
  const latestNutrition = data?.nutrition?.[data.nutrition.length - 1];

  const totalSessionsCompleted =
    data?.workout.reduce((sum, b) => sum + b.sessionsCompleted, 0) ?? 0;
  const totalNutritionDays = data?.nutrition.reduce((sum, b) => sum + b.daysCompleted, 0) ?? 0;

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          RECENT PROGRESS
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
          Analytics
        </span>
      </div>

      {isLoading ? (
        <div className="py-2 space-y-2">
          <div className="h-4 w-3/4 bg-[var(--color-surface-alt)] rounded-lg animate-pulse" />
          <div className="h-3 w-1/2 bg-[var(--color-surface-alt)] rounded-lg animate-pulse" />
        </div>
      ) : isError || !data || (totalSessionsCompleted === 0 && totalNutritionDays === 0) ? (
        <div className="py-2 space-y-1.5">
          <p className="text-sm font-bold text-[var(--color-heading)]">No progress logged yet</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Complete workouts and log your nutrition to track your progress over time.
          </p>
        </div>
      ) : (
        <div className="space-y-3 py-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[var(--color-heading)]">
                  {latestWorkout ? latestWorkout.sessionsCompleted : '—'}
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                  Workouts this week
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[var(--color-heading)]">
                  {latestNutrition ? latestNutrition.daysCompleted : '—'}
                </div>
                <div className="text-[10px] text-[var(--color-text-secondary)] font-medium">
                  Nutrition days
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--color-text-secondary)]">
            Total of{' '}
            <strong className="text-[var(--color-heading)]">
              {totalSessionsCompleted} workouts
            </strong>{' '}
            and{' '}
            <strong className="text-[var(--color-heading)]">
              {totalNutritionDays} nutrition days
            </strong>{' '}
            tracked.
          </p>
        </div>
      )}

      <Link href="/client/progress">
        <Button
          variant="outline"
          size="md"
          fullWidth
          className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
        >
          View Full Analytics
        </Button>
      </Link>
    </div>
  );
};
