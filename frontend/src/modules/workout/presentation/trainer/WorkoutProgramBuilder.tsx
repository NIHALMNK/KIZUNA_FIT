'use client';

import React, { useState } from 'react';
import {
  Exercise,
  ExercisePrescription,
  ExerciseType,
  WorkoutGoal,
  WorkoutProgram,
  WorkoutProgramStatus,
} from '../../domain/types/workout.types';
import { ExerciseCatalogModal } from '../catalog/ExerciseCatalogModal';
import {
  useActivateWorkoutProgram,
  useCreateWorkoutProgram,
  useDuplicateWorkoutProgram,
  useUpdateDraftWorkoutProgram,
} from '../../application/mutations/useWorkoutMutations';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import {
  Plus,
  Trash2,
  Dumbbell,
  CheckCircle2,
  Copy,
  Calendar,
  Layers,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';

interface WorkoutProgramBuilderProps {
  coachingRelationshipId: string;
  existingProgram?: WorkoutProgram | null;
  onBack?: () => void;
  onSaved?: (program: WorkoutProgram) => void;
}

interface BuilderExercise {
  order: number;
  exercise: Exercise;
  type: ExerciseType;
  sets: number;
  reps: string;
  restSeconds: number;
  tempo?: string;
  notes?: string;
}

interface BuilderDay {
  id: string;
  dayNumber: number;
  title: string;
  exercises: BuilderExercise[];
}

interface BuilderWeek {
  id: string;
  weekNumber: number;
  title: string;
  days: BuilderDay[];
}

export const WorkoutProgramBuilder: React.FC<WorkoutProgramBuilderProps> = ({
  coachingRelationshipId,
  existingProgram,
  onBack,
  onSaved,
}) => {
  const [title, setTitle] = useState(existingProgram?.title || 'Customized Training Plan');
  const [description, setDescription] = useState(existingProgram?.description || '');
  const [goal, setGoal] = useState<WorkoutGoal>(
    existingProgram?.goal || WorkoutGoal.GENERAL_FITNESS,
  );
  const [weeksCount, setWeeksCount] = useState(existingProgram?.schedule?.weeks || 4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(
    existingProgram?.schedule?.sessionsPerWeek || 3,
  );

  // Initialize weeks & days
  const [weeks, setWeeks] = useState<BuilderWeek[]>(() => {
    if (existingProgram?.weeks && existingProgram.weeks.length > 0) {
      return existingProgram.weeks.map((w) => ({
        id: w.id || crypto.randomUUID(),
        weekNumber: w.weekNumber,
        title: w.title,
        days: w.days.map((d) => ({
          id: d.id || crypto.randomUUID(),
          dayNumber: d.dayNumber,
          title: d.title,
          exercises: d.exercises.map((rx) => ({
            order: rx.order,
            exercise: {
              id: rx.exercise.exerciseId,
              name: rx.exercise.name,
              slug: rx.exercise.slug,
              category: rx.exercise.category,
              primaryMuscleGroup: rx.exercise.primaryMuscleGroup,
              secondaryMuscleGroups: [],
              equipment: rx.exercise.equipment,
              difficulty: rx.exercise.difficulty,
              instructions: [],
              media: {},
              caloriesPerMinute: 5,
              status: 'ACTIVE' as any,
              createdAt: '',
              updatedAt: '',
            },
            type: rx.type,
            sets: rx.sets,
            reps: rx.reps,
            restSeconds: rx.restSeconds,
            tempo: rx.tempo || undefined,
            notes: rx.notes || undefined,
          })),
        })),
      }));
    }

    return [
      {
        id: crypto.randomUUID(),
        weekNumber: 1,
        title: 'Week 1 Foundation',
        days: [
          { id: crypto.randomUUID(), dayNumber: 1, title: 'Day 1: Upper Body Push', exercises: [] },
          {
            id: crypto.randomUUID(),
            dayNumber: 2,
            title: 'Day 2: Lower Body Strength',
            exercises: [],
          },
          { id: crypto.randomUUID(), dayNumber: 3, title: 'Day 3: Pull & Core', exercises: [] },
        ],
      },
    ];
  });

  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const createProgramMutation = useCreateWorkoutProgram();
  const updateProgramMutation = useUpdateDraftWorkoutProgram();
  const activateProgramMutation = useActivateWorkoutProgram();
  const duplicateProgramMutation = useDuplicateWorkoutProgram();

  const isSaving =
    createProgramMutation.isPending ||
    updateProgramMutation.isPending ||
    activateProgramMutation.isPending ||
    duplicateProgramMutation.isPending;

  const currentWeek = weeks[activeWeekIndex] || weeks[0];
  const currentDay = currentWeek?.days[activeDayIndex] || currentWeek?.days[0];

  const handleAddExerciseToCurrentDay = (exercise: Exercise) => {
    setWeeks((prev) => {
      const updated = [...prev];
      const targetWeek = { ...updated[activeWeekIndex] };
      const targetDays = [...targetWeek.days];
      const targetDay = { ...targetDays[activeDayIndex] };

      const newRx: BuilderExercise = {
        order: targetDay.exercises.length + 1,
        exercise,
        type: ExerciseType.MAIN,
        sets: 3,
        reps: '10',
        restSeconds: 90,
      };

      targetDay.exercises = [...targetDay.exercises, newRx];
      targetDays[activeDayIndex] = targetDay;
      targetWeek.days = targetDays;
      updated[activeWeekIndex] = targetWeek;
      return updated;
    });
  };

  const handleRemoveExercise = (exIndex: number) => {
    setWeeks((prev) => {
      const updated = [...prev];
      const targetWeek = { ...updated[activeWeekIndex] };
      const targetDays = [...targetWeek.days];
      const targetDay = { ...targetDays[activeDayIndex] };

      targetDay.exercises = targetDay.exercises
        .filter((_, idx) => idx !== exIndex)
        .map((rx, idx) => ({ ...rx, order: idx + 1 }));

      targetDays[activeDayIndex] = targetDay;
      targetWeek.days = targetDays;
      updated[activeWeekIndex] = targetWeek;
      return updated;
    });
  };

  const handleUpdateExerciseField = (exIndex: number, field: keyof BuilderExercise, value: any) => {
    setWeeks((prev) => {
      const updated = [...prev];
      const targetWeek = { ...updated[activeWeekIndex] };
      const targetDays = [...targetWeek.days];
      const targetDay = { ...targetDays[activeDayIndex] };

      targetDay.exercises = targetDay.exercises.map((rx, idx) => {
        if (idx === exIndex) {
          return { ...rx, [field]: value };
        }
        return rx;
      });

      targetDays[activeDayIndex] = targetDay;
      targetWeek.days = targetDays;
      updated[activeWeekIndex] = targetWeek;
      return updated;
    });
  };

  const handleAddDay = () => {
    setWeeks((prev) => {
      const updated = [...prev];
      const targetWeek = { ...updated[activeWeekIndex] };
      const nextDayNum = targetWeek.days.length + 1;
      if (nextDayNum > 7) return prev;

      targetWeek.days = [
        ...targetWeek.days,
        {
          id: crypto.randomUUID(),
          dayNumber: nextDayNum,
          title: `Day ${nextDayNum}: Custom Split`,
          exercises: [],
        },
      ];
      updated[activeWeekIndex] = targetWeek;
      return updated;
    });
    setActiveDayIndex(currentWeek.days.length);
  };

  const serializePayload = () => {
    return {
      coachingRelationshipId,
      title,
      description,
      goal,
      schedule: {
        weeks: weeksCount,
        sessionsPerWeek,
      },
      weeks: weeks.map((w) => ({
        id: w.id,
        weekNumber: w.weekNumber,
        title: w.title,
        days: w.days.map((d) => ({
          id: d.id,
          dayNumber: d.dayNumber,
          title: d.title,
          exercises: d.exercises.map((rx) => ({
            order: rx.order,
            exerciseId: rx.exercise.id,
            type: rx.type,
            sets: Number(rx.sets) || 3,
            reps: String(rx.reps) || '10',
            restSeconds: Number(rx.restSeconds) || 60,
            tempo: rx.tempo || null,
            notes: rx.notes || null,
          })),
        })),
      })),
    };
  };

  const handleSaveDraft = async () => {
    setFeedbackMsg(null);
    try {
      const payload = serializePayload();
      let res: WorkoutProgram;

      if (existingProgram?.id && existingProgram.status === WorkoutProgramStatus.DRAFT) {
        res = await updateProgramMutation.mutateAsync({
          programId: existingProgram.id,
          data: payload,
        });
      } else {
        res = await createProgramMutation.mutateAsync(payload);
      }

      setFeedbackMsg({ type: 'success', text: 'Workout draft saved successfully!' });
      if (onSaved) onSaved(res);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to save workout program.' });
    }
  };

  const handlePublishAndActivate = async () => {
    setFeedbackMsg(null);
    try {
      const payload = serializePayload();
      let programId = existingProgram?.id;

      if (!programId || existingProgram?.status !== WorkoutProgramStatus.DRAFT) {
        const created = await createProgramMutation.mutateAsync(payload);
        programId = created.id;
      } else {
        await updateProgramMutation.mutateAsync({ programId, data: payload });
      }

      const activated = await activateProgramMutation.mutateAsync(programId);
      setFeedbackMsg({
        type: 'success',
        text: 'Workout Program published & activated for client!',
      });
      if (onSaved) onSaved(activated);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to activate workout program.' });
    }
  };

  const handleDuplicateVersion = async () => {
    if (!existingProgram) return;
    setFeedbackMsg(null);
    try {
      const cloned = await duplicateProgramMutation.mutateAsync({
        programId: existingProgram.id,
        title: `${title} (v${existingProgram.version + 1})`,
      });
      setFeedbackMsg({
        type: 'success',
        text: `Created new version (v${cloned.version}) in draft!`,
      });
      if (onSaved) onSaved(cloned);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to duplicate program.' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-[var(--color-border)] text-[var(--color-text-secondary)]"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          )}
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              {existingProgram
                ? `PROGRAM VERSION v${existingProgram.version}`
                : 'NEW WORKOUT PROGRAM'}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--color-heading)]">
              {existingProgram?.status === WorkoutProgramStatus.ACTIVE
                ? 'Active Program Viewer'
                : 'Workout Program Builder'}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {existingProgram?.status === WorkoutProgramStatus.ACTIVE ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleDuplicateVersion}
              disabled={isSaving}
              className="rounded-xl font-bold flex items-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              Clone to New Version (v{existingProgram.version + 1})
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="rounded-xl border-[var(--color-border)] font-semibold"
              >
                Save Draft
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePublishAndActivate}
                disabled={isSaving}
                className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                Publish & Activate
              </Button>
            </>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl border text-sm font-medium ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Program Metadata Card */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--color-heading)] uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
          Program Overview & Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
              Program Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 4-Week Hypertrophy & Strength Split"
              className="rounded-xl"
              disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
              Training Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as WorkoutGoal)}
              disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
              className="w-full h-10 px-3 text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              {Object.values(WorkoutGoal).map((g) => (
                <option key={g} value={g}>
                  {g.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
              Program Duration
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="12"
                value={weeksCount}
                onChange={(e) => setWeeksCount(parseInt(e.target.value, 10) || 4)}
                className="rounded-xl"
                disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
              />
              <span className="text-xs text-[var(--color-text-muted)] font-bold">Weeks</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
              Frequency
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="7"
                value={sessionsPerWeek}
                onChange={(e) => setSessionsPerWeek(parseInt(e.target.value, 10) || 3)}
                className="rounded-xl"
                disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
              />
              <span className="text-xs text-[var(--color-text-muted)] font-bold">Days/Week</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block mb-1.5">
              Notes & Guidelines
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Progressive overload on bench and squat"
              className="rounded-xl"
              disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
            />
          </div>
        </div>
      </div>

      {/* Routine Split Navigation */}
      <div className="space-y-4">
        {/* Day Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] pb-3">
          {currentWeek.days.map((day, dIdx) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIndex(dIdx)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeDayIndex === dIdx
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {day.title || `Day ${day.dayNumber}`}
              <span className="text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">
                {day.exercises.length}
              </span>
            </button>
          ))}

          {existingProgram?.status !== WorkoutProgramStatus.ACTIVE &&
            currentWeek.days.length < 7 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDay}
                className="h-8 rounded-xl text-xs border-dashed border-[var(--color-border)] text-[var(--color-primary)] font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Day
              </Button>
            )}
        </div>

        {/* Current Day Editor */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                Workout Day Title
              </label>
              <Input
                value={currentDay.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setWeeks((prev) => {
                    const updated = [...prev];
                    updated[activeWeekIndex].days[activeDayIndex].title = val;
                    return updated;
                  });
                }}
                placeholder="e.g. Day 1: Upper Body Push"
                className="mt-1 font-bold text-sm rounded-xl"
                disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
              />
            </div>

            {existingProgram?.status !== WorkoutProgramStatus.ACTIVE && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCatalogOpen(true)}
                className="rounded-xl font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Exercise from Library
              </Button>
            )}
          </div>

          {/* Exercise List for Day */}
          {currentDay.exercises.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-alt)]/30">
              <Dumbbell className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[var(--color-heading)]">
                No exercises in this workout day
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 mb-4">
                Prescribe exercises with sets, target reps, rest times, and tempo
              </p>
              {existingProgram?.status !== WorkoutProgramStatus.ACTIVE && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCatalogOpen(true)}
                  className="rounded-xl font-bold border-[var(--color-primary)] text-[var(--color-primary)]"
                >
                  Browse Exercise Library
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentDay.exercises.map((rx, exIdx) => (
                <div
                  key={`${rx.exercise.id}-${exIdx}`}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]/40 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white font-bold text-xs flex items-center justify-center">
                        {rx.order}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[var(--color-heading)]">
                          {rx.exercise.name}
                        </h4>
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                          {rx.exercise.primaryMuscleGroup} • {rx.exercise.equipment}
                        </span>
                      </div>
                    </div>

                    {existingProgram?.status !== WorkoutProgramStatus.ACTIVE && (
                      <button
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="p-1.5 text-[var(--color-text-muted)] hover:text-rose-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Prescription Parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                        Type
                      </label>
                      <select
                        value={rx.type}
                        onChange={(e) =>
                          handleUpdateExerciseField(exIdx, 'type', e.target.value as ExerciseType)
                        }
                        disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
                        className="w-full h-8 px-2 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] font-medium"
                      >
                        {Object.values(ExerciseType).map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                        Sets
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="20"
                        value={rx.sets}
                        onChange={(e) =>
                          handleUpdateExerciseField(
                            exIdx,
                            'sets',
                            parseInt(e.target.value, 10) || 3,
                          )
                        }
                        disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
                        className="h-8 text-xs rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                        Reps / Duration
                      </label>
                      <Input
                        value={rx.reps}
                        onChange={(e) => handleUpdateExerciseField(exIdx, 'reps', e.target.value)}
                        placeholder="e.g. 8-10"
                        disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
                        className="h-8 text-xs rounded-lg font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                        Rest (sec)
                      </label>
                      <Input
                        type="number"
                        step="15"
                        value={rx.restSeconds}
                        onChange={(e) =>
                          handleUpdateExerciseField(
                            exIdx,
                            'restSeconds',
                            parseInt(e.target.value, 10) || 60,
                          )
                        }
                        disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
                        className="h-8 text-xs rounded-lg"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                        Tempo / Form
                      </label>
                      <Input
                        value={rx.tempo || ''}
                        onChange={(e) => handleUpdateExerciseField(exIdx, 'tempo', e.target.value)}
                        placeholder="e.g. 3-0-1-0"
                        disabled={existingProgram?.status === WorkoutProgramStatus.ACTIVE}
                        className="h-8 text-xs rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Exercise Catalog Modal */}
      <ExerciseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectExercise={handleAddExerciseToCurrentDay}
      />
    </div>
  );
};
