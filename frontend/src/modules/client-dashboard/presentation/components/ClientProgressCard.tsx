'use client';

import React from 'react';
import Link from 'next/link';
import { CoachingEvaluationSummary } from '../../domain/types/clientDashboard.types';
import { Button } from '../../../../shared/components/ui/Button';

interface ClientProgressCardProps {
  evaluations?: CoachingEvaluationSummary[];
}

export const ClientProgressCard: React.FC<ClientProgressCardProps> = ({ evaluations = [] }) => {
  const latestEvaluation = evaluations[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          RECENT PROGRESS
        </span>
        {latestEvaluation && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--color-tag)] text-[var(--color-tag-text)] border border-[var(--color-border)]">
            Evaluated
          </span>
        )}
      </div>

      {latestEvaluation ? (
        <div className="space-y-2">
          <div className="text-xs text-[var(--color-text-muted)] font-bold uppercase">
            Latest evaluation: {formatDate(latestEvaluation.evaluatedAt)}
          </div>
          {latestEvaluation.summaryText && (
            <p className="text-xs text-[var(--color-text-secondary)] font-normal line-clamp-2 leading-relaxed">
              {latestEvaluation.summaryText}
            </p>
          )}
        </div>
      ) : (
        <div className="py-2 space-y-1.5">
          <p className="text-sm font-bold text-[var(--color-heading)]">No evaluations yet</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Your progress timeline will appear here after your trainer completes an evaluation.
          </p>
        </div>
      )}

      <Link href="/client/progress">
        <Button
          variant="outline"
          size="md"
          fullWidth
          className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
        >
          View Progress
        </Button>
      </Link>
    </div>
  );
};
