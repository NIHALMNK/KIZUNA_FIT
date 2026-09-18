'use client';

import React, { useState } from 'react';
import { WorkoutProgram, WorkoutProgramStatus } from '../../domain/types/workout.types';
import { useWorkoutPrograms } from '../../application/queries/useWorkoutPrograms';
import { WorkoutStatusBadge } from '../components/WorkoutStatusBadge';
import { WorkoutGoalBadge } from '../components/WorkoutGoalBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Dumbbell, Plus, Calendar, Layers, Eye, Edit3, Copy } from 'lucide-react';

interface TrainerWorkoutProgramsListProps {
  trainerId?: string;
  onSelectProgram: (program: WorkoutProgram) => void;
  onCreateNewProgram: () => void;
}

export const TrainerWorkoutProgramsList: React.FC<TrainerWorkoutProgramsListProps> = ({
  trainerId,
  onSelectProgram,
  onCreateNewProgram,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const { data, isLoading } = useWorkoutPrograms({
    trainerId,
    status: (selectedStatus as WorkoutProgramStatus) || undefined,
  });

  const programs = data?.programs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">
            Workout Programs
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Create, version, and manage prescribed workout splits for your coaching clients
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onCreateNewProgram}
          className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Program
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <button
          onClick={() => setSelectedStatus('')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedStatus === ''
              ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
          }`}
        >
          All Programs
        </button>
        <button
          onClick={() => setSelectedStatus(WorkoutProgramStatus.ACTIVE)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedStatus === WorkoutProgramStatus.ACTIVE
              ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setSelectedStatus(WorkoutProgramStatus.DRAFT)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedStatus === WorkoutProgramStatus.DRAFT
              ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
          }`}
        >
          Drafts
        </button>
        <button
          onClick={() => setSelectedStatus(WorkoutProgramStatus.COMPLETED)}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
            selectedStatus === WorkoutProgramStatus.COMPLETED
              ? 'bg-[var(--color-surface-alt)] text-[var(--color-primary)] border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Programs List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse" />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface)]">
          <Dumbbell className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--color-heading)]">
            No workout programs found
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-5 max-w-sm mx-auto">
            Design your first structured workout split and prescribe it to your enrolled clients.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onCreateNewProgram}
            className="rounded-xl font-bold"
          >
            Create First Workout Program
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((program) => {
            const totalExercises = program.weeks.reduce(
              (acc, w) => acc + w.days.reduce((dAcc, d) => dAcc + d.exercises.length, 0),
              0,
            );

            return (
              <div
                key={program.id}
                className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <WorkoutStatusBadge status={program.status} />
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] font-mono font-bold border border-[var(--color-border)]">
                          v{program.version}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[var(--color-heading)] leading-snug">
                        {program.title}
                      </h3>
                    </div>
                    <WorkoutGoalBadge goal={program.goal} />
                  </div>

                  {program.description && (
                    <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                      {program.description}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)] text-center text-xs">
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                        Weeks
                      </span>
                      <p className="font-bold text-[var(--color-heading)]">
                        {program.schedule?.weeks || 4}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                        Days/Wk
                      </span>
                      <p className="font-bold text-[var(--color-heading)]">
                        {program.schedule?.sessionsPerWeek || 3}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                        Exercises
                      </span>
                      <p className="font-bold text-[var(--color-heading)]">{totalExercises}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-border)]/60">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Updated {new Date(program.updatedAt).toLocaleDateString()}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectProgram(program)}
                    className="rounded-xl font-bold text-xs flex items-center gap-1.5 border-[var(--color-border)]"
                  >
                    {program.status === WorkoutProgramStatus.DRAFT ? (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Draft
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        View & Clone
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
