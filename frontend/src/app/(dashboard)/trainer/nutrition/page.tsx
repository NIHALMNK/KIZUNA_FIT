'use client';

import React from 'react';
import Link from 'next/link';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Button } from '../../../../shared/components/ui/Button';
import { Apple, ArrowLeft } from 'lucide-react';

export default function TrainerNutritionPage() {
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
          PHASE 9 PREVIEW
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Nutrition & Meal Planning
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Configure caloric targets, macronutrient goals, and dietary guidelines for your clients.
        </p>
      </div>

      <EmptyState
        icon={<Apple className="w-12 h-12 text-[var(--color-text-muted)]" />}
        title="Nutrition Planner Module"
        description="Configuring macronutrient splits and meal guides is scheduled for the upcoming Phase 9 Nutrition System release."
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
