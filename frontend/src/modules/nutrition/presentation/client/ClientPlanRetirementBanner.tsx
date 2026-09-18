'use client';

import React, { useState } from 'react';
import { NutritionPlan } from '../../domain/types/nutrition.types';
import {
  useAcceptNutritionPlanDeletion,
  useRejectNutritionPlanDeletion,
} from '../../application/mutations/useNutritionPlanMutations';
import { Button } from '../../../../shared/components/ui/Button';
import { AlertTriangle, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface ClientPlanRetirementBannerProps {
  plan: NutritionPlan;
}

export const ClientPlanRetirementBanner: React.FC<ClientPlanRetirementBannerProps> = ({ plan }) => {
  const [actionError, setActionError] = useState<string | null>(null);

  const acceptMutation = useAcceptNutritionPlanDeletion();
  const rejectMutation = useRejectNutritionPlanDeletion();

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  const handleAccept = async () => {
    setActionError(null);
    try {
      await acceptMutation.mutateAsync(plan.id);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to confirm plan retirement.');
    }
  };

  const handleReject = async () => {
    setActionError(null);
    try {
      await rejectMutation.mutateAsync(plan.id);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to keep plan active.');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-rose-200 shadow-xs space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Plan Retirement Requested</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                  Action Required
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                Your coach has requested to retire your current nutrition plan &quot;{plan.title}
                &quot; (v{plan.version}).
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-2xl pt-1 font-medium">
            Confirming retirement will end this prescription. You will still have access to your
            historical logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isPending}
            className="rounded-xl font-bold text-xs border-rose-200 text-rose-750 hover:bg-rose-50"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" />
            Keep Plan Active
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAccept}
            disabled={isPending}
            className="rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            {acceptMutation.isPending ? 'Retiring...' : 'Confirm Retirement'}
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-xs font-bold text-rose-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}
    </div>
  );
};
