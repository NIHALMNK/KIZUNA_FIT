'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useActiveNutritionPlan,
  usePendingNutritionPlan,
  useNutritionPlans,
} from '../../application/queries/useNutritionPlans';
import { useCoachingRelationships } from '../../../coaching/application/queries/useCoachingRelationships';
import { useNutritionCompletions } from '../../application/queries/useNutritionCompletions';
import { NutritionCompletion, NutritionPlanStatus } from '../../domain/types/nutrition.types';
import { ClientActiveNutritionView } from './ClientActiveNutritionView';
import { ClientNutritionHistory } from './ClientNutritionHistory';
import { ClientPlanProposalBanner } from './ClientPlanProposalBanner';
import { ClientPlanApprovalView } from './ClientPlanApprovalView';
import { ClientPlanRetirementBanner } from './ClientPlanRetirementBanner';
import { Button } from '../../../../shared/components/ui/Button';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import { Apple, ArrowLeft, History, Sparkles, AlertCircle, Clock, FileCheck } from 'lucide-react';

export const ClientNutritionWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

  // Queries
  const { data: coachingData, isLoading: isLoadingCoaching } = useCoachingRelationships({
    limit: 10,
  });
  const primaryRel = coachingData?.relationships?.[0];

  const { data: activePlan, isLoading: isLoadingActivePlan } = useActiveNutritionPlan();
  const coachingRelationshipId = activePlan?.coachingRelationshipId || primaryRel?.relationshipId;

  const { data: pendingPlan, isLoading: isLoadingPendingPlan } =
    usePendingNutritionPlan(coachingRelationshipId);
  const { data: completionsData, isLoading: isLoadingCompletions } = useNutritionCompletions();

  // All plans in relationship to accurately distinguish Draft-only / History-only
  const { data: allPlansData, isLoading: isLoadingAllPlans } = useNutritionPlans(
    coachingRelationshipId ? { coachingRelationshipId } : undefined,
  );

  const plansList =
    allPlansData?.plans || (Array.isArray(allPlansData) ? (allPlansData as any) : []);

  const isLoading =
    isLoadingCoaching ||
    isLoadingActivePlan ||
    isLoadingPendingPlan ||
    isLoadingCompletions ||
    (!!coachingRelationshipId && isLoadingAllPlans);

  if (isLoading) {
    return <LoadingState message="Loading your nutrition plan..." />;
  }

  const handleSelectHistoryCompletion = (_completion: NutritionCompletion) => {
    setActiveTab('history');
  };

  // State determinations according to Authoritative Business Flow (Section 22):
  // CASE D: Active Plan exists
  const hasActivePlan = !!activePlan;

  // CASE C: Pending Approval exists (and no active plan)
  const hasPendingApprovalOnly = !activePlan && !!pendingPlan;

  // Check historical/draft status from plansList
  const hasOnlyDraftPlans =
    !activePlan &&
    !pendingPlan &&
    plansList.length > 0 &&
    plansList.every((p: any) => p.status === NutritionPlanStatus.DRAFT);

  const hasOnlyCompletedOrCancelledPlans =
    !activePlan &&
    !pendingPlan &&
    plansList.length > 0 &&
    plansList.every(
      (p: any) =>
        p.status === NutritionPlanStatus.COMPLETED || p.status === NutritionPlanStatus.CANCELLED,
    );

  const hasNoPlanHistory = !activePlan && !pendingPlan && plansList.length === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-emerald-600" />
            My Nutrition Plan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-500" />
            History ({completionsData?.completions?.length || 0})
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'history' ? (
        <ClientNutritionHistory onSelectCompletion={handleSelectHistoryCompletion} />
      ) : (
        <div className="space-y-6">
          {/* CASE D: Active Plan */}
          {hasActivePlan && (
            <>
              {/* Revision Proposal Banner (if trainer submitted a new version while active plan exists) */}
              {pendingPlan && <ClientPlanProposalBanner proposal={pendingPlan} />}

              {/* Retirement Request Banner (if any) */}
              {activePlan.status === NutritionPlanStatus.DELETION_PENDING && (
                <ClientPlanRetirementBanner plan={activePlan} />
              )}

              <ClientActiveNutritionView plan={activePlan} />
            </>
          )}

          {/* CASE C: Pending Approval (initial plan or after retirement) */}
          {hasPendingApprovalOnly && pendingPlan && <ClientPlanApprovalView plan={pendingPlan} />}

          {/* CASE B: Draft Only Waiting State */}
          {hasOnlyDraftPlans && (
            <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xs text-center space-y-4 max-w-xl mx-auto">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                <Clock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-slate-900">Nutrition Plan in Progress</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  Your coach is currently designing your customized weekly nutrition plan. Once they
                  submit it for your approval, you will be able to review and activate it here.
                </p>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Drafting Underway
                </span>
              </div>
            </div>
          )}

          {/* CASE E: Historical / Completed / Cancelled Only */}
          {hasOnlyCompletedOrCancelledPlans && (
            <EmptyState
              icon={<FileCheck className="w-12 h-12 text-slate-400" />}
              title="No Active Nutrition Plan"
              description="Your previous nutrition plan has completed or concluded. Your coach will prepare your next nutrition cycle soon. You can view your past meal tracking in the History tab."
              action={
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setActiveTab('history')}
                  className="rounded-xl font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <History className="w-4 h-4 mr-2 text-amber-500" />
                  View Tracking History
                </Button>
              }
            />
          )}

          {/* CASE A: No Plan History At All */}
          {hasNoPlanHistory && (
            <EmptyState
              icon={<Apple className="w-12 h-12 text-[var(--color-text-muted)]" />}
              title="No Nutrition Plan"
              description="Your coach has not created a nutrition plan for you yet. Once your coach designs and submits your weekly dietary program, you can review and activate it here."
              action={
                <Link href="/client/coaching">
                  <Button variant="primary" size="md" className="rounded-xl font-bold shadow-xs">
                    Return to Coaching
                  </Button>
                </Link>
              }
            />
          )}
        </div>
      )}
    </div>
  );
};
