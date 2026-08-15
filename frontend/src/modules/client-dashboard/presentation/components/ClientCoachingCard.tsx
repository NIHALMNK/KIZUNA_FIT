'use client';

import React from 'react';
import Link from 'next/link';
import { CoachingRelationshipSummary } from '../../domain/types/clientDashboard.types';
import { Button } from '../../../../shared/components/ui/Button';
import { Avatar } from '../../../../shared/components/ui/Avatar';

interface ClientCoachingCardProps {
  relationship?: CoachingRelationshipSummary | null;
  isLoading?: boolean;
}

export const ClientCoachingCard: React.FC<ClientCoachingCardProps> = ({ relationship }) => {
  // STATE A: No Active Coaching Relationship (Discovery Hero)
  if (!relationship || relationship.status !== 'ACTIVE') {
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 transition-all">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
            YOUR JOURNEY
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--color-heading)] tracking-tight">
            Your coaching journey starts here.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] font-normal leading-relaxed max-w-xl">
            Find a certified trainer who matches your personal fitness goals and start your 1-on-1 coaching program.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/trainers">
            <Button
              variant="primary"
              size="md"
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-xs"
            >
              Find a Trainer
            </Button>
          </Link>
          <Link href="/client/requests">
            <Button
              variant="outline"
              size="md"
              className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
            >
              Explore Requests
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // STATE C: Active Coaching Relationship Hero
  const trainerName = relationship.trainerName || 'Assigned Coach';
  const programTitle = relationship.programTitle || '1-on-1 Personalized Coaching';
  const trainerInitials = trainerName.substring(0, 2).toUpperCase();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const startDateFormatted = formatDate(relationship.startedAt);
  const endDateFormatted = formatDate(relationship.endsAt);

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          YOUR COACHING
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Avatar
          src={relationship.trainerAvatarUrl}
          fallback={trainerInitials}
          size="lg"
          className="ring-2 ring-[var(--color-border)] shrink-0"
        />

        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-extrabold text-[var(--color-heading)] truncate">
            {trainerName}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium truncate">
            {programTitle}
          </p>
        </div>
      </div>

      {(startDateFormatted || endDateFormatted) && (
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs">
          {startDateFormatted && (
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Started</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{startDateFormatted}</span>
            </div>
          )}
          {endDateFormatted && (
            <div>
              <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase">Ends</span>
              <span className="font-semibold text-[var(--color-text-primary)]">{endDateFormatted}</span>
            </div>
          )}
        </div>
      )}

      <div className="pt-1">
        <Link href="/client/requests">
          <Button
            variant="outline"
            size="md"
            fullWidth
            className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
          >
            View Coaching
          </Button>
        </Link>
      </div>
    </div>
  );
};
