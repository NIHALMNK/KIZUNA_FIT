'use client';

import React, { useState } from 'react';
import {
  WorkoutCompletion,
  WorkoutProgram,
  WorkoutProgramStatus,
} from '../../domain/types/workout.types';
import { CoachingRelationshipListItem } from '../../../coaching/domain/types/coaching.types';
import { useWorkoutPrograms } from '../../application/queries/useWorkoutPrograms';
import { useWorkoutCompletions } from '../../application/queries/useWorkoutCompletions';
import {
  useDuplicateWorkoutProgram,
  useGetOrCreateDraftProgram,
} from '../../application/mutations/useWorkoutMutations';
import { WorkoutStatusBadge } from '../components/WorkoutStatusBadge';
import { WorkoutGoalBadge } from '../components/WorkoutGoalBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Dumbbell,
  Clock,
  CheckCircle2,
  Copy,
  Edit3,
  Plus,
  Flame,
  ChevronDown,
  ChevronUp,
  History,
  Activity,
  Sparkles,
} from 'lucide-react';

interface TrainerClientWorkoutWorkspaceProps {
  relationship: CoachingRelationshipListItem;
  onBack: () => void;
  onCreateProgram: () => void;
  onEditProgram: (program: WorkoutProgram) => void;
}

export const TrainerClientWorkoutWorkspace: React.FC<TrainerClientWorkoutWorkspaceProps> = ({
  relationship,
  onBack,
  onCreateProgram,
  onEditProgram,
}) => {
  const [activeTab, setActiveTab] = useState<'active-program' | 'history' | 'versions'>(
    'active-program',
  );
  const [expandedCompletionId, setExpandedCompletionId] = useState<string | null>(null);

  // Fetch all programs for this relationship
  const { data: programsData, isLoading: isLoadingPrograms } = useWorkoutPrograms({
    coachingRelationshipId: relationship.relationshipId,
  });

  // Fetch all completions for this relationship & client
  const { data: completionsData, isLoading: isLoadingCompletions } = useWorkoutCompletions({
    coachingRelationshipId: relationship.relationshipId,
    clientId: relationship.client?.id,
  });

  const duplicateMutation = useDuplicateWorkoutProgram();
  const getOrCreateDraftMutation = useGetOrCreateDraftProgram();

  const programs = programsData?.programs || [];
  const activeProgram = programs.find((p) => p.status === WorkoutProgramStatus.ACTIVE) || null;
  const draftProgram = programs.find((p) => p.status === WorkoutProgramStatus.DRAFT) || null;
  const completions = completionsData?.completions || [];

  const clientName =
    relationship.client?.fullName || `Client #${relationship.client?.id?.slice(-6) || '1'}`;
  const clientInitials = clientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleEditWorkout = async () => {
    try {
      const draft = await getOrCreateDraftMutation.mutateAsync(relationship.relationshipId);
      onEditProgram(draft);
    } catch (err: any) {
      alert(err.message || 'Failed to open workout editor.');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      {/* Top Client Header */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="rounded-xl border-[var(--color-border)] text-[var(--color-text-secondary)]"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Clients
          </Button>

          <div className="flex items-center gap-3">
            <Avatar
              src={relationship.client?.avatarUrl || undefined}
              fallback={clientInitials}
              size="lg"
              className="border-2 border-[var(--color-primary)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[var(--color-heading)]">
                  {clientName}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {relationship.status}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                Coaching Contract: {relationship.planType || '1-on-1 Coaching'} •{' '}
                {relationship.durationDays ? `${relationship.durationDays} Days` : 'Active'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div>
          {activeProgram ? (
            <Button
              variant="primary"
              size="sm"
              onClick={handleEditWorkout}
              disabled={getOrCreateDraftMutation.isPending}
              className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit Workout
            </Button>
          ) : draftProgram ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEditProgram(draftProgram)}
              className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-4 h-4" />
              Continue Editing Draft (v{draftProgram.version})
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onCreateProgram}
              className="rounded-xl font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Workout Program
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
        <button
          onClick={() => setActiveTab('active-program')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'active-program'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          Active Program
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Workout History ({completions.length})
        </button>
        <button
          onClick={() => setActiveTab('versions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'versions'
              ? 'bg-[var(--color-primary)] text-white shadow-xs'
              : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          All Versions ({programs.length})
        </button>
      </div>

      {/* Tab 1: Active Program View */}
      {activeTab === 'active-program' && (
        <div className="space-y-6">
          {isLoadingPrograms ? (
            <div className="h-64 rounded-3xl bg-[var(--color-surface-alt)] animate-pulse" />
          ) : activeProgram ? (
            <div className="space-y-5">
              {/* Program Overview Banner */}
              <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <WorkoutStatusBadge status={activeProgram.status} />
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface-alt)] font-mono font-bold text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        v{activeProgram.version}
                      </span>
                      <WorkoutGoalBadge goal={activeProgram.goal} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-heading)]">
                      {activeProgram.title}
                    </h3>
                    {activeProgram.description && (
                      <p className="text-xs text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                        {activeProgram.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditWorkout}
                      disabled={getOrCreateDraftMutation.isPending}
                      className="rounded-xl font-bold text-xs flex items-center gap-1.5 border-[var(--color-border)]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Workout
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[var(--color-border)]/60 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                      Duration
                    </span>
                    <p className="font-bold text-[var(--color-heading)] mt-0.5">
                      {activeProgram.schedule?.weeks || 4} Weeks
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                      Frequency
                    </span>
                    <p className="font-bold text-[var(--color-heading)] mt-0.5">
                      {activeProgram.schedule?.sessionsPerWeek || 3} Days / Week
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                      Total Days
                    </span>
                    <p className="font-bold text-[var(--color-heading)] mt-0.5">
                      {activeProgram.weeks.reduce((acc, w) => acc + w.days.length, 0)} Prescribed
                      Days
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)]">
                    <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                      Activated
                    </span>
                    <p className="font-bold text-[var(--color-heading)] mt-0.5">
                      {activeProgram.activatedAt
                        ? new Date(activeProgram.activatedAt).toLocaleDateString()
                        : 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Workout Days & Prescriptions */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[var(--color-heading)] uppercase tracking-wider">
                  Prescribed Workout Splits
                </h4>

                {activeProgram.weeks.map((week) => (
                  <div key={week.id} className="space-y-3">
                    <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">
                      {week.title || `Week ${week.weekNumber}`}
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {week.days.map((day) => (
                        <div
                          key={day.id}
                          className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                            <h5 className="font-bold text-sm text-[var(--color-heading)]">
                              {day.title}
                            </h5>
                            <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                              {day.exercises.length} Exercises
                            </span>
                          </div>

                          <div className="space-y-2">
                            {day.exercises.map((rx) => (
                              <div
                                key={rx.order}
                                className="p-2.5 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)] flex items-center justify-between text-xs"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-bold text-[10px] flex items-center justify-center">
                                    {rx.order}
                                  </span>
                                  <div>
                                    <p className="font-bold text-[var(--color-heading)]">
                                      {rx.exercise.name}
                                    </p>
                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                      {rx.exercise.primaryMuscleGroup} • {rx.type}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right font-semibold">
                                  <span className="text-[var(--color-heading)]">
                                    {rx.sets} × {rx.reps}
                                  </span>
                                  <span className="text-[10px] text-[var(--color-text-muted)] block">
                                    {rx.restSeconds}s rest
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : draftProgram ? (
            <div className="p-8 text-center rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto font-bold">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-heading)]">
                  Draft Program in Progress
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-md mx-auto">
                  You have a draft program ({draftProgram.title} v{draftProgram.version}) ready for
                  customization and publishing.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => onEditProgram(draftProgram)}
                className="rounded-xl font-bold"
              >
                Edit & Publish Draft
              </Button>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)] space-y-4">
              <Dumbbell className="w-12 h-12 text-[var(--color-text-muted)] mx-auto" />
              <div>
                <h3 className="text-base font-bold text-[var(--color-heading)]">
                  No Active Workout Program
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm mx-auto">
                  {clientName} does not have an active workout program assigned. Create a
                  personalized training routine to begin.
                </p>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={onCreateProgram}
                className="rounded-xl font-bold"
              >
                Create Workout Program
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Workout History & Performance Review */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {isLoadingCompletions ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-20 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse"
                />
              ))}
            </div>
          ) : completions.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[var(--color-surface)] border-2 border-dashed border-[var(--color-border)]">
              <History className="w-10 h-10 text-[var(--color-text-muted)] mx-auto mb-2" />
              <h4 className="text-sm font-bold text-[var(--color-heading)]">
                No workout logs recorded yet
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Completed workout session logs and performance metrics from {clientName} will appear
                here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {completions.map((completion) => {
                const isExpanded = expandedCompletionId === completion.id;
                const completedSetsCount = completion.completedExercises.reduce(
                  (acc, e) => acc + e.completedSets.filter((s) => s.completed).length,
                  0,
                );
                const totalSetsCount = completion.completedExercises.reduce(
                  (acc, e) => acc + e.completedSets.length,
                  0,
                );

                return (
                  <div
                    key={completion.id}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs overflow-hidden transition-all"
                  >
                    {/* Summary Row */}
                    <div
                      onClick={() => setExpandedCompletionId(isExpanded ? null : completion.id)}
                      className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-[var(--color-surface-alt)]/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold text-sm flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-[var(--color-heading)]">
                              {completion.workoutDaySnapshot?.title ||
                                `Workout Day ${completion.workoutDay}`}
                            </h4>
                            <WorkoutStatusBadge status={completion.status} />
                          </div>
                          <span className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              completion.completedAt || completion.startedAt,
                            ).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <div className="text-right">
                          <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                            Sets Done
                          </span>
                          <span className="text-[var(--color-heading)]">
                            {completedSetsCount} / {totalSetsCount} sets
                          </span>
                        </div>

                        {completion.feedback && (
                          <div className="text-right">
                            <span className="text-[10px] text-[var(--color-text-muted)] uppercase block font-bold">
                              RPE / Energy
                            </span>
                            <span className="text-[var(--color-primary)] font-bold">
                              {completion.feedback.difficulty} • {completion.feedback.energyLevel}
                              /10
                            </span>
                          </div>
                        )}

                        <button className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-heading)]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Performance Review Dropdown */}
                    {isExpanded && (
                      <div className="p-5 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]/30 space-y-4 animate-in fade-in duration-150">
                        <h5 className="text-xs font-bold text-[var(--color-heading)] uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-[var(--color-primary)]" />
                          Performance Breakdown & Logged Data
                        </h5>

                        <div className="space-y-3">
                          {completion.completedExercises.map((ex, exIdx) => (
                            <div
                              key={ex.id || exIdx}
                              className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2"
                            >
                              <div className="flex items-center justify-between text-xs font-bold border-b border-[var(--color-border)]/60 pb-2">
                                <span className="text-[var(--color-heading)]">
                                  {ex.exerciseName}
                                </span>
                                <span className="text-[10px] text-[var(--color-text-muted)]">
                                  {ex.completedSets.filter((s) => s.completed).length} of{' '}
                                  {ex.completedSets.length} sets completed
                                </span>
                              </div>

                              <div className="grid grid-cols-4 gap-2 text-[10px] font-extrabold uppercase text-[var(--color-text-muted)] px-1">
                                <div>Set</div>
                                <div>Target Reps</div>
                                <div>Weight (kg)</div>
                                <div>Reps Logged</div>
                              </div>

                              {ex.completedSets.map((s) => (
                                <div
                                  key={s.setNumber}
                                  className={`grid grid-cols-4 gap-2 items-center p-2 rounded-lg text-xs ${
                                    s.completed
                                      ? 'bg-emerald-500/5 text-[var(--color-heading)] font-semibold'
                                      : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]'
                                  }`}
                                >
                                  <div>#{s.setNumber}</div>
                                  <div>{s.plannedReps}</div>
                                  <div>{s.weight} kg</div>
                                  <div className="flex items-center gap-1">
                                    <span>{s.completedReps} reps</span>
                                    {s.completed && (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-1" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>

                        {completion.feedback?.notes && (
                          <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                              Client Notes / Feedback
                            </span>
                            <p className="text-[var(--color-text-primary)] italic">
                              "{completion.feedback.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Versions */}
      {activeTab === 'versions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <WorkoutStatusBadge status={prog.status} />
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
                          v{prog.version}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[var(--color-heading)]">
                        {prog.title}
                      </h4>
                    </div>
                    <WorkoutGoalBadge goal={prog.goal} />
                  </div>

                  <p className="text-xs text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                    {prog.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)] text-xs">
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Created {new Date(prog.createdAt).toLocaleDateString()}
                  </span>

                  {prog.status === WorkoutProgramStatus.DRAFT ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditProgram(prog)}
                      className="rounded-xl font-bold text-xs"
                    >
                      Edit Draft
                    </Button>
                  ) : prog.status === WorkoutProgramStatus.ACTIVE ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleEditWorkout}
                      disabled={getOrCreateDraftMutation.isPending}
                      className="rounded-xl font-bold text-xs"
                    >
                      Edit Workout
                    </Button>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                      Historical Version
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
