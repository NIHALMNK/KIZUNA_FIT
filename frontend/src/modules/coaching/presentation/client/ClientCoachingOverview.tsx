'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CoachingRelationship } from '../../domain/types/coaching.types';
import { CoachingStatusBadge } from '../components/CoachingStatusBadge';
import { CoachingTimelineView } from '../components/CoachingTimelineView';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  Code2,
  ChevronDown,
} from 'lucide-react';

interface ClientCoachingOverviewProps {
  relationship: CoachingRelationship;
}

export const ClientCoachingOverview: React.FC<ClientCoachingOverviewProps> = ({ relationship }) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const trainerName =
    relationship.trainer?.fullName ||
    (relationship.trainerId ? `Coach #${relationship.trainerId.slice(-6)}` : 'Assigned Coach');

  const trainerAvatarUrl = relationship.trainer?.avatarUrl || undefined;
  const trainerSpecialization = relationship.trainer?.specialization || 'Certified Personal Coach';

  const trainerInitials = trainerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const formatDate = (iso?: string | null) => {
    if (!iso) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const startedAtFormatted = formatDate(
    relationship.startedAt || relationship.timeline.activatedAt || relationship.createdAt,
  );
  const endsAtFormatted = formatDate(relationship.endsAt);
  const durationText = relationship.durationDays
    ? `${relationship.durationDays} Days (${Math.round(relationship.durationDays / 30)} Mo)`
    : '30 Days (1 Mo)';
  const planType = relationship.planType ? `${relationship.planType} Plan` : 'Pro Coaching';

  return (
    <div className="space-y-6">
      {/* Primary Coach & Contract Hero Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              Active 1-on-1 Coaching
            </span>
          </div>
          <CoachingStatusBadge status={relationship.status} />
        </div>

        {/* Coach Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar
            src={trainerAvatarUrl}
            fallback={trainerInitials}
            size="xl"
            className="ring-4 ring-[var(--color-border)] shrink-0 shadow-sm"
          />

          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight truncate">
              {trainerName}
            </h1>
            <p className="text-sm font-semibold text-[var(--color-primary)]">
              {trainerSpecialization}
            </p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Dedicated 1-on-1 personal training, nutrition guidance & weekly progress reviews.
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs">
          <div>
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Started
            </span>
            <span className="font-extrabold text-[var(--color-text-primary)] text-sm">
              {startedAtFormatted}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Expected End
            </span>
            <span className="font-extrabold text-[var(--color-text-primary)] text-sm">
              {endsAtFormatted}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Duration
            </span>
            <span className="font-extrabold text-[var(--color-text-primary)] text-sm">
              {durationText}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
              Program Tier
            </span>
            <span className="font-extrabold text-[var(--color-primary)] text-sm">{planType}</span>
          </div>
        </div>
      </div>

      {/* Quick Access to Downstream Coaching Features */}
      <div>
        <h2 className="text-lg font-extrabold text-[var(--color-heading)] mb-3">
          Your Coaching Workspace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/client/workouts"
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Workout Programs
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Assigned training routines, prescribed exercise sets, and form demonstration videos.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>View Workouts</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/client/nutrition"
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Nutrition Plans
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Personalized macronutrient splits, calorie targets, and dietary guidance.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>View Nutrition</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/client/progress"
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Progress Tracking
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Log body weight trends, strength milestone metrics, and view coach evaluations.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>Track Progress</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Grid: Program Details & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Overview */}
        <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[var(--color-heading)]">Program Overview</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Assigned Coach</span>
              <span className="font-bold text-[var(--color-text-primary)]">{trainerName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Specialization</span>
              <span className="font-semibold text-[var(--color-text-primary)]">
                {trainerSpecialization}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Program Status</span>
              <CoachingStatusBadge status={relationship.status} />
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Duration</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{durationText}</span>
            </div>

            {relationship.cancellationReason && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                <span className="font-bold">Cancellation Reason: </span>
                {relationship.cancellationReason}
              </div>
            )}
          </div>
        </div>

        {/* Timeline View */}
        <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs">
          <CoachingTimelineView
            timeline={relationship.timeline}
            createdAt={relationship.createdAt}
          />
        </div>
      </div>

      {/* Technical & Contract Details (Collapsible for Clean UX) */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden shadow-xs">
        <button
          onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          className="w-full flex items-center justify-between p-4 px-6 text-left hover:bg-[var(--color-surface-alt)] transition-colors"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text-secondary)]">
            <Code2 className="w-4 h-4" />
            <span>Technical & Contract Identifiers</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 ${
              showTechnicalDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showTechnicalDetails && (
          <div className="p-6 pt-2 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="block text-[10px] font-sans font-bold text-[var(--color-text-muted)] uppercase">
                Contract Relationship ID
              </span>
              <span className="text-[var(--color-text-primary)] select-all">
                {relationship.relationshipId}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-sans font-bold text-[var(--color-text-muted)] uppercase">
                Acquisition Pipeline ID
              </span>
              <span className="text-[var(--color-text-primary)] select-all">
                {relationship.acquisitionPipelineId}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-sans font-bold text-[var(--color-text-muted)] uppercase">
                Subscription ID
              </span>
              <span className="text-[var(--color-text-primary)] select-all">
                {relationship.subscriptionId}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-sans font-bold text-[var(--color-text-muted)] uppercase">
                Payment Record ID
              </span>
              <span className="text-[var(--color-text-primary)] select-all">
                {relationship.paymentId}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
