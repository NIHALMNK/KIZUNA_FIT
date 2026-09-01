'use client';

import React from 'react';
import Link from 'next/link';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Button } from '../../../../shared/components/ui/Button';
import { Apple, ArrowLeft } from 'lucide-react';

export default function ClientNutritionPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/client/coaching">
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-alt)] font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            My Coaching
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          PHASE 9 PREVIEW
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Nutrition & Meal Plans
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Your tailored macronutrient targets and daily meal plans will be displayed here.
        </p>
      </div>

      <EmptyState
        icon={<Apple className="w-12 h-12 text-[var(--color-text-muted)]" />}
        title="Nutrition Plans Module"
        description="Your coach will assign customized nutrition guidelines. This domain feature is scheduled for the upcoming Phase 9 Nutrition System release."
        action={
          <Link href="/client/coaching">
            <Button variant="primary" size="md" className="rounded-xl font-bold shadow-xs">
              Return to Coaching Overview
            </Button>
          </Link>
        }
      />
    </div>
  );
}
