'use client';

import React, { useState } from 'react';
import { WorkoutProgram, WorkoutCompletion } from '../../domain/types/workout.types';
import { useStartWorkoutCompletion } from '../../application/mutations/useWorkoutMutations';
import { useExercise } from '../../application/queries/useExercises';
import { ExerciseDetailModal } from '../catalog/ExerciseDetailModal';
import { WorkoutGoalBadge } from '../components/WorkoutGoalBadge';
import { Button } from '../../../../shared/components/ui/Button';
import {
  Dumbbell,
  Play,
  Calendar,
  Layers,
  Clock,
  Info,
  ChevronRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface ClientActiveWorkoutViewProps {
  program: WorkoutProgram;
  onStartSession: (completion: WorkoutCompletion) => void;
}

export const ClientActiveWorkoutView: React.FC<ClientActiveWorkoutViewProps> = ({
  program,
  onStartSession,
}) => {
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const startSessionMutation = useStartWorkoutCompletion();
  const {
    data: selectedExercise,
    isLoading: isExerciseLoading,
    isError: isExerciseError,
    error: exerciseError,
  } = useExercise(selectedExerciseId || undefined);

  const currentWeek = program.weeks[activeWeekIndex] || program.weeks[0];
  const currentDay = currentWeek?.days[activeDayIndex] || currentWeek?.days[0];

  const handleStartWorkout = async () => {
    if (!currentDay) return;
    try {
      const completion = await startSessionMutation.mutateAsync({
        coachingRelationshipId: program.coachingRelationshipId,
        workoutProgramId: program.id,
        workoutDay: currentDay.dayNumber,
      });

      onStartSession(completion);
    } catch (err: any) {
      alert(err.message || 'Failed to start workout session.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Program Hero Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-primary)]/5 border border-[var(--color-border)] shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              ACTIVE TRAINING PLAN • v{program.version}
            </span>
            <WorkoutGoalBadge goal={program.goal} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-heading)] tracking-tight">
            {program.title}
          </h2>
          {program.description && (
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {program.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
              {program.schedule?.weeks || 4} Weeks Block
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[var(--color-primary)]" />
              {program.schedule?.sessionsPerWeek || 3} Sessions / Week
            </span>
          </div>
        </div>

        {currentDay && (
          <Button
            variant="primary"
            size="lg"
            onClick={handleStartWorkout}
            disabled={startSessionMutation.isPending}
            className="rounded-2xl font-bold px-6 py-4 flex items-center gap-2 shadow-md hover:scale-[1.02] transition-transform"
          >
            <Play className="w-5 h-5 fill-current" />
            Start {currentDay.title || `Day ${currentDay.dayNumber}`}
          </Button>
        )}
      </div>

      {/* Week & Day Tabs */}
      <div className="space-y-4">
        {/* Week Selector */}
        {program.weeks.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {program.weeks.map((week, wIdx) => (
              <button
                key={week.id}
                onClick={() => {
                  setActiveWeekIndex(wIdx);
                  setActiveDayIndex(0);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shrink-0 ${
                  activeWeekIndex === wIdx
                    ? 'bg-[var(--color-primary)] text-white shadow-xs'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
                }`}
              >
                {week.title || `Week ${week.weekNumber}`}
              </button>
            ))}
          </div>
        )}

        {/* Day Selector */}
        {currentWeek && currentWeek.days.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {currentWeek.days.map((day, dIdx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(dIdx)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all shrink-0 flex items-center gap-2 ${
                  activeDayIndex === dIdx
                    ? 'bg-[var(--color-heading)] text-[var(--color-surface)] shadow-xs'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                {day.title || `Day ${day.dayNumber}`}
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10">
                  {day.exercises.length} Ex
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Day Exercise Prescription List */}
      {currentDay && (
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <div>
              <h3 className="text-base font-bold text-[var(--color-heading)]">
                {currentDay.title}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                {currentDay.exercises.length} prescribed exercises for this session
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={handleStartWorkout}
              disabled={startSessionMutation.isPending}
              className="rounded-xl font-bold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Launch Workout
            </Button>
          </div>

          <div className="space-y-3">
            {currentDay.exercises.map((rx, idx) => (
              <div
                key={`${rx.exercise.exerciseId}-${idx}`}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 hover:border-[var(--color-primary)]/40 transition-colors flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-xs flex items-center justify-center">
                    {rx.order}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)]">
                      {rx.exercise.name}
                    </h4>
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                      {rx.exercise.primaryMuscleGroup} • {rx.exercise.equipment} • {rx.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                  <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                      Sets × Reps
                    </span>
                    <span className="text-[var(--color-heading)]">
                      {rx.sets} sets × {rx.reps}
                    </span>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                      Rest
                    </span>
                    <span className="text-[var(--color-heading)]">{rx.restSeconds}s</span>
                  </div>

                  {rx.tempo && (
                    <div className="px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] font-mono">
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                        Tempo
                      </span>
                      <span className="text-[var(--color-heading)]">{rx.tempo}</span>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedExerciseId(rx.exercise.exerciseId)}
                    className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-heading)] rounded-lg"
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        exercise={selectedExercise || null}
        isOpen={!!selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
        isLoading={isExerciseLoading}
        isError={isExerciseError}
        errorMessage={(exerciseError as any)?.message}
      />
    </div>
  );
};
