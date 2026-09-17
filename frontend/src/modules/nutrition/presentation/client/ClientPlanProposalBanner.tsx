'use client';

import React, { useState } from 'react';
import { NutritionPlan } from '../../domain/types/nutrition.types';
import {
  useAcceptNutritionPlan,
  useRejectNutritionPlan,
} from '../../application/mutations/useNutritionPlanMutations';
import { NutritionDayCard } from '../components/NutritionDayCard';
import { Button } from '../../../../shared/components/ui/Button';
import { Textarea } from '../../../../shared/components/ui/Textarea';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  Layers,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface ClientPlanProposalBannerProps {
  proposal: NutritionPlan;
}

export const ClientPlanProposalBanner: React.FC<ClientPlanProposalBannerProps> = ({ proposal }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const acceptMutation = useAcceptNutritionPlan();
  const rejectMutation = useRejectNutritionPlan();

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  const handleAccept = async () => {
    setActionError(null);
    try {
      await acceptMutation.mutateAsync(proposal.id);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to accept nutrition plan.');
    }
  };

  const handleReject = async () => {
    setActionError(null);
    try {
      await rejectMutation.mutateAsync({
        planId: proposal.id,
        reason: rejectReason.trim() || undefined,
      });
      setIsRejecting(false);
      setRejectReason('');
    } catch (err: any) {
      setActionError(err?.message || 'Failed to request plan revision.');
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  New Nutrition Plan Proposal (v{proposal.version})
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                  Review Required
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                Your coach proposed a new nutrition prescription: &quot;{proposal.title}&quot;.
              </p>
            </div>
          </div>

          {proposal.description && (
            <p className="text-xs text-slate-700 max-w-2xl pt-1 font-medium">
              {proposal.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isRejecting && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRejecting(true)}
                disabled={isPending}
                className="rounded-xl font-bold text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <XCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />
                Request Changes
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                disabled={isPending}
                className="rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {acceptMutation.isPending
                  ? 'Activating...'
                  : `Accept & Activate v${proposal.version}`}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {proposal.durationWeeks} Weeks Duration
          </span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            {proposal.nutritionDays.length} Prescribed Days
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 font-bold text-emerald-700 hover:underline cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Prescription' : 'Review Plan Details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-xs font-bold text-rose-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Reject Reason Form */}
      {isRejecting && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Provide Feedback / Reason for Changes</span>
          </div>
          <Textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Tell your coach what needs adjustments (e.g., target calories, food preferences, schedule)..."
            rows={3}
            className="text-xs bg-white border-slate-200 text-slate-900"
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRejecting(false)}
              disabled={isPending}
              className="rounded-xl text-xs font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white"
            >
              {rejectMutation.isPending ? 'Submitting...' : 'Submit Feedback to Coach'}
            </Button>
          </div>
        </div>
      )}

      {/* Expanded Schedule Breakdown */}
      {isExpanded && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Proposed Weekday Prescriptions
          </span>
          <div className="space-y-3">
            {proposal.nutritionDays.map((day) => (
              <NutritionDayCard key={day.id} day={day} isEditable={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
