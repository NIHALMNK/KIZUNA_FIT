'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useActiveWorkoutProgram } from '../../../../modules/workout/application/queries/useWorkoutPrograms';
import { ClientActiveWorkoutView } from '../../../../modules/workout/presentation/client/ClientActiveWorkoutView';
import { ClientWorkoutTracker } from '../../../../modules/workout/presentation/client/ClientWorkoutTracker';
import { ClientWorkoutHistory } from '../../../../modules/workout/presentation/client/ClientWorkoutHistory';
import { WorkoutCompletion } from '../../../../modules/workout/domain/types/workout.types';
import { Button } from '../../../../shared/components/ui/Button';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Dumbbell, ArrowLeft, History, Play, Sparkles } from 'lucide-react';

export default function ClientWorkoutsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [liveSession, setLiveSession] = useState<WorkoutCompletion | null>(null);

  const { data: activeProgram, isLoading } = useActiveWorkoutProgram();

  // If live workout session is in progress, render the interactive tracker
  if (liveSession) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <ClientWorkoutTracker
          initialCompletion={liveSession}
          onFinished={(finalized) => {
            setLiveSession(null);
            setActiveTab('history');
          }}
          onCancel={() => setLiveSession(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-200">
      {/* Back / Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/client/coaching">
            <Button
              variant="outline"
              size="sm"
              className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              My Coaching
            </Button>
          </Link>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'bg-[var(--color-surface)] text-[var(--color-heading)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            Active Program
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[var(--color-surface)] text-[var(--color-heading)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Workout History
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'history' ? (
        <ClientWorkoutHistory />
      ) : isLoading ? (
        <div className="space-y-4">
          <div className="h-48 rounded-3xl bg-[var(--color-surface-alt)] animate-pulse" />
          <div className="h-64 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse" />
        </div>
      ) : activeProgram ? (
        <ClientActiveWorkoutView
          program={activeProgram}
          onStartSession={(session) => setLiveSession(session)}
        />
      ) : (
        <EmptyState
          icon={<Dumbbell className="w-12 h-12 text-[var(--color-text-muted)]" />}
          title="No Active Workout Program"
          description="Your personal trainer has not yet activated a workout routine for your coaching engagement. When published, it will appear here."
          action={
            <Link href="/client/coaching">
              <Button variant="primary" size="md" className="rounded-xl font-bold shadow-xs">
                View My Coaching
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
