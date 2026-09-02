'use client';

import React, { useState } from 'react';
import { useCoachingRelationships } from '../../../coaching/application/queries/useCoachingRelationships';
import { CoachingRelationshipListItem } from '../../../coaching/domain/types/coaching.types';
import { useWorkoutPrograms } from '../../application/queries/useWorkoutPrograms';
import { WorkoutProgram, WorkoutProgramStatus } from '../../domain/types/workout.types';
import { WorkoutStatusBadge } from '../components/WorkoutStatusBadge';
import { WorkoutGoalBadge } from '../components/WorkoutGoalBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import {
  Dumbbell,
  Search,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Users,
  CheckCircle2,
} from 'lucide-react';

interface TrainerWorkoutClientsListProps {
  onSelectClientWorkspace: (relationship: CoachingRelationshipListItem) => void;
  onCreateProgramForClient: (relationship: CoachingRelationshipListItem) => void;
  onOpenExerciseLibrary: () => void;
}

export const TrainerWorkoutClientsList: React.FC<TrainerWorkoutClientsListProps> = ({
  onSelectClientWorkspace,
  onCreateProgramForClient,
  onOpenExerciseLibrary,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_PROGRAM' | 'NO_PROGRAM'>('ALL');

  // Fetch all authorized coaching relationships for the trainer
  const { data: coachingData, isLoading: isLoadingCoaching } = useCoachingRelationships({
    limit: 100,
  });

  // Fetch all workout programs for the trainer
  const { data: programsData, isLoading: isLoadingPrograms } = useWorkoutPrograms();

  const relationships = coachingData?.relationships || [];
  const programs = programsData?.programs || [];

  // Group programs by coachingRelationshipId
  const programsByRelationship = new Map<string, WorkoutProgram[]>();
  for (const prog of programs) {
    const list = programsByRelationship.get(prog.coachingRelationshipId) || [];
    list.push(prog);
    programsByRelationship.set(prog.coachingRelationshipId, list);
  }

  // Filter clients
  const filteredClients = relationships.filter((rel) => {
    const clientName = rel.client?.fullName || `Client #${rel.client?.id?.slice(-6) || ''}`;
    const matchesSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.relationshipId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const relPrograms = programsByRelationship.get(rel.relationshipId) || [];
    const hasActiveProgram = relPrograms.some((p) => p.status === WorkoutProgramStatus.ACTIVE);

    if (statusFilter === 'ACTIVE_PROGRAM') return hasActiveProgram;
    if (statusFilter === 'NO_PROGRAM') return !hasActiveProgram;
    return true;
  });

  const isLoading = isLoadingCoaching || isLoadingPrograms;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              WORKOUT MANAGEMENT
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-heading)] tracking-tight">
            My Coaching Clients
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
            Manage customized workout splits, inspect active routines, and review client execution
            performance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenExerciseLibrary}
            className="rounded-xl border-[var(--color-border)] text-[var(--color-text-secondary)] font-bold flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
            Exercise Library
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <Input
            placeholder="Search coaching clients by name or relationship ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-[var(--color-surface-alt)]/40 border-[var(--color-border)]"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              statusFilter === 'ALL'
                ? 'bg-[var(--color-surface)] text-[var(--color-heading)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
            }`}
          >
            All Clients ({relationships.length})
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE_PROGRAM')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              statusFilter === 'ACTIVE_PROGRAM'
                ? 'bg-[var(--color-surface)] text-[var(--color-heading)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
            }`}
          >
            Active Program
          </button>
          <button
            onClick={() => setStatusFilter('NO_PROGRAM')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              statusFilter === 'NO_PROGRAM'
                ? 'bg-[var(--color-surface)] text-[var(--color-heading)] shadow-xs'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-heading)]'
            }`}
          >
            Needs Program
          </button>
        </div>
      </div>

      {/* Client Workout Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-52 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-3xl bg-[var(--color-surface)] space-y-3">
          <Users className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-1" />
          <h3 className="text-base font-bold text-[var(--color-heading)]">
            No coaching clients found
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'No clients matched your current filter criteria. Try resetting filters.'
              : 'You do not have any active coaching clients assigned yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((rel) => {
            const relPrograms = programsByRelationship.get(rel.relationshipId) || [];
            const activeProgram = relPrograms.find((p) => p.status === WorkoutProgramStatus.ACTIVE);
            const draftProgram = relPrograms.find((p) => p.status === WorkoutProgramStatus.DRAFT);

            const clientName =
              rel.client?.fullName || `Client #${rel.client?.id?.slice(-6) || '1'}`;
            const clientInitials = clientName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase();

            return (
              <div
                key={rel.relationshipId}
                className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Client Identity Header */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={rel.client?.avatarUrl || undefined}
                        fallback={clientInitials}
                        size="md"
                        className="border border-[var(--color-border)]"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                          {clientName}
                        </h4>
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          {rel.planType || '1-on-1 Coaching'}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {rel.status}
                    </span>
                  </div>

                  {/* Program Status Box */}
                  <div className="p-3.5 rounded-xl bg-[var(--color-surface-alt)]/50 border border-[var(--color-border)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
                        CURRENT WORKOUT
                      </span>
                      {activeProgram ? (
                        <WorkoutStatusBadge status={activeProgram.status} />
                      ) : draftProgram ? (
                        <WorkoutStatusBadge status={draftProgram.status} />
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-surface)] text-[var(--color-text-muted)] font-semibold border border-[var(--color-border)]">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {activeProgram ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-xs text-[var(--color-heading)] truncate">
                            {activeProgram.title}
                          </h5>
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                            v{activeProgram.version}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
                          <span>{activeProgram.schedule?.weeks || 4} wks</span>
                          <span>•</span>
                          <span>{activeProgram.schedule?.sessionsPerWeek || 3} days/wk</span>
                        </div>
                      </div>
                    ) : draftProgram ? (
                      <div className="space-y-1">
                        <h5 className="font-bold text-xs text-[var(--color-heading)] truncate">
                          {draftProgram.title} (Draft)
                        </h5>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          Draft program pending activation
                        </p>
                      </div>
                    ) : (
                      <div className="py-1">
                        <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                          No active workout program
                        </p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                          Prescribe a routine to begin workout tracking
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-2 border-t border-[var(--color-border)]/60">
                  {activeProgram || draftProgram ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectClientWorkspace(rel)}
                      className="w-full rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors"
                    >
                      <span>View Workouts</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onCreateProgramForClient(rel)}
                      className="w-full rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Program</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
