'use client';

import React from 'react';
import { useWorkoutHistory } from '../../application/queries/useWorkoutCompletions';
import { WorkoutStatusBadge } from '../components/WorkoutStatusBadge';
import { Dumbbell, Flame, Trophy, Calendar, CheckCircle2 } from 'lucide-react';

interface ClientWorkoutHistoryProps {
  clientId?: string;
}

export const ClientWorkoutHistory: React.FC<ClientWorkoutHistoryProps> = ({ clientId }) => {
  const { data, isLoading } = useWorkoutHistory(clientId);

  const stats = data;
  const sessions = stats?.recentSessions || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              COMPLETED SESSIONS
            </span>
            <p className="text-2xl font-black text-[var(--color-heading)] mt-0.5">
              {stats?.totalCompletedSessions || 0}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              TOTAL SETS LOGGED
            </span>
            <p className="text-2xl font-black text-[var(--color-heading)] mt-0.5">
              {stats?.totalSetsCompleted || 0}
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
              VOLUME LIFTED
            </span>
            <p className="text-2xl font-black text-[var(--color-heading)] mt-0.5">
              {(stats?.totalVolumeLiftedKg || 0).toLocaleString()}{' '}
              <span className="text-xs font-semibold">kg</span>
            </p>
          </div>
        </div>
      </div>

      {/* History Log List */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-heading)] uppercase tracking-wider">
          Recent Workout Sessions
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 rounded-xl bg-[var(--color-surface-alt)] animate-pulse"
              />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-alt)]/30">
            <Dumbbell className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-[var(--color-heading)]">No workout logs yet</h4>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              Complete your prescribed workouts to build historical progress evidence.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => {
              const completedSetsCount = session.completedExercises.reduce(
                (acc, e) => acc + e.completedSets.filter((s) => s.completed).length,
                0,
              );

              return (
                <div
                  key={session.id}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 hover:border-[var(--color-primary)]/40 transition-colors flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--color-heading)]">
                        {session.workoutDaySnapshot?.title || `Workout Day ${session.workoutDay}`}
                      </h4>
                      <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(session.completedAt || session.createdAt).toLocaleDateString(
                          undefined,
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="text-right">
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                        Sets Completed
                      </span>
                      <span className="text-[var(--color-heading)]">{completedSetsCount} sets</span>
                    </div>

                    {session.feedback && (
                      <div className="text-right">
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                          Difficulty
                        </span>
                        <span className="text-[var(--color-primary)]">
                          {session.feedback.difficulty}
                        </span>
                      </div>
                    )}

                    <WorkoutStatusBadge status={session.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
