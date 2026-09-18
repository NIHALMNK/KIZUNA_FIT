'use client';

import React from 'react';
import Link from 'next/link';
import { AssignedNutritionPlan } from '../../domain/types/clientDashboard.types';
import { Button } from '../../../../shared/components/ui/Button';

interface ClientNutritionCardProps {
  plans?: AssignedNutritionPlan[];
}

export const ClientNutritionCard: React.FC<ClientNutritionCardProps> = ({ plans = [] }) => {
  const activePlan = plans.find((p) => p.status === 'ACTIVE') || plans[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-primary)]">
          NUTRITION PLAN
        </span>
        {activePlan && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        )}
      </div>

      {activePlan ? (
        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-[var(--color-heading)] truncate">
            {activePlan.title}
          </h3>
          {activePlan.assignedAt && (
            <p className="text-xs text-[var(--color-text-secondary)] font-normal">
              Assigned on {formatDate(activePlan.assignedAt)}
            </p>
          )}
        </div>
      ) : (
        <div className="py-2 space-y-1.5">
          <p className="text-sm font-bold text-[var(--color-heading)]">No active nutrition plan</p>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Tailored macro and meal guidelines will be displayed here when assigned.
          </p>
        </div>
      )}

      <Link href="/client/nutrition">
        <Button
          variant="outline"
          size="md"
          fullWidth
          className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] font-semibold rounded-xl"
        >
          View Nutrition
        </Button>
      </Link>
    </div>
  );
};
