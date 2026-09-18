import React from 'react';
import { NutritionPlan, NutritionPlanStatus } from '../../domain/types/nutrition.types';
import { NutritionPlanStatusBadge } from './NutritionPlanStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import {
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  Apple,
  Flame,
  Utensils,
  Droplets,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface NutritionPlanCardProps {
  plan: NutritionPlan;
  onSelect?: () => void;
  onActivate?: () => void;
  onSubmit?: () => void;
  onRecall?: () => void;
  onComplete?: () => void;
  onRequestDeletion?: () => void;
  onDeleteDraft?: () => void;
  onCreateVersion?: () => void;
  isActionLoading?: boolean;
}

export const NutritionPlanCard: React.FC<NutritionPlanCardProps> = ({
  plan,
  onSelect,
  onActivate,
  onSubmit,
  onRecall,
  onComplete,
  onRequestDeletion,
  onDeleteDraft,
  onCreateVersion,
  isActionLoading = false,
}) => {
  // Compute average or first day metrics for summary tiles
  const firstDay = plan.nutritionDays[0];
  const targetCalories = firstDay?.targetCalories || 0;
  const mealsCount = firstDay?.meals.length || 0;
  const hydrationMl = firstDay?.hydrationGoal?.targetMl || 0;

  const isActive = plan.status === NutritionPlanStatus.ACTIVE;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
      {/* Top Banner Row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isActive ? 'Active Nutrition Plan' : 'Nutrition Plan'}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                v{plan.version}
              </span>
              <NutritionPlanStatusBadge status={plan.status} size="sm" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{plan.title}</h3>
          </div>
        </div>

        {isActive && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Plan is Active — Client is following this plan</span>
          </div>
        )}
      </div>

      {plan.description && (
        <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">{plan.description}</p>
      )}

      {plan.rejectionReason && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span>Client Feedback / Revision Requested:</span>
          </div>
          <p className="italic pl-5">&quot;{plan.rejectionReason}&quot;</p>
        </div>
      )}

      {/* 5 Clean Stat Tiles in a Grid (Matching Reference Design) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {/* Duration */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">{plan.durationWeeks} weeks</div>
            <div className="text-[10px] text-slate-500">Duration</div>
          </div>
        </div>

        {/* Daily Target */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <Flame className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              {targetCalories > 0 ? `${targetCalories} kcal` : 'Varied'}
            </div>
            <div className="text-[10px] text-slate-500">Daily Target</div>
          </div>
        </div>

        {/* Meals Count */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <Utensils className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              {mealsCount > 0 ? `${mealsCount} meals` : 'Custom'}
            </div>
            <div className="text-[10px] text-slate-500">Per Day</div>
          </div>
        </div>

        {/* Hydration */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              {hydrationMl > 0 ? `${hydrationMl} ml` : '3000 ml'}
            </div>
            <div className="text-[10px] text-slate-500">Hydration</div>
          </div>
        </div>

        {/* Start / Update Date */}
        <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-purple-500 shrink-0" />
          <div>
            <div className="text-xs font-bold text-slate-900">
              {new Date(plan.updatedAt || plan.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div className="text-[10px] text-slate-500">
              {plan.activatedAt ? 'Started' : 'Updated'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
        {onSelect && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSelect}
            className="rounded-xl text-xs font-semibold border-slate-200"
          >
            View Details
          </Button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {plan.status === NutritionPlanStatus.DRAFT && (
            <>
              {onDeleteDraft && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeleteDraft}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete Draft
                </Button>
              )}
              {onSubmit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onSubmit}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold"
                >
                  Submit to Client
                </Button>
              )}
              {onActivate && !onSubmit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onActivate}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Activate Plan
                </Button>
              )}
            </>
          )}

          {plan.status === NutritionPlanStatus.PENDING_APPROVAL && onRecall && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRecall}
              disabled={isActionLoading}
              className="rounded-xl text-xs font-semibold text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              Recall Submission
            </Button>
          )}

          {plan.status === NutritionPlanStatus.ACTIVE && (
            <>
              {onRequestDeletion && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRequestDeletion}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Request Retirement
                </Button>
              )}
              {onCreateVersion && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCreateVersion}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold border-slate-200"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Edit / Fork Version
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onComplete}
                  disabled={isActionLoading}
                  className="rounded-xl text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Complete Plan
                </Button>
              )}
            </>
          )}

          {plan.status === NutritionPlanStatus.COMPLETED && onCreateVersion && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateVersion}
              disabled={isActionLoading}
              className="rounded-xl text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Create Version
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
