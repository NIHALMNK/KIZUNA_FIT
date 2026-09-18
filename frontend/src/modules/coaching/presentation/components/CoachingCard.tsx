'use client';

import React from 'react';
import { CoachingRelationshipListItem } from '../../domain/types/coaching.types';
import { CoachingStatusBadge } from './CoachingStatusBadge';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { ChevronRight, Calendar, Clock } from 'lucide-react';

interface CoachingCardProps {
  relationship: CoachingRelationshipListItem;
  onSelect?: (relationshipId: string) => void;
  role?: 'CLIENT' | 'TRAINER';
}

export const CoachingCard: React.FC<CoachingCardProps> = ({
  relationship,
  onSelect,
  role = 'CLIENT',
}) => {
  const isTrainerRole = role === 'TRAINER';
  const participant = isTrainerRole ? relationship.client : relationship.trainer;

  const displayName =
    participant?.fullName ||
    (isTrainerRole
      ? `Client #${(relationship.client?.id || '').slice(-6)}`
      : `Coach #${(relationship.trainer?.id || '').slice(-6)}`);

  const avatarUrl = participant?.avatarUrl || undefined;
  const subtitle = isTrainerRole
    ? relationship.planType
      ? `${relationship.planType} Coaching Plan`
      : '1-on-1 Coaching'
    : participant?.specialization || 'Certified Coach';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const formatDate = (iso: string | null) => {
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

  const startedAtFormatted = formatDate(relationship.startedAt || relationship.createdAt);
  const endsAtFormatted = formatDate(relationship.endsAt || null);
  const durationText = relationship.durationDays ? `${relationship.durationDays} Days` : '30 Days';

  return (
    <div
      onClick={() => onSelect?.(relationship.relationshipId)}
      className="group p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xs hover:border-[var(--color-primary)]/50 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-4"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar
            src={avatarUrl}
            fallback={initials}
            size="md"
            className="ring-2 ring-[var(--color-border)] shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-base font-extrabold text-[var(--color-heading)] truncate group-hover:text-[var(--color-primary)] transition-colors">
              {displayName}
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] font-medium truncate">
              {subtitle}
            </p>
          </div>
        </div>
        <CoachingStatusBadge status={relationship.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)]">
        <div>
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Started
          </span>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {startedAtFormatted}
          </span>
        </div>
        <div>
          <span className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            {relationship.endsAt ? 'Expected End' : 'Duration'}
          </span>
          <span className="font-semibold text-[var(--color-text-primary)]">
            {relationship.endsAt ? endsAtFormatted : durationText}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs font-bold text-[var(--color-primary)] border-t border-[var(--color-border)]">
        <span>View Details</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};
