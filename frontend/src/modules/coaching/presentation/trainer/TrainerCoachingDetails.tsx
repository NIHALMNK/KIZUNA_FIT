'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCoachingRelationship } from '../../application/queries/useCoachingRelationship';
import { CoachingStatusBadge } from '../components/CoachingStatusBadge';
import { CoachingTimelineView } from '../components/CoachingTimelineView';
import { CompleteProgramModal } from './CompleteProgramModal';
import { CancelCoachingModal } from './CancelCoachingModal';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';
import {
  ArrowLeft,
  Dumbbell,
  Apple,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Code2,
  ChevronDown,
} from 'lucide-react';

interface TrainerCoachingDetailsProps {
  relationshipId: string;
  onBack?: () => void;
}

export const TrainerCoachingDetails: React.FC<TrainerCoachingDetailsProps> = ({
  relationshipId,
  onBack,
}) => {
  const { data: relationship, isLoading, error } = useCoachingRelationship(relationshipId);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  if (isLoading) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)] h-80" />
    );
  }

  if (error || !relationship) {
    return (
      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
        Failed to load coaching contract details. Please return to your roster.
      </div>
    );
  }

  const clientName =
    relationship.client?.fullName ||
    (relationship.clientId ? `Client #${relationship.clientId.slice(-6)}` : 'Assigned Client');

  const clientAvatarUrl = relationship.client?.avatarUrl || undefined;
  const clientInitials = clientName
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
  const planType = relationship.planType ? `${relationship.planType} Coaching` : '1-on-1 Coaching';
  const isActive = relationship.status === CoachingRelationshipStatus.ACTIVE;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Clients</span>
            </button>
          )}
        </div>

        {isActive && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCancelOpen(true)}
              className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 font-bold rounded-xl"
            >
              Cancel Contract
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCompleteOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
            >
              Complete Program
            </Button>
          </div>
        )}
      </div>

      {/* Primary Client Hero Card */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              Client Coaching Contract
            </span>
          </div>
          <CoachingStatusBadge status={relationship.status} />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <Avatar
            src={clientAvatarUrl}
            fallback={clientInitials}
            size="xl"
            className="ring-4 ring-[var(--color-border)] shrink-0 shadow-sm"
          />

          <div className="space-y-1 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight truncate">
              {clientName}
            </h1>
            <p className="text-sm font-semibold text-[var(--color-primary)]">{planType}</p>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Client ID: <span className="font-mono">{relationship.clientId}</span>
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
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
              Status
            </span>
            <span className="font-extrabold text-[var(--color-primary)] text-sm uppercase">
              {relationship.status}
            </span>
          </div>
        </div>
      </div>

      {/* Trainer Workspace Navigation */}
      <div>
        <h2 className="text-lg font-extrabold text-[var(--color-heading)] mb-3">
          Manage Client Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href={`/trainer/workouts?coachingRelationshipId=${relationship.relationshipId}`}
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Workout Builder
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Design custom exercise splits, set target rep ranges, and prescribe workout
                routines.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>Manage Workouts</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/trainer/nutrition"
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Nutrition Planner
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Configure caloric requirements, macronutrient breakdown, and meal plan guidelines.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>Manage Nutrition</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          <Link
            href="/trainer/progress"
            className="group p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
                Progress Review
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Review client check-ins, assess body composition trends, and log feedback notes.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
              <span>Review Progress</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </div>

      {/* Contract Detail Cards & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[var(--color-heading)]">Contract Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Client Name</span>
              <span className="font-bold text-[var(--color-text-primary)]">{clientName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-[var(--color-text-secondary)]">Status</span>
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

        <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs">
          <CoachingTimelineView
            timeline={relationship.timeline}
            createdAt={relationship.createdAt}
          />
        </div>
      </div>

      {/* Technical & Contract Details */}
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
                Payment ID
              </span>
              <span className="text-[var(--color-text-primary)] select-all">
                {relationship.paymentId}
              </span>
            </div>
          </div>
        )}
      </div>

      <CompleteProgramModal
        isOpen={isCompleteOpen}
        relationshipId={relationship.relationshipId}
        clientName={clientName}
        onClose={() => setIsCompleteOpen(false)}
      />

      <CancelCoachingModal
        isOpen={isCancelOpen}
        relationshipId={relationship.relationshipId}
        clientName={clientName}
        onClose={() => setIsCancelOpen(false)}
      />
    </div>
  );
};
