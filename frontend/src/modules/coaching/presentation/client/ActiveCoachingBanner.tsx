'use client';

import React from 'react';
import Link from 'next/link';
import { CoachingRelationship } from '../../domain/types/coaching.types';
import { CoachingStatusBadge } from '../components/CoachingStatusBadge';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Button } from '../../../../shared/components/ui/Button';

interface ActiveCoachingBannerProps {
  relationship?: CoachingRelationship | null;
  isLoading?: boolean;
}

export const ActiveCoachingBanner: React.FC<ActiveCoachingBannerProps> = ({
  relationship,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse h-28 border border-[var(--color-border)]" />
    );
  }

  if (!relationship) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
            YOUR COACHING
          </span>
          <h3 className="text-lg font-extrabold text-[var(--color-heading)]">
            No Active Coaching Program
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md leading-relaxed">
            Connect with a certified personal trainer to begin customized 1-on-1 workouts and
            nutrition plans.
          </p>
        </div>
        <Link href="/trainers">
          <Button
            variant="primary"
            size="md"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs shrink-0"
          >
            Find a Trainer
          </Button>
        </Link>
      </div>
    );
  }

  const trainerName =
    relationship.trainer?.fullName ||
    (relationship.trainerId ? `Coach #${relationship.trainerId.slice(-6)}` : 'Assigned Coach');
  const trainerAvatarUrl = relationship.trainer?.avatarUrl || undefined;
  const trainerSpecialization = relationship.trainer?.specialization || 'Certified Coach';
  const trainerInitials = trainerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <Avatar
          src={trainerAvatarUrl}
          fallback={trainerInitials}
          size="lg"
          className="ring-2 ring-[var(--color-border)] shrink-0"
        />

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
              Active Contract
            </span>
            <CoachingStatusBadge status={relationship.status} />
          </div>
          <h3 className="text-lg font-extrabold text-[var(--color-heading)] truncate">
            {trainerName}
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">
            {trainerSpecialization}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link href="/client/coaching">
          <Button
            variant="outline"
            size="md"
            className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
          >
            View Coaching
          </Button>
        </Link>
      </div>
    </div>
  );
};
