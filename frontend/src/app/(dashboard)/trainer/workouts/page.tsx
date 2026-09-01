'use client';

import React from 'react';
import Link from 'next/link';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Button } from '../../../../shared/components/ui/Button';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export default function TrainerWorkoutsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/trainer/coaching">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Client Roster
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          PHASE 8 PREVIEW
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Workout Builder & Programs
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Create customized training plans and prescribe exercise routines for your enrolled
          clients.
        </p>
      </div>

      <EmptyState
        icon={<Dumbbell className="w-12 h-12 text-[var(--color-text-muted)]" />}
        title="Workout Builder Module"
        description="Prescribing custom routines and exercise databases is scheduled for the upcoming Phase 8 Workout System release."
        action={
          <Link href="/trainer/coaching">
            <Button variant="primary" size="md" className="rounded-xl font-bold shadow-xs">
              Return to Client Roster
            </Button>
          </Link>
        }
      />
    </div>
  );
}
