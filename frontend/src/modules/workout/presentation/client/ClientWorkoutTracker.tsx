'use client';

import React, { useState, useEffect } from 'react';
import {
  CompletedExercise,
  CompletedSet,
  WorkoutCompletion,
  WorkoutDifficulty,
} from '../../domain/types/workout.types';
import {
  useCompleteWorkout,
  useUpdateWorkoutExecution,
} from '../../application/mutations/useWorkoutMutations';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import {
  CheckCircle2,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  X,
  AlertCircle,
} from 'lucide-react';

interface ClientWorkoutTrackerProps {
  initialCompletion: WorkoutCompletion;
  onFinished: (completion: WorkoutCompletion) => void;
  onCancel: () => void;
}

export const ClientWorkoutTracker: React.FC<ClientWorkoutTrackerProps> = ({
  initialCompletion,
  onFinished,
  onCancel,
}) => {
  const [completion, setCompletion] = useState<WorkoutCompletion>(initialCompletion);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [feedbackDifficulty, setFeedbackDifficulty] = useState<WorkoutDifficulty>(
    WorkoutDifficulty.MODERATE,
  );
  const [feedbackEnergy, setFeedbackEnergy] = useState<number>(7);
  const [feedbackNotes, setFeedbackNotes] = useState<string>('');

  // Rest Timer State
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const updateExecutionMutation = useUpdateWorkoutExecution();
  const completeWorkoutMutation = useCompleteWorkout();

  // Handle countdown
  useEffect(() => {
    let interval: any = null;
    if (timerActive && restSecondsRemaining !== null && restSecondsRemaining > 0) {
      interval = setInterval(() => {
        setRestSecondsRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restSecondsRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, restSecondsRemaining]);

  const startRestTimer = (seconds: number = 60) => {
    setRestSecondsRemaining(seconds);
    setTimerActive(true);
  };

  const handleToggleSet = (exIndex: number, setIndex: number) => {
    setCompletion((prev) => {
      const updatedExercises = [...prev.completedExercises];
      const targetEx = { ...updatedExercises[exIndex] };
      const updatedSets = [...targetEx.completedSets];
      const currentSet = { ...updatedSets[setIndex] };

      const newCompleted = !currentSet.completed;
      currentSet.completed = newCompleted;

      // If user marks set complete with 0 completed reps, default to planned reps or 10
      if (newCompleted && currentSet.completedReps === 0) {
        currentSet.completedReps = parseInt(currentSet.plannedReps, 10) || 10;
      }

      updatedSets[setIndex] = currentSet;
      targetEx.completedSets = updatedSets;
      updatedExercises[exIndex] = targetEx;

      const newCompletionState = { ...prev, completedExercises: updatedExercises };

      // Auto-trigger rest timer if completed
      if (newCompleted) {
        startRestTimer(60);
      }

      // Sync with server in background
      updateExecutionMutation.mutate({
        completionId: prev.id,
        data: {
          completedExercises: updatedExercises.map((e) => ({
            exerciseId: e.exerciseId,
            exerciseName: e.exerciseName,
            completedSets: e.completedSets.map((s) => ({
              setNumber: s.setNumber,
              plannedReps: s.plannedReps,
              completedReps: s.completedReps,
              weight: s.weight,
              completed: s.completed,
              notes: s.notes,
            })),
            notes: e.notes,
          })),
        },
      });

      return newCompletionState;
    });
  };

  const handleUpdateSet = (
    exIndex: number,
    setIndex: number,
    field: keyof CompletedSet,
    value: any,
  ) => {
    setCompletion((prev) => {
      const updatedExercises = [...prev.completedExercises];
      const targetEx = { ...updatedExercises[exIndex] };
      const updatedSets = [...targetEx.completedSets];
      updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };
      targetEx.completedSets = updatedSets;
      updatedExercises[exIndex] = targetEx;
      return { ...prev, completedExercises: updatedExercises };
    });
  };

  const handleFinalizeWorkout = async () => {
    try {
      const res = await completeWorkoutMutation.mutateAsync({
        completionId: completion.id,
        data: {
          completedExercises: completion.completedExercises.map((e) => ({
            exerciseId: e.exerciseId,
            exerciseName: e.exerciseName,
            completedSets: e.completedSets.map((s) => ({
              setNumber: s.setNumber,
              plannedReps: s.plannedReps,
              completedReps: s.completedReps,
              weight: s.weight,
              completed: s.completed,
              notes: s.notes,
            })),
            notes: e.notes,
          })),
          feedback: {
            difficulty: feedbackDifficulty,
            energyLevel: feedbackEnergy,
            notes: feedbackNotes || null,
          },
        },
      });

      onFinished(res);
    } catch (err: any) {
      alert(err.message || 'Failed to finalize workout session.');
    }
  };

  const totalSets = completion.completedExercises.reduce(
    (acc, ex) => acc + ex.completedSets.length,
    0,
  );
  const completedSetsCount = completion.completedExercises.reduce(
    (acc, ex) => acc + ex.completedSets.filter((s) => s.completed).length,
    0,
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Tracker Sticky Header */}
      <div className="sticky top-4 z-40 p-4 rounded-2xl bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 animate-pulse">
                LIVE WORKOUT
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">
                • Day {completion.workoutDay}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--color-heading)]">
              {completion.workoutDaySnapshot.title}
            </h2>
          </div>
        </div>

        {/* Rest Timer Widget */}
        {restSecondsRemaining !== null && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="font-mono text-sm font-bold text-[var(--color-heading)]">
              {Math.floor(restSecondsRemaining / 60)}:
              {(restSecondsRemaining % 60).toString().padStart(2, '0')}
            </span>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => startRestTimer(60)}
              className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="rounded-xl border-[var(--color-border)] text-[var(--color-text-muted)]"
          >
            Leave
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowFinishModal(true)}
            className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            Finish Workout
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[var(--color-text-secondary)]">Workout Progress</span>
          <span className="text-[var(--color-heading)]">
            {completedSetsCount} / {totalSets} sets ({progressPercent}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--color-surface-alt)] overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {completion.completedExercises.map((ex, exIdx) => (
          <div
            key={ex.id || `${ex.exerciseId}-${exIdx}`}
            className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-sm flex items-center justify-center">
                  {exIdx + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-heading)]">
                    {ex.exerciseName}
                  </h3>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {ex.completedSets.length} Prescribed Sets
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => startRestTimer(90)}
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1 rounded-lg"
              >
                <Clock className="w-3.5 h-3.5" />
                90s Rest
              </Button>
            </div>

            {/* Set Table */}
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)] px-2">
                <div className="col-span-2">Set</div>
                <div className="col-span-3">Target Reps</div>
                <div className="col-span-3">Weight (kg)</div>
                <div className="col-span-2">Reps Done</div>
                <div className="col-span-2 text-right">Log</div>
              </div>

              {ex.completedSets.map((s, sIdx) => (
                <div
                  key={s.setNumber}
                  className={`grid grid-cols-12 gap-2 items-center p-2.5 rounded-xl border transition-all ${
                    s.completed
                      ? 'bg-emerald-500/5 border-emerald-500/30'
                      : 'bg-[var(--color-surface-alt)]/40 border-[var(--color-border)]'
                  }`}
                >
                  <div className="col-span-2 font-bold text-xs text-[var(--color-heading)] pl-1">
                    #{s.setNumber}
                  </div>
                  <div className="col-span-3 text-xs font-semibold text-[var(--color-text-secondary)]">
                    {s.plannedReps}
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      step="2.5"
                      value={s.weight}
                      onChange={(e) =>
                        handleUpdateSet(exIdx, sIdx, 'weight', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="h-8 text-xs font-bold rounded-lg"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={s.completedReps}
                      onChange={(e) =>
                        handleUpdateSet(
                          exIdx,
                          sIdx,
                          'completedReps',
                          parseInt(e.target.value, 10) || 0,
                        )
                      }
                      placeholder="0"
                      className="h-8 text-xs font-bold rounded-lg"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button
                      onClick={() => handleToggleSet(exIdx, sIdx)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        s.completed
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-emerald-500 hover:text-emerald-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
                  GREAT WORK!
                </span>
                <h3 className="text-xl font-bold text-[var(--color-heading)]">Complete Session</h3>
              </div>
              <button
                onClick={() => setShowFinishModal(false)}
                className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-heading)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-[var(--color-surface-alt)] rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]">
              Logged{' '}
              <span className="font-bold text-[var(--color-heading)]">
                {completedSetsCount} sets
              </span>{' '}
              across{' '}
              <span className="font-bold text-[var(--color-heading)]">
                {completion.completedExercises.length} exercises
              </span>
              .
            </div>

            {/* RPE Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
                Session Difficulty (RPE)
              </label>
              <select
                value={feedbackDifficulty}
                onChange={(e) => setFeedbackDifficulty(e.target.value as WorkoutDifficulty)}
                className="w-full h-10 px-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium"
              >
                {Object.values(WorkoutDifficulty).map((d) => (
                  <option key={d} value={d}>
                    {d.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Energy Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[var(--color-text-secondary)]">Energy Level</span>
                <span className="text-[var(--color-primary)] font-extrabold">
                  {feedbackEnergy} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={feedbackEnergy}
                onChange={(e) => setFeedbackEnergy(parseInt(e.target.value, 10))}
                className="w-full accent-[var(--color-primary)]"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
                Session Feedback / Notes for Trainer
              </label>
              <textarea
                value={feedbackNotes}
                onChange={(e) => setFeedbackNotes(e.target.value)}
                placeholder="How did the weights feel? Any muscle tightness or fatigue?"
                rows={3}
                className="w-full p-3 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFinishModal(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleFinalizeWorkout}
                disabled={completeWorkoutMutation.isPending}
                className="rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Submit Workout Log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
