import React, { Suspense } from 'react';
import { TrainerNutritionWorkspace } from '../../../../modules/nutrition/presentation/trainer/TrainerNutritionWorkspace';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';

export const metadata = {
  title: 'Nutrition Management | KIZUNAFIT Trainer',
  description: 'Manage client nutrition plans, macronutrient targets, and dietary guidelines.',
};

export default function TrainerNutritionPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          NUTRITION DOMAIN
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-heading)] tracking-tight">
          Nutrition & Meal Planning
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
          Configure caloric targets, macronutrient goals, and dietary guidelines for your clients.
        </p>
      </div>

      <Suspense fallback={<LoadingState message="Loading nutrition workspace..." />}>
        <TrainerNutritionWorkspace />
      </Suspense>
    </div>
  );
}
