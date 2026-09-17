'use client';

import React, { useState } from 'react';
import { CoachingRelationshipListItem } from '../../../coaching/domain/types/coaching.types';
import { useNutritionPlans } from '../../application/queries/useNutritionPlans';
import { useNutritionCompletions } from '../../application/queries/useNutritionCompletions';
import {
  useCompleteNutritionPlan,
  useDeleteDraftNutritionPlan,
  useCreateNutritionPlanVersion,
  useSubmitNutritionPlan,
  useRecallNutritionPlan,
  useRequestNutritionPlanDeletion,
} from '../../application/mutations/useNutritionPlanMutations';
import {
  NutritionPlan,
  NutritionPlanStatus,
  CreateNutritionPlanVersionDTO,
  MealCompletionStatus,
  NutritionCompletionStatus,
  Weekday,
} from '../../domain/types/nutrition.types';
import { normalizeCalendarDateString } from '../../utils/nutritionDateUtils';
import { NutritionPlanCard } from '../components/NutritionPlanCard';
import { NutritionDayCard } from '../components/NutritionDayCard';
import { NutritionPlanStatusBadge } from '../components/NutritionPlanStatusBadge';
import {
  NutritionCompletionStatusBadge,
  MealCompletionStatusBadge,
} from '../components/NutritionCompletionStatusBadge';
import { MacroTargetDisplay } from '../components/MacroTargetDisplay';
import { HydrationGoalDisplay } from '../components/HydrationGoalDisplay';
import { NutritionPlanVersionModal } from './NutritionPlanVersionModal';
import { Button } from '../../../../shared/components/ui/Button';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import {
  ArrowLeft,
  Plus,
  Apple,
  Sparkles,
  Layers,
  History,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Flame,
  Utensils,
  CheckCircle2,
  Activity,
  Copy,
  FileDown,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
  X,
  FileText,
  Send,
} from 'lucide-react';

const ALL_WEEKDAYS: Weekday[] = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY,
  Weekday.SUNDAY,
];

const WEEKDAY_SHORT: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'Mon',
  [Weekday.TUESDAY]: 'Tue',
  [Weekday.WEDNESDAY]: 'Wed',
  [Weekday.THURSDAY]: 'Thu',
  [Weekday.FRIDAY]: 'Fri',
  [Weekday.SATURDAY]: 'Sat',
  [Weekday.SUNDAY]: 'Sun',
};

const WEEKDAY_NAMES: Record<Weekday, string> = {
  [Weekday.MONDAY]: 'Monday',
  [Weekday.TUESDAY]: 'Tuesday',
  [Weekday.WEDNESDAY]: 'Wednesday',
  [Weekday.THURSDAY]: 'Thursday',
  [Weekday.FRIDAY]: 'Friday',
  [Weekday.SATURDAY]: 'Saturday',
  [Weekday.SUNDAY]: 'Sunday',
};

function getTodayWeekday(): Weekday {
  const dayIndex = new Date().getDay();
  const map: Record<number, Weekday> = {
    0: Weekday.SUNDAY,
    1: Weekday.MONDAY,
    2: Weekday.TUESDAY,
    3: Weekday.WEDNESDAY,
    4: Weekday.THURSDAY,
    5: Weekday.FRIDAY,
    6: Weekday.SATURDAY,
  };
  return map[dayIndex] || Weekday.MONDAY;
}

interface TrainerClientNutritionWorkspaceProps {
  relationship: CoachingRelationshipListItem;
  onBack: () => void;
  onCreatePlan: () => void;
  onEditPlan: (plan: NutritionPlan) => void;
  onCreateNewVersion: (basePlan: NutritionPlan) => void;
  onViewPlan: (plan: NutritionPlan) => void;
}

export const TrainerClientNutritionWorkspace: React.FC<TrainerClientNutritionWorkspaceProps> = ({
  relationship,
  onBack,
  onCreatePlan,
  onEditPlan,
  onCreateNewVersion,
  onViewPlan,
}) => {
  const [selectedPlanForVersion, setSelectedPlanForVersion] = useState<NutritionPlan | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Workspace Navigation Tabs
  const [workspaceTab, setWorkspaceTab] = useState<'overview' | 'weekly' | 'execution' | 'history'>(
    'overview',
  );

  // Selected Weekday for Master Schedule Day View
  const todayWeekday = getTodayWeekday();
  const [selectedWeekday, setSelectedWeekday] = useState<Weekday>(todayWeekday);

  // Copy Day Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [targetCopyDays, setTargetCopyDays] = useState<Weekday[]>([]);

  // Date Navigation State for Client Execution Inspection
  const [selectedExecutionDate, setSelectedExecutionDate] = useState<Date>(() => new Date());

  // Queries
  const { data: plansData, isLoading: isLoadingPlans } = useNutritionPlans({
    coachingRelationshipId: relationship.relationshipId,
  });

  const { data: completionsData } = useNutritionCompletions({
    coachingRelationshipId: relationship.relationshipId,
    limit: 100,
  });

  // Mutations
  const completePlanMutation = useCompleteNutritionPlan();
  const deleteDraftMutation = useDeleteDraftNutritionPlan();
  const createVersionMutation = useCreateNutritionPlanVersion();
  const submitPlanMutation = useSubmitNutritionPlan();
  const recallPlanMutation = useRecallNutritionPlan();
  const requestDeletionMutation = useRequestNutritionPlanDeletion();

  const plans = plansData?.plans || [];
  const hasAnyHistory = plans.length > 0;
  const activePlan = plans.find(
    (p) =>
      p.status === NutritionPlanStatus.ACTIVE || p.status === NutritionPlanStatus.DELETION_PENDING,
  );
  const pendingPlans = plans.filter((p) => p.status === NutritionPlanStatus.PENDING_APPROVAL);
  const draftPlans = plans.filter((p) => p.status === NutritionPlanStatus.DRAFT);
  const completedPlans = plans.filter(
    (p) => p.status === NutritionPlanStatus.COMPLETED || p.status === NutritionPlanStatus.CANCELLED,
  );
  const highestVersionPlan =
    plans.length > 0
      ? plans.reduce((prev, cur) => (cur.version > prev.version ? cur : prev), plans[0])
      : null;

  const clientName =
    relationship.client?.fullName || `Client #${relationship.client?.id?.slice(-6) || ''}`;

  const isMutating =
    completePlanMutation.isPending ||
    deleteDraftMutation.isPending ||
    createVersionMutation.isPending ||
    submitPlanMutation.isPending ||
    recallPlanMutation.isPending ||
    requestDeletionMutation.isPending;

  // Selected Day from Active Plan
  const currentPrescribedDay =
    activePlan?.nutritionDays.find((d) => d.weekday === selectedWeekday) ||
    activePlan?.nutritionDays[0];

  // Execution Date helpers
  const selectedDateYMD = normalizeCalendarDateString(selectedExecutionDate);
  const completions = completionsData?.completions || [];
  const selectedCompletion = completions.find((c) => {
    if (!c.completionDate && !c.startedAt) return false;
    const compDate = normalizeCalendarDateString(c.completionDate || c.startedAt);
    return compDate === selectedDateYMD;
  });

  const executionSummary = React.useMemo(() => {
    if (!selectedCompletion) return null;

    const prescribedMeals = selectedCompletion.nutritionDaySnapshot?.meals || [];
    const mealCompletions = selectedCompletion.mealCompletions || [];

    let completedMeals = 0;
    let partialMeals = 0;
    let skippedMeals = 0;
    let untrackedMeals = 0;

    for (const meal of prescribedMeals) {
      const rec = mealCompletions.find((m) => m.mealId === meal.mealId);
      if (!rec || rec.state === MealCompletionStatus.NOT_TRACKED) {
        untrackedMeals++;
      } else if (rec.state === MealCompletionStatus.COMPLETED) {
        completedMeals++;
      } else if (rec.state === MealCompletionStatus.PARTIALLY_COMPLETED) {
        partialMeals++;
      } else if (rec.state === MealCompletionStatus.SKIPPED) {
        skippedMeals++;
      }
    }

    return {
      totalMeals: prescribedMeals.length,
      completedMeals,
      partialMeals,
      skippedMeals,
      untrackedMeals,
      caloriesLogged: selectedCompletion.macroSummary?.totalCalories ?? 0,
      caloriesTarget: selectedCompletion.nutritionDaySnapshot?.targetCalories ?? 0,
      proteinLogged: selectedCompletion.macroSummary?.protein ?? 0,
      proteinTarget: selectedCompletion.nutritionDaySnapshot?.dailyMacroTargets?.protein ?? 0,
      carbsLogged: selectedCompletion.macroSummary?.carbohydrates ?? 0,
      carbsTarget: selectedCompletion.nutritionDaySnapshot?.dailyMacroTargets?.carbohydrates ?? 0,
      fatsLogged: selectedCompletion.macroSummary?.fats ?? 0,
      fatsTarget: selectedCompletion.nutritionDaySnapshot?.dailyMacroTargets?.fats ?? 0,
      hydrationLogged: selectedCompletion.hydrationSummary?.loggedMl ?? 0,
      hydrationTarget: selectedCompletion.nutritionDaySnapshot?.hydrationGoal?.targetMl ?? 0,
      status: selectedCompletion.status,
    };
  }, [selectedCompletion]);

  const handleRequestDeletion = async (planId: string) => {
    if (
      !confirm(
        'Request retirement for this active plan? The client will be prompted to accept before it is retired.',
      )
    ) {
      return;
    }
    setActionError(null);
    try {
      await requestDeletionMutation.mutateAsync(planId);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to request plan retirement.');
    }
  };

  const handleOpenVersionModal = (plan: NutritionPlan) => {
    setSelectedPlanForVersion(plan);
    setIsVersionModalOpen(true);
  };

  const handleVersionSubmit = async (payload: CreateNutritionPlanVersionDTO) => {
    if (!selectedPlanForVersion) return;
    setActionError(null);
    try {
      await createVersionMutation.mutateAsync({
        planId: selectedPlanForVersion.id,
        payload,
      });
      setIsVersionModalOpen(false);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to create new version.');
    }
  };

  if (isLoadingPlans) {
    return <LoadingState message="Loading client nutrition workspace..." />;
  }

  // Active Plan Daily Targets & Hydration calculation
  const overallTargetCalories =
    currentPrescribedDay?.targetCalories || activePlan?.nutritionDays[0]?.targetCalories || 2200;
  const overallTargetMacros = currentPrescribedDay?.dailyMacroTargets ||
    activePlan?.nutritionDays[0]?.dailyMacroTargets || {
      calories: overallTargetCalories,
      protein: 160,
      carbohydrates: 220,
      fats: 70,
    };
  const overallHydrationTarget =
    currentPrescribedDay?.hydrationGoal?.targetMl ||
    activePlan?.nutritionDays[0]?.hydrationGoal?.targetMl ||
    3000;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={onBack} className="hover:text-slate-900 transition-colors">
          Clients
        </button>
        <span>/</span>
        <span className="text-slate-700 font-medium">{clientName}</span>
        <span>/</span>
        <span className="text-emerald-600 font-bold">Nutrition</span>
      </div>

      {/* Client Profile Header Card (Matching Reference Design) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar
              fallback={clientName}
              alt={clientName}
              src={relationship.client?.avatarUrl || undefined}
              size="lg"
              className="shrink-0 ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900">{clientName}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {relationship.planType || 'Premium'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Started{' '}
                {relationship.startedAt
                  ? new Date(relationship.startedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Active'}{' '}
                • 16 weeks • Active Coaching
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Clients
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setWorkspaceTab('history')}
              className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
            >
              <History className="w-4 h-4 mr-1.5 text-slate-500" />
              View History
            </Button>

            {/* Context-sensitive Primary Action Button */}
            {!hasAnyHistory ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onCreatePlan}
                className="rounded-xl font-semibold text-xs shadow-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create Plan
              </Button>
            ) : activePlan ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEditPlan(activePlan)}
                className="rounded-xl font-semibold text-xs shadow-xs"
                disabled={isMutating}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Edit / New Version
              </Button>
            ) : pendingPlans.length > 0 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onViewPlan(pendingPlans[0])}
                className="rounded-xl font-semibold text-xs shadow-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isMutating}
              >
                <Clock className="w-4 h-4 mr-1.5" />
                View Pending Plan
              </Button>
            ) : draftPlans.length > 0 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEditPlan(draftPlans[0])}
                className="rounded-xl font-semibold text-xs shadow-xs"
                disabled={isMutating}
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Edit Draft
              </Button>
            ) : highestVersionPlan ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onCreateNewVersion(highestVersionPlan)}
                className="rounded-xl font-semibold text-xs shadow-xs"
                disabled={isMutating}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Create New Plan
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Navigation Tabs (Matching Reference Design) */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setWorkspaceTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            workspaceTab === 'overview'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => setWorkspaceTab('weekly')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            workspaceTab === 'weekly'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Weekly Plan
        </button>
        <button
          type="button"
          onClick={() => setWorkspaceTab('execution')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            workspaceTab === 'execution'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Client Progress
        </button>
        <button
          type="button"
          onClick={() => setWorkspaceTab('history')}
          className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
            workspaceTab === 'history'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          History ({plans.length})
        </button>
      </div>

      {/* Main Two-Column Layout for Overview & Weekly Tabs */}
      {workspaceTab === 'overview' || workspaceTab === 'weekly' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2/3 COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Revision Banner when active plan also exists */}
            {activePlan && pendingPlans.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-emerald-950 font-semibold">
                    <span className="font-bold">v{pendingPlans[0].version} Pending Approval:</span>{' '}
                    New revision submitted to client. Current active prescription remains active
                    until accepted.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => recallPlanMutation.mutate(pendingPlans[0].id)}
                    disabled={recallPlanMutation.isPending}
                    className="rounded-xl text-xs font-semibold border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900"
                  >
                    {recallPlanMutation.isPending ? 'Recalling...' : 'Recall to Draft'}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onViewPlan(pendingPlans[0])}
                    className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    View Pending Plan
                  </Button>
                </div>
              </div>
            )}

            {/* Active Plan Overview Card */}
            {activePlan ? (
              <NutritionPlanCard
                plan={activePlan}
                onSelect={() => onViewPlan(activePlan)}
                onRequestDeletion={
                  activePlan.status === NutritionPlanStatus.ACTIVE
                    ? () => handleRequestDeletion(activePlan.id)
                    : undefined
                }
                onComplete={() => completePlanMutation.mutate(activePlan.id)}
                onCreateVersion={() => handleOpenVersionModal(activePlan)}
                isActionLoading={isMutating}
              />
            ) : pendingPlans.length > 0 ? (
              /* Dedicated Pending Approval Card (Initial V1 or replacement) */
              <div className="p-6 rounded-2xl bg-white border border-emerald-200/90 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Clock className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {pendingPlans[0].title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                            Awaiting Client Approval
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Version v{pendingPlans[0].version} • Submitted{' '}
                          {pendingPlans[0].submittedAt
                            ? new Date(pendingPlans[0].submittedAt).toLocaleDateString()
                            : 'recently'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => recallPlanMutation.mutate(pendingPlans[0].id)}
                      disabled={recallPlanMutation.isPending}
                      className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      {recallPlanMutation.isPending ? 'Recalling...' : 'Recall to Draft'}
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onViewPlan(pendingPlans[0])}
                      className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      View Plan
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">
                      {pendingPlans[0].durationWeeks} weeks
                    </div>
                    <div className="text-[11px] text-slate-500">Duration</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {pendingPlans[0].nutritionDays[0]?.targetCalories || 'Custom'} kcal
                    </div>
                    <div className="text-[11px] text-slate-500">Daily Target</div>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {pendingPlans[0].nutritionDays.length} Days
                    </div>
                    <div className="text-[11px] text-slate-500">Configured</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
                  <span className="font-bold">Client review is pending.</span> This plan will become
                  active and available for tracking once the client accepts it.
                </div>
              </div>
            ) : draftPlans.length > 0 ? (
              /* Dedicated Draft Card */
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                        <FileText className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {draftPlans[0].title}
                          </h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                            Draft (v{draftPlans[0].version})
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last edited {new Date(draftPlans[0].updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPlan(draftPlans[0])}
                      className="rounded-xl text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      Edit Draft
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => submitPlanMutation.mutate(draftPlans[0].id)}
                      disabled={submitPlanMutation.isPending}
                      className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      {submitPlanMutation.isPending
                        ? 'Submitting...'
                        : 'Submit for Client Approval'}
                    </Button>
                  </div>
                </div>

                {draftPlans[0].rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                      Client Requested Changes:
                    </span>
                    <p className="pl-5 italic text-slate-700">
                      &quot;{draftPlans[0].rejectionReason}&quot;
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-200 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-emerald-600">
                  <Apple className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">No active nutrition plan</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    This client currently has no active nutrition prescription. Create a plan to set
                    up daily targets and meals.
                  </p>
                </div>
                {!hasAnyHistory ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onCreatePlan}
                    className="rounded-xl font-semibold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create Plan
                  </Button>
                ) : highestVersionPlan ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onCreateNewVersion(highestVersionPlan)}
                    className="rounded-xl font-semibold text-xs"
                    disabled={isMutating}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Create New Plan
                  </Button>
                ) : null}
              </div>
            )}

            {/* Weekly Schedule Strip (Matching Reference Design) */}
            {activePlan && (
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Weekly Schedule</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>
                      Today:{' '}
                      <span className="font-bold text-slate-900">
                        {WEEKDAY_NAMES[todayWeekday]}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 7 Weekday Cards in a Horizontal Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {ALL_WEEKDAYS.map((wd) => {
                    const dayConfig = activePlan.nutritionDays.find((d) => d.weekday === wd);
                    const isSelected = selectedWeekday === wd;
                    const dayKcal = dayConfig?.targetCalories || 0;

                    return (
                      <button
                        key={wd}
                        type="button"
                        onClick={() => setSelectedWeekday(wd)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col justify-between items-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white border-slate-200/90 text-slate-800 hover:border-emerald-500/50'
                        }`}
                      >
                        <span
                          className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}
                        >
                          {WEEKDAY_SHORT[wd]}
                        </span>
                        <span
                          className={`text-[11px] font-semibold mt-1 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}
                        >
                          {dayKcal > 0 ? `${dayKcal} kcal` : '—'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Day Plan Detail */}
            {activePlan && currentPrescribedDay && (
              <NutritionDayCard
                day={currentPrescribedDay}
                isEditable={false}
                onCopyDay={() => {
                  setTargetCopyDays([]);
                  setIsCopyModalOpen(true);
                }}
              />
            )}
          </div>

          {/* RIGHT 1/3 COLUMN — METRIC RINGS, HYDRATION, QUICK ACTIONS */}
          <div className="space-y-6">
            {/* Daily Nutrition Targets Card (Circular Progress Rings) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Daily Nutrition Targets</h3>
              </div>

              <MacroTargetDisplay
                variant="rings"
                targetCalories={overallTargetCalories}
                macros={overallTargetMacros}
              />
            </div>

            {/* Hydration Target Card */}
            <HydrationGoalDisplay
              targetMl={overallHydrationTarget}
              loggedMl={executionSummary?.hydrationLogged ?? 0}
            />

            {/* Quick Actions Card (Matching Reference Design) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>

              <div className="space-y-2">
                {activePlan && (
                  <button
                    type="button"
                    onClick={() => onEditPlan(activePlan)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors text-left"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Edit / New Version</span>
                  </button>
                )}

                {activePlan && activePlan.status === NutritionPlanStatus.ACTIVE && (
                  <button
                    type="button"
                    onClick={() => handleRequestDeletion(activePlan.id)}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-rose-100 hover:bg-rose-50 text-xs font-semibold text-rose-700 transition-colors text-left"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Request Plan Retirement</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setWorkspaceTab('execution')}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors text-left"
                >
                  <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>View Client Progress</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('PDF export feature is ready for generation.')}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors text-left"
                >
                  <FileDown className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Download Plan (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Opening messages with ' + clientName)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Send Message</span>
                </button>
              </div>

              {/* Informative Callout */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-900">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Need to make changes?</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Create a new version and submit it for your client&apos;s review. Current active
                    plan stays active until approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : workspaceTab === 'execution' ? (
        /* CLIENT PROGRESS / EXECUTION INSPECTION TAB */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Client Daily Adherence Inspection
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect client-reported meal logs, hydration, and nutritional compliance.
                </p>
              </div>

              {/* Date Navigator */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const prev = new Date(selectedExecutionDate);
                    prev.setDate(prev.getDate() - 1);
                    setSelectedExecutionDate(prev);
                  }}
                  className="rounded-xl p-2 border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900">
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {selectedExecutionDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = new Date(selectedExecutionDate);
                    next.setDate(next.getDate() + 1);
                    setSelectedExecutionDate(next);
                  }}
                  className="rounded-xl p-2 border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Adherence Summary Tiles & Detailed Execution Breakdown */}
            {executionSummary && selectedCompletion ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-center">
                    <div className="text-xl font-bold text-emerald-900">
                      {executionSummary.completedMeals} / {executionSummary.totalMeals}
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      Completed Meals
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-center">
                    <div className="text-xl font-bold text-amber-900">
                      {executionSummary.partialMeals}
                    </div>
                    <div className="text-[11px] font-semibold text-amber-700 mt-0.5">
                      Partially Completed
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 text-center">
                    <div className="text-xl font-bold text-rose-900">
                      {executionSummary.skippedMeals}
                    </div>
                    <div className="text-[11px] font-semibold text-rose-700 mt-0.5">
                      Skipped Meals
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-xl font-bold text-slate-800">
                      {executionSummary.untrackedMeals}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                      Not Tracked
                    </div>
                  </div>
                </div>

                {/* Factual Daily Macro Footprint */}
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Daily Actual Consumption vs Prescribed Target
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Calculated from actual items & alternatives consumed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[11px] font-medium text-slate-500">Calories</div>
                      <div className="text-base font-bold text-slate-900">
                        {executionSummary.caloriesLogged}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {executionSummary.caloriesTarget} kcal
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[11px] font-medium text-slate-500">Protein</div>
                      <div className="text-base font-bold text-slate-900">
                        {executionSummary.proteinLogged}g{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {executionSummary.proteinTarget}g
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[11px] font-medium text-slate-500">Carbs</div>
                      <div className="text-base font-bold text-slate-900">
                        {executionSummary.carbsLogged}g{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {executionSummary.carbsTarget}g
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200">
                      <div className="text-[11px] font-medium text-slate-500">Fats</div>
                      <div className="text-base font-bold text-slate-900">
                        {executionSummary.fatsLogged}g{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {executionSummary.fatsTarget}g
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200 col-span-2 sm:col-span-1">
                      <div className="text-[11px] font-medium text-slate-500">Hydration</div>
                      <div className="text-base font-bold text-slate-900">
                        {executionSummary.hydrationLogged} ml{' '}
                        <span className="text-xs font-normal text-slate-500">
                          / {executionSummary.hydrationTarget} ml
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescribed Meals Detailed Breakdown */}
                {selectedCompletion.nutritionDaySnapshot?.meals && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Prescribed Meals Execution Details
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500">
                        Factual client execution record
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedCompletion.nutritionDaySnapshot.meals.map((meal) => {
                        const mealRec = selectedCompletion.mealCompletions?.find(
                          (m) => m.mealId === meal.mealId,
                        );
                        const mealState = mealRec?.state || MealCompletionStatus.NOT_TRACKED;
                        const consumedItems = (mealRec?.consumedItems || []) as any[];

                        // Calculate actual meal macros directly from consumed items or recorded macros
                        let actualCals = mealRec?.consumedCalories ?? 0;
                        let actualProtein = mealRec?.consumedMacros?.protein ?? 0;
                        let actualCarbs = mealRec?.consumedMacros?.carbohydrates ?? 0;
                        let actualFats = mealRec?.consumedMacros?.fats ?? 0;

                        if (actualCals === 0 && consumedItems.length > 0) {
                          consumedItems.forEach((ci) => {
                            actualCals += Number(ci.calories || 0);
                            actualProtein += Number(ci.protein || 0);
                            actualCarbs += Number(ci.carbohydrates || 0);
                            actualFats += Number(ci.fats || 0);
                          });
                        }

                        return (
                          <div
                            key={meal.mealId}
                            className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                                  <Utensils className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">
                                      {meal.name}
                                    </span>
                                    {meal.timeOfDay && (
                                      <span className="text-[11px] font-medium text-slate-500">
                                        {meal.timeOfDay}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Target: {meal.targetCalories} kcal • P:{' '}
                                    {meal.targetMacros?.protein ?? 0}g • C:{' '}
                                    {meal.targetMacros?.carbohydrates ?? 0}g • F:{' '}
                                    {meal.targetMacros?.fats ?? 0}g
                                  </div>
                                </div>
                              </div>

                              <MealCompletionStatusBadge status={mealState} size="sm" />
                            </div>

                            {/* Factual execution details */}
                            {mealState === MealCompletionStatus.SKIPPED ? (
                              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200/60 text-xs text-rose-800 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                <span>
                                  Client marked this meal as skipped
                                  {mealRec?.notes ? `: ${mealRec.notes}` : '.'}
                                </span>
                              </div>
                            ) : mealState === MealCompletionStatus.NOT_TRACKED ? (
                              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-600 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                <span>Not tracked yet by client. (Untouched)</span>
                              </div>
                            ) : (
                              <div className="space-y-2.5">
                                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                  Prescribed Foods & Consumption
                                </div>
                                <div className="space-y-1.5">
                                  {meal.foodEntries.map((food, idx) => {
                                    const matchedItem = consumedItems.find(
                                      (ci) =>
                                        (food.id && ci.prescribedFoodId === food.id) ||
                                        (ci.prescribedFoodName &&
                                          ci.prescribedFoodName.trim().toLowerCase() ===
                                            food.name.trim().toLowerCase()) ||
                                        (food.id && ci.id === food.id) ||
                                        (ci.name &&
                                          ci.name.trim().toLowerCase() ===
                                            food.name.trim().toLowerCase()),
                                    );

                                    const isExecuted = !!matchedItem;
                                    const isAlt =
                                      matchedItem?.consumedType === 'ALTERNATIVE' ||
                                      (matchedItem && matchedItem.alternativeName);
                                    const consumedFoodName =
                                      matchedItem?.consumedFoodName ||
                                      matchedItem?.alternativeName ||
                                      matchedItem?.name ||
                                      food.name;
                                    const consumedQty = matchedItem?.quantity ?? food.quantity;
                                    const consumedUnit = matchedItem?.unit ?? food.unit;
                                    const itemCals = matchedItem?.calories ?? food.calories;
                                    const itemP = matchedItem?.protein ?? food.protein;
                                    const itemC = matchedItem?.carbohydrates ?? food.carbohydrates;
                                    const itemF = matchedItem?.fats ?? food.fats;

                                    return (
                                      <div
                                        key={food.id || idx}
                                        className={`p-2.5 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                          isAlt
                                            ? 'bg-purple-50/50 border-purple-200/80'
                                            : isExecuted
                                              ? 'bg-emerald-50/40 border-emerald-200/70'
                                              : 'bg-slate-50/50 border-slate-200/60 text-slate-500'
                                        }`}
                                      >
                                        <div className="flex items-start sm:items-center gap-2">
                                          <span
                                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 sm:mt-0 ${
                                              isExecuted
                                                ? isAlt
                                                  ? 'bg-purple-700 text-white'
                                                  : 'bg-emerald-600 text-white'
                                                : 'bg-slate-200 text-slate-600'
                                            }`}
                                          >
                                            {isExecuted ? '✓' : '✕'}
                                          </span>
                                          <div>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span
                                                className={`font-semibold ${
                                                  isExecuted ? 'text-slate-900' : 'text-slate-500'
                                                }`}
                                              >
                                                Prescribed: {food.name}
                                              </span>
                                              <span className="text-[11px] text-slate-500">
                                                ({food.quantity} {food.unit})
                                              </span>
                                            </div>

                                            {isAlt && (
                                              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                                                <span className="text-[11px] font-bold text-purple-900">
                                                  Consumed instead: {consumedFoodName} (
                                                  {consumedQty} {consumedUnit})
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                                  ALTERNATIVE
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="text-[11px] text-slate-600 shrink-0 self-end sm:self-auto">
                                          {isAlt ? (
                                            <span className="font-semibold text-purple-900">
                                              {itemCals} kcal • P: {itemP}g • C: {itemC}g • F:{' '}
                                              {itemF}g
                                            </span>
                                          ) : isExecuted ? (
                                            <span className="font-semibold text-emerald-900">
                                              {itemCals} kcal • P: {itemP}g • C: {itemC}g • F:{' '}
                                              {itemF}g
                                            </span>
                                          ) : (
                                            <span className="text-slate-400 font-medium">
                                              Not consumed
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Actual Meal Nutrition Footprint */}
                                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-100 font-medium">
                                  <span className="text-slate-500">Actual Meal Consumption:</span>
                                  <div className="flex items-center gap-3 font-bold text-slate-800">
                                    <span>{actualCals} kcal</span>
                                    <span className="text-slate-300">•</span>
                                    <span>P: {actualProtein}g</span>
                                    <span className="text-slate-300">•</span>
                                    <span>C: {actualCarbs}g</span>
                                    <span className="text-slate-300">•</span>
                                    <span>F: {actualFats}g</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                No tracking record submitted by client for this date.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* HISTORY TAB */
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Plan Version History ({plans.length})
          </h3>

          <div className="space-y-3">
            {plans.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{p.title}</span>
                      <span className="text-xs font-bold text-slate-500">v{p.version}</span>
                      <NutritionPlanStatusBadge status={p.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.durationWeeks} weeks • {p.nutritionDays.length} days configured • Created{' '}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPlan(p)}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Inspect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy Day Modal */}
      {isCopyModalOpen && currentPrescribedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Copy {WEEKDAY_NAMES[currentPrescribedDay.weekday]} Plan
              </h3>
              <button
                type="button"
                onClick={() => setIsCopyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select which weekdays to overwrite with a deep copy of{' '}
              <span className="font-bold text-slate-900">
                {WEEKDAY_NAMES[currentPrescribedDay.weekday]}
              </span>
              .
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {ALL_WEEKDAYS.filter((w) => w !== currentPrescribedDay.weekday).map((wd) => {
                const isSelected = targetCopyDays.includes(wd);
                return (
                  <button
                    key={wd}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setTargetCopyDays((prev) => prev.filter((d) => d !== wd));
                      } else {
                        setTargetCopyDays((prev) => [...prev, wd]);
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {WEEKDAY_NAMES[wd]}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCopyModalOpen(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert(
                    `Copied ${WEEKDAY_NAMES[currentPrescribedDay.weekday]} to: ${targetCopyDays.map((d) => WEEKDAY_NAMES[d]).join(', ')}`,
                  );
                  setIsCopyModalOpen(false);
                }}
                disabled={targetCopyDays.length === 0}
                className="rounded-xl text-xs"
              >
                Apply Copy ({targetCopyDays.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Version Creation Modal */}
      <NutritionPlanVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        basePlan={selectedPlanForVersion}
        onSubmit={handleVersionSubmit}
        isLoading={createVersionMutation.isPending}
      />
    </div>
  );
};
