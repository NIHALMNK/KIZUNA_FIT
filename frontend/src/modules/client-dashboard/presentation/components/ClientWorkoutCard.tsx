'use client';

import React from 'react';
import Link from 'next/link';
import { AssignedWorkoutProgram } from '../../domain/types/clientDashboard.types';
import { useActiveWorkoutProgram } from '../../../workout/application/queries/useWorkoutPrograms';
import { Button } from '../../../../shared/components/ui/Button';

interface ClientWorkoutCardProps {
  programs?: AssignedWorkoutProgram[];
}

export const ClientWorkoutCard: React.FC<ClientWorkoutCardProps> = ({ programs = [] }) => {
  const { data: fetchedActiveProgram } = useActiveWorkoutProgram();

  const activeProgram =
    programs.find((p) => p.status === 'ACTIVE') ||
    (fetchedActiveProgram
      ? {
          id: fetchedActiveProgram.id,
          title: fetchedActiveProgram.title,
          status: fetchedActiveProgram.status,
          assignedAt: fetchedActiveProgram.activatedAt || fetchedActiveProgram.createdAt,
        }
      : programs[0]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          WORKOUT PROGRAM
        </span>
        {activeProgram && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            Active
          </span>
        )}
      </div>

      {activeProgram ? (
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-[var(--color-heading)] truncate">
            {activeProgram.title}
          </h3>
          {activeProgram.assignedAt && (
            <p className="text-xs text-[var(--color-text-secondary)] font-normal">
              Assigned on {formatDate(activeProgram.assignedAt)}
            </p>
          )}
        </div>
      ) : (
        <div className="py-2 space-y-1.5">
          <p className="text-sm font-bold text-[var(--color-heading)]">No active workout program</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Your trainer will assign custom workout routines once your coaching starts.
          </p>
        </div>
      )}

      <Link href="/client/workouts">
        <Button
          variant="outline"
          size="md"
          className="w-full border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
        >
          {activeProgram ? "View Today's Routine" : 'Browse Workouts'}
        </Button>
      </Link>
    </div>
  );
};
