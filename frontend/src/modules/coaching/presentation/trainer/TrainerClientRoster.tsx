'use client';

import React, { useState } from 'react';
import { useCoachingRelationships } from '../../application/queries/useCoachingRelationships';
import { CoachingCard } from '../components/CoachingCard';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Users } from 'lucide-react';

interface TrainerClientRosterProps {
  onSelectRelationship?: (relationshipId: string) => void;
}

export const TrainerClientRoster: React.FC<TrainerClientRosterProps> = ({
  onSelectRelationship,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<CoachingRelationshipStatus | 'ALL'>('ALL');

  const { data, isLoading, error } = useCoachingRelationships({
    status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    limit: 50,
  });

  const filterTabs = [
    { label: 'All Clients', value: 'ALL' },
    { label: 'Active', value: CoachingRelationshipStatus.ACTIVE },
    { label: 'Completed', value: CoachingRelationshipStatus.COMPLETED },
    { label: 'Cancelled', value: CoachingRelationshipStatus.CANCELLED },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-border)] pb-3 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = selectedStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white shadow-xs'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-[var(--color-surface-alt)] animate-pulse border border-[var(--color-border)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-medium text-rose-600 dark:text-rose-400">
          Failed to load client coaching roster. Please try refreshing.
        </div>
      ) : data?.relationships.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10 text-[var(--color-text-muted)]" />}
          title="No clients found"
          description={
            selectedStatus === 'ALL'
              ? 'You do not have any active or past coaching clients yet.'
              : `No coaching contracts found with status "${selectedStatus}".`
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data?.relationships.map((rel) => (
            <CoachingCard
              key={rel.relationshipId}
              relationship={rel}
              role="TRAINER"
              onSelect={onSelectRelationship}
            />
          ))}
        </div>
      )}
    </div>
  );
};
