'use client';

import React from 'react';
import { useNutritionCompletions } from '../../application/queries/useNutritionCompletions';
import { NutritionCompletion } from '../../domain/types/nutrition.types';
import { NutritionCompletionStatusBadge } from '../components/NutritionCompletionStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Calendar, Droplets, Flame, History, ArrowRight, Star } from 'lucide-react';

interface ClientNutritionHistoryProps {
  onSelectCompletion: (completion: NutritionCompletion) => void;
}

export const ClientNutritionHistory: React.FC<ClientNutritionHistoryProps> = ({
  onSelectCompletion,
}) => {
  const { data: completionsData, isLoading } = useNutritionCompletions({ limit: 100 });
  const completions = completionsData?.completions || [];

  if (isLoading) {
    return <LoadingState message="Loading nutrition history..." />;
  }

  if (completions.length === 0) {
    return (
      <EmptyState
        icon={<History className="w-12 h-12 text-[var(--color-text-secondary)]" />}
        title="No nutrition history yet"
        description="Completed daily nutrition logs will be saved and displayed here."
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[var(--color-heading)] uppercase tracking-wider">
          Completed Nutrition Logs ({completions.length})
        </h3>
      </div>

      <div className="space-y-3">
        {completions.map((comp) => {
          const targetCalories = comp.nutritionDaySnapshot?.targetCalories || 0;
          const loggedCalories = comp.macroSummary?.totalCalories || 0;
          const targetHydration = comp.nutritionDaySnapshot?.hydrationGoal?.targetMl || 0;
          const loggedHydration = comp.hydrationSummary?.loggedMl || 0;

          return (
            <div
              key={comp.id}
              className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center px-2.5 h-7 rounded-xl bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-xs font-black text-[var(--color-heading)] uppercase shadow-2xs">
                    {comp.weekday ? comp.weekday.slice(0, 3) : `D${comp.dayNumber}`}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--color-heading)]">
                      {comp.weekday
                        ? `${comp.weekday.charAt(0) + comp.weekday.slice(1).toLowerCase()} Execution`
                        : comp.nutritionDaySnapshot?.name || `Day ${comp.dayNumber}`}
                    </h4>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                      {new Date(
                        comp.completionDate || comp.completedAt || comp.startedAt,
                      ).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <NutritionCompletionStatusBadge status={comp.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-950 shadow-2xs">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    {loggedCalories} / {targetCalories} kcal
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 shadow-2xs">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    {loggedHydration} / {targetHydration} ml
                  </span>
                  {comp.feedback?.rating && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 shadow-2xs">
                      <Star className="w-3.5 h-3.5 text-amber-600 fill-current" />
                      {comp.feedback.rating}/5
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectCompletion(comp)}
                  className="rounded-xl text-xs font-bold w-full sm:w-auto border-[var(--color-border)] hover:bg-[var(--color-surface-alt)]"
                >
                  View Log
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
