'use client';

import React, { useState } from 'react';
import { NutritionPlan } from '../../domain/types/nutrition.types';
import {
  useAcceptNutritionPlan,
  useRejectNutritionPlan,
} from '../../application/mutations/useNutritionPlanMutations';
import { ClientPlanReviewModal } from './ClientPlanReviewModal';
import { Button } from '../../../../shared/components/ui/Button';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import { Dialog, DialogFooter } from '../../../../shared/components/ui/Dialog';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  Layers,
  Flame,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface ClientPlanApprovalViewProps {
  plan: NutritionPlan;
}

export const ClientPlanApprovalView: React.FC<ClientPlanApprovalViewProps> = ({ plan }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const acceptMutation = useAcceptNutritionPlan();
  const rejectMutation = useRejectNutritionPlan();

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  const totalDays = plan.nutritionDays?.length || 0;
  const avgCalories =
    totalDays > 0
      ? Math.round(
          plan.nutritionDays.reduce((sum, d) => sum + (d.targetCalories || 0), 0) / totalDays,
        )
      : 0;

  const handleAcceptConfirm = async () => {
    setActionError(null);
    try {
      await acceptMutation.mutateAsync(plan.id);
      setIsAcceptConfirmOpen(false);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to accept nutrition plan.');
    }
  };

  const handleRejectConfirm = async () => {
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({
        planId: plan.id,
        reason: rejectReason.trim() || undefined,
      });
      setIsRejectConfirmOpen(false);
      setRejectReason('');
    } catch (err: any) {
      setActionError(err?.message || 'Failed to request plan revision.');
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {/* Top Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-50/70 via-white to-slate-50 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                  Nutrition Plan Ready for Review
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  Your trainer has prepared a nutrition plan for you.
                </p>
              </div>
            </div>

            {plan.description && (
              <p className="text-xs sm:text-sm text-slate-700 pt-1 font-medium leading-relaxed">
                {plan.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Awaiting Your Approval
            </span>
          </div>
        </div>

        {/* Plan Specification Grid */}
        <div className="p-6 sm:p-8 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Plan
            </span>
            <p
              className="text-sm sm:text-base font-extrabold text-slate-900 truncate"
              title={plan.title}
            >
              {plan.title}
            </p>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">
              Version {plan.version}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Duration
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900">
              {plan.durationWeeks} {plan.durationWeeks === 1 ? 'week' : 'weeks'}
            </p>
            <span className="text-[10px] font-medium text-slate-500">Program length</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Days Configured
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900">
              {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </p>
            <span className="text-[10px] font-medium text-slate-500">Weekly master schedule</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Daily Target
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900">
              {avgCalories > 0 ? `${avgCalories} kcal` : 'Custom Macros'}
            </p>
            <span className="text-[10px] font-medium text-slate-500">Average target energy</span>
          </div>
        </div>

        {/* Action Error (if any) */}
        {actionError && (
          <div className="p-4 mx-6 sm:mx-8 my-2 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Dedicated Action Bar */}
        <div className="p-6 sm:p-8 bg-slate-50/60 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-medium">
            Review the prescribed weekly meals, meal times, macros, and food alternatives before
            activating.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsReviewOpen(true)}
              className="rounded-xl font-bold text-xs sm:text-sm border-slate-300 text-slate-800 hover:bg-slate-100 shadow-2xs"
            >
              <Eye className="w-4 h-4 mr-2 text-slate-600" />
              Review Plan
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => setIsRejectConfirmOpen(true)}
              disabled={isPending}
              className="rounded-xl font-bold text-xs sm:text-sm border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              <XCircle className="w-4 h-4 mr-2 text-rose-500" />
              Reject Plan
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => setIsAcceptConfirmOpen(true)}
              disabled={isPending}
              className="rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Plan Review Modal */}
      <ClientPlanReviewModal
        plan={plan}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onOpenAccept={() => setIsAcceptConfirmOpen(true)}
        onOpenReject={() => setIsRejectConfirmOpen(true)}
      />

      {/* Accept Confirmation Dialog */}
      <Dialog
        isOpen={isAcceptConfirmOpen}
        onClose={() => !isPending && setIsAcceptConfirmOpen(false)}
        title="Accept this nutrition plan?"
        description="Once accepted, this plan becomes your active nutrition prescription and you can begin tracking your meals."
        className="bg-white border-slate-200 text-slate-900"
      >
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Ready to start tracking?</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Your Monday-Sunday meal schedule will be unlocked immediately for daily food
                tracking, alternatives, and hydration logging.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAcceptConfirmOpen(false)}
            disabled={isPending}
            className="rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAcceptConfirm}
            disabled={isPending}
            className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
          >
            {acceptMutation.isPending ? 'Activating...' : 'Accept Plan'}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        isOpen={isRejectConfirmOpen}
        onClose={() => !isPending && setIsRejectConfirmOpen(false)}
        title="Reject this nutrition plan?"
        description="Your trainer will be able to revise the draft and submit it again."
        className="bg-white border-slate-200 text-slate-900"
      >
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
            <MessageSquare className="w-4 h-4 text-slate-600" />
            <span>Revision Feedback (Optional)</span>
          </div>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Tell your trainer what needs adjustment (e.g. food allergies, meal timing, target calories, recipe alternatives)..."
            rows={3}
            className="text-xs bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsRejectConfirmOpen(false)}
            disabled={isPending}
            className="rounded-xl text-xs font-bold border-slate-200 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectConfirm}
            disabled={isPending}
            className="rounded-xl text-xs font-bold border-rose-200 text-rose-700 hover:bg-rose-50"
          >
            {rejectMutation.isPending ? 'Rejecting...' : 'Reject Plan'}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};
