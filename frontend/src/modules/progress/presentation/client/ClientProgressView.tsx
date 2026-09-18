'use client';

import React, { useState, useMemo } from 'react';
import { Activity, RefreshCw } from 'lucide-react';
import { useClientProgress } from '../../application/hooks/useClientProgress';
import { ProgressGranularity } from '../../domain/types/progress.types';
import { ProgressDateRangePicker } from '../components/ProgressDateRangePicker';
import { ProgressSummaryStats } from '../components/ProgressSummaryStats';
import { CoachingPeriodMarker } from '../components/CoachingPeriodMarker';
import { WorkoutProgressChart } from '../components/WorkoutProgressChart';
import { NutritionProgressChart } from '../components/NutritionProgressChart';
import { ProgressEmptyState } from '../components/ProgressEmptyState';
import { Button } from '../../../../shared/components/ui/Button';

export const ClientProgressView: React.FC = () => {
  const [preset, setPreset] = useState<'14d' | '30d' | '90d' | 'all'>('30d');
  const [granularity, setGranularity] = useState<ProgressGranularity>('weekly');

  const { fromDate, toDate } = useMemo(() => {
    const end = new Date();
    let start: Date | undefined;

    if (preset === '14d') {
      start = new Date(end.getTime() - 14 * 24 * 60 * 60 * 1000);
    } else if (preset === '30d') {
      start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (preset === '90d') {
      start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else {
      start = undefined; // all time
    }

    return {
      fromDate: start ? start.toISOString().slice(0, 10) : undefined,
      toDate: end.toISOString().slice(0, 10),
    };
  }, [preset]);

  const handlePresetChange = (newPreset: '14d' | '30d' | '90d' | 'all') => {
    setPreset(newPreset);
    if (newPreset === '14d') setGranularity('daily');
    else if (newPreset === '30d' || newPreset === '90d') setGranularity('weekly');
    else setGranularity('monthly');
  };

  const { data, isLoading, isError, error, refetch, isFetching } = useClientProgress({
    fromDate,
    toDate,
    granularity,
  });

  const hasActivity = useMemo(() => {
    if (!data) return false;
    const hasWorkouts = data.workout.some((b) => b.sessionsCompleted > 0 || b.sessionsMissed > 0);
    const hasNutrition = data.nutrition.some((b) => b.daysLogged > 0 || b.daysCompleted > 0);
    return hasWorkouts || hasNutrition;
  }, [data]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              ANALYTICS & TRENDS
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-heading)]">
            My Fitness Journey
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
            Holistic progress tracking across your workouts, nutrition, and coaching history.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 rounded-xl text-xs font-semibold self-start sm:self-auto border-[var(--color-border)]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Date & Granularity Filter */}
      <ProgressDateRangePicker
        preset={preset}
        onPresetChange={handlePresetChange}
        granularity={granularity}
        onGranularityChange={setGranularity}
      />

      {/* Content states */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]"
              />
            ))}
          </div>
          <div className="h-72 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]" />
          <div className="h-72 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]" />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
          <p className="text-sm font-bold text-rose-500">
            {(error as any)?.message || 'Failed to load progress analytics.'}
          </p>
          <Button size="sm" onClick={() => refetch()} className="rounded-xl text-xs">
            Try Again
          </Button>
        </div>
      ) : !data || !hasActivity ? (
        <div className="space-y-6">
          {data?.coachingPeriods && data.coachingPeriods.length > 0 && (
            <CoachingPeriodMarker periods={data.coachingPeriods} />
          )}
          <ProgressEmptyState />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <ProgressSummaryStats data={data} />

          {/* Coaching Periods timeline */}
          {data.coachingPeriods && data.coachingPeriods.length > 0 && (
            <CoachingPeriodMarker periods={data.coachingPeriods} />
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6">
            <WorkoutProgressChart data={data.workout} />
            <NutritionProgressChart data={data.nutrition} />
          </div>
        </div>
      )}
    </div>
  );
};
