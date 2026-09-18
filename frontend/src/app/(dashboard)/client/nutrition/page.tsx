import React, { Suspense } from 'react';
import { ClientNutritionWorkspace } from '../../../../modules/nutrition/presentation/client/ClientNutritionWorkspace';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';

export const metadata = {
  title: 'My Nutrition & Meal Plans | KIZUNAFIT',
  description:
    'View prescribed nutrition targets, log daily meals and hydration, and track daily adherence.',
};

export default function ClientNutritionPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          NUTRITION DOMAIN
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Nutrition & Meal Plans
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Follow your prescribed daily meal targets, log your meals and hydration, and record your
          nutrition feedback.
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading your nutrition plan..." />}>
        <ClientNutritionWorkspace />
      </Suspense>
    </div>
  );
}
