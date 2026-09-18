'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, RefreshCw, Users, ShieldCheck } from 'lucide-react';
import { coachingApi } from '../../../coaching/infrastructure/api/coachingApi';
import { useRelationshipProgress } from '../../application/hooks/useRelationshipProgress';
import { ProgressGranularity } from '../../domain/types/progress.types';
import { ProgressDateRangePicker } from '../components/ProgressDateRangePicker';
import { ProgressSummaryStats } from '../components/ProgressSummaryStats';
import { CoachingPeriodMarker } from '../components/CoachingPeriodMarker';
import { WorkoutProgressChart } from '../components/WorkoutProgressChart';
import { NutritionProgressChart } from '../components/NutritionProgressChart';
import { ProgressEmptyState } from '../components/ProgressEmptyState';
import { ClientSelector, ClientOption } from '../components/ClientSelector';
import { Button } from '../../../../shared/components/ui/Button';

interface TrainerClientProgressViewProps {
  initialRelationshipId?: string;
}

export const TrainerClientProgressView: React.FC<TrainerClientProgressViewProps> = ({
  initialRelationshipId,
}) => {
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | undefined>(
    initialRelationshipId,
  );
  const [preset, setPreset] = useState<'14d' | '30d' | '90d' | 'all'>('30d');
  const [granularity, setGranularity] = useState<ProgressGranularity>('weekly');

  // Load trainer's active relationships for the client switcher if needed
  const { data: clientsData, isLoading: isLoadingClients } = useQuery({
    queryKey: ['trainerCoachingRelationships'],
    queryFn: () => coachingApi.list({ limit: 50 }),
  });

  const relationships = clientsData?.relationships || [];

  const clientOptions: ClientOption[] = useMemo(() => {
    return relationships.map((rel) => ({
      relationshipId: rel.relationshipId,
      clientId: rel.client?.id || '',
      fullName: rel.client?.fullName || rel.client?.id?.slice(0, 8) || 'Client',
      avatarUrl: rel.client?.avatarUrl || null,
      status: rel.status,
    }));
  }, [relationships]);

  useEffect(() => {
    if (!selectedRelationshipId && relationships.length > 0) {
      setSelectedRelationshipId(relationships[0].relationshipId);
    }
  }, [selectedRelationshipId, relationships]);

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
      start = undefined;
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

  const {
    data,
    isLoading: isLoadingProgress,
    isError,
    error,
    refetch,
    isFetching,
  } = useRelationshipProgress(selectedRelationshipId, {
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
              TRAINER DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--color-heading)]">
            Client Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-0.5">
            Evaluate workout volume, nutrition tracking adherence, and training consistency.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link href="/trainer/coaching">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--color-border)] text-xs font-semibold rounded-xl"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Client Roster
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching || !selectedRelationshipId}
            className="gap-2 rounded-xl text-xs font-semibold border-[var(--color-border)]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Client Selector */}
      {clientOptions.length > 0 && (
        <div className="p-4 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
              Select Client:
            </span>
          </div>

          <ClientSelector
            clients={clientOptions}
            selectedRelationshipId={selectedRelationshipId}
            onSelectClient={(id) => setSelectedRelationshipId(id)}
          />
        </div>
      )}

      {/* Date & Granularity Picker */}
      <ProgressDateRangePicker
        preset={preset}
        onPresetChange={handlePresetChange}
        granularity={granularity}
        onGranularityChange={setGranularity}
      />

      {/* Loading state */}
      {isLoadingProgress || (isLoadingClients && !selectedRelationshipId) ? (
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
            {(error as any)?.message || 'Failed to load client progress analytics.'}
          </p>
          <Button size="sm" onClick={() => refetch()} className="rounded-xl text-xs">
            Try Again
          </Button>
        </div>
      ) : !selectedRelationshipId ? (
        <ProgressEmptyState
          title="No Active Coaching Relationships"
          description="You do not currently have any active coaching clients. Once a client accepts an offer and starts training, their progress data will appear here."
          isTrainer
        />
      ) : !data || !hasActivity ? (
        <div className="space-y-6">
          {data?.coachingPeriods && data.coachingPeriods.length > 0 && (
            <CoachingPeriodMarker
              periods={data.coachingPeriods}
              currentRelationshipId={selectedRelationshipId}
            />
          )}
          <ProgressEmptyState
            title="No Activity Logged for this Client"
            description="This client has not logged any workouts or nutrition completions during the selected timeframe yet."
            isTrainer
          />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <ProgressSummaryStats data={data} />

          {/* Coaching Periods timeline */}
          {data.coachingPeriods && data.coachingPeriods.length > 0 && (
            <CoachingPeriodMarker
              periods={data.coachingPeriods}
              currentRelationshipId={selectedRelationshipId}
            />
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
