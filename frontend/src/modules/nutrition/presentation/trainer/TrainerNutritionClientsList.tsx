'use client';

import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useCoachingRelationships } from '../../../coaching/application/queries/useCoachingRelationships';
import { CoachingRelationshipListItem } from '../../../coaching/domain/types/coaching.types';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { NUTRITION_QUERY_KEYS } from '../../application/queryKeys';
import { NutritionPlan, NutritionPlanStatus } from '../../domain/types/nutrition.types';
import { NutritionPlanStatusBadge } from '../components/NutritionPlanStatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { EmptyState } from '../../../../shared/components/feedback/EmptyState';
import {
  Apple,
  Search,
  Plus,
  ArrowRight,
  Calendar,
  Layers,
  Users,
  CheckCircle2,
  Eye,
  AlertCircle,
  Flame,
  Activity,
} from 'lucide-react';

interface TrainerNutritionClientsListProps {
  onSelectClientWorkspace: (relationship: CoachingRelationshipListItem) => void;
  onCreatePlanForClient: (relationship: CoachingRelationshipListItem) => void;
  onEditPlanForClient?: (relationship: CoachingRelationshipListItem, plan: NutritionPlan) => void;
  onViewPlanForClient?: (relationship: CoachingRelationshipListItem, plan: NutritionPlan) => void;
}

export type ClientPlanStateType =
  'NO_PLAN' | 'ACTIVE' | 'PENDING_APPROVAL' | 'DELETION_PENDING' | 'DRAFT' | 'HISTORY_ONLY';

export interface ClientPlanState {
  type: ClientPlanStateType;
  hasNutritionHistory: boolean;
  statusLabel: string;
  actionLabel: 'Create Plan' | 'View Plan';
  activePlan?: NutritionPlan;
  pendingPlan?: NutritionPlan;
  draftPlan?: NutritionPlan;
  completedPlan?: NutritionPlan;
  primaryPlan?: NutritionPlan;
}

export function resolveClientPlanState(plans: NutritionPlan[]): ClientPlanState {
  const hasNutritionHistory = Boolean(plans && plans.length > 0);

  if (!hasNutritionHistory) {
    return {
      type: 'NO_PLAN',
      hasNutritionHistory: false,
      statusLabel: 'No Plan',
      actionLabel: 'Create Plan',
    };
  }

  const activePlan = plans.find((p) => p.status === NutritionPlanStatus.ACTIVE);
  const pendingPlan = plans.find((p) => p.status === NutritionPlanStatus.PENDING_APPROVAL);
  const deletionPendingPlan = plans.find((p) => p.status === NutritionPlanStatus.DELETION_PENDING);
  const draftPlans = plans
    .filter((p) => p.status === NutritionPlanStatus.DRAFT)
    .sort((a, b) => b.version - a.version);
  const draftPlan = draftPlans[0];

  const completedPlans = plans
    .filter(
      (p) =>
        p.status === NutritionPlanStatus.COMPLETED || p.status === NutritionPlanStatus.CANCELLED,
    )
    .sort((a, b) => b.version - a.version);
  const completedPlan = completedPlans[0];

  if (activePlan) {
    return {
      type: 'ACTIVE',
      hasNutritionHistory: true,
      statusLabel: 'Active Plan',
      actionLabel: 'View Plan',
      activePlan,
      pendingPlan,
      draftPlan,
      completedPlan,
      primaryPlan: activePlan,
    };
  }

  if (deletionPendingPlan) {
    return {
      type: 'DELETION_PENDING',
      hasNutritionHistory: true,
      statusLabel: 'Retirement Pending',
      actionLabel: 'View Plan',
      activePlan: deletionPendingPlan,
      completedPlan,
      primaryPlan: deletionPendingPlan,
    };
  }

  if (pendingPlan) {
    return {
      type: 'PENDING_APPROVAL',
      hasNutritionHistory: true,
      statusLabel: 'Pending Approval',
      actionLabel: 'View Plan',
      pendingPlan,
      completedPlan,
      primaryPlan: pendingPlan,
    };
  }

  if (draftPlan) {
    return {
      type: 'DRAFT',
      hasNutritionHistory: true,
      statusLabel: 'Draft',
      actionLabel: 'View Plan',
      draftPlan,
      completedPlan,
      primaryPlan: draftPlan,
    };
  }

  return {
    type: 'HISTORY_ONLY',
    hasNutritionHistory: true,
    statusLabel: 'Plan History',
    actionLabel: 'View Plan',
    completedPlan,
    primaryPlan: completedPlan || plans[0],
  };
}

export const TrainerNutritionClientsList: React.FC<TrainerNutritionClientsListProps> = ({
  onSelectClientWorkspace,
  onCreatePlanForClient,
  onViewPlanForClient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE_PLAN' | 'NO_PLAN'>('ALL');

  const { data: coachingData, isLoading: isLoadingCoaching } = useCoachingRelationships({
    limit: 100,
  });

  const relationships = coachingData?.relationships || [];

  const planQueries = useQueries({
    queries: relationships.map((rel) => ({
      queryKey: NUTRITION_QUERY_KEYS.plans.list({ coachingRelationshipId: rel.relationshipId }),
      queryFn: () => nutritionRepository.listPlans({ coachingRelationshipId: rel.relationshipId }),
      staleTime: 30000,
    })),
  });

  const isLoadingPlans = relationships.length > 0 && planQueries.some((q) => q.isLoading);

  // Group plans by coachingRelationshipId
  const plansByRelationship = React.useMemo(() => {
    const map = new Map<string, NutritionPlan[]>();
    relationships.forEach((rel, idx) => {
      const query = planQueries[idx];
      const relPlans = query?.data?.plans || [];
      map.set(rel.relationshipId, relPlans);
    });
    return map;
  }, [relationships, planQueries]);

  // Aggregate all plans across all clients
  const allPlans = React.useMemo(() => {
    const combined: NutritionPlan[] = [];
    plansByRelationship.forEach((list) => {
      combined.push(...list);
    });
    return combined;
  }, [plansByRelationship]);

  const totalClientsWithActivePlan = React.useMemo(() => {
    return relationships.filter((rel) => {
      const relPlans = plansByRelationship.get(rel.relationshipId) || [];
      return relPlans.some((p) => p.status === NutritionPlanStatus.ACTIVE);
    }).length;
  }, [relationships, plansByRelationship]);

  const totalClientsNeedsPlan = relationships.length - totalClientsWithActivePlan;

  // Filter clients
  const filteredClients = relationships.filter((rel) => {
    const clientName = rel.client?.fullName || `Client #${rel.client?.id?.slice(-6) || ''}`;
    const matchesSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rel.relationshipId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const relPlans = plansByRelationship.get(rel.relationshipId) || [];
    const state = resolveClientPlanState(relPlans);

    if (statusFilter === 'ACTIVE_PLAN') return state.type === 'ACTIVE';
    if (statusFilter === 'NO_PLAN') return state.type !== 'ACTIVE';
    return true;
  });

  if (isLoadingCoaching || isLoadingPlans) {
    return <LoadingState message="Loading client nutrition rosters..." />;
  }

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{relationships.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Active Clients</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalClientsWithActivePlan}</div>
            <div className="text-xs text-slate-500 font-medium">Active Nutrition Prescriptions</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3.5 shadow-xs">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{allPlans.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Plans Authored</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name or ID..."
            className="pl-9 rounded-xl text-xs bg-white border-slate-200"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            All ({relationships.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ACTIVE_PLAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'ACTIVE_PLAN'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Active Plan ({totalClientsWithActivePlan})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('NO_PLAN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'NO_PLAN'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Needs Plan ({totalClientsNeedsPlan})
          </button>
        </div>
      </div>

      {/* Client Roster Cards */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={<Users className="w-10 h-10 text-slate-400" />}
          title="No clients found"
          description={
            searchQuery
              ? 'No clients match your search criteria.'
              : 'You have no active coaching clients matching this filter.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((rel) => {
            const relPlans = plansByRelationship.get(rel.relationshipId) || [];
            const state = resolveClientPlanState(relPlans);
            const clientName = rel.client?.fullName || `Client #${rel.client?.id?.slice(-6) || ''}`;

            const targetCalories =
              state.activePlan?.nutritionDays[0]?.targetCalories ||
              state.primaryPlan?.nutritionDays[0]?.targetCalories ||
              0;

            const durationWeeks =
              state.activePlan?.durationWeeks || state.primaryPlan?.durationWeeks || 4;

            return (
              <div
                key={rel.relationshipId}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="space-y-3.5">
                  {/* Client Identity & Plan Status Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        fallback={clientName}
                        alt={clientName}
                        src={rel.client?.avatarUrl || undefined}
                        size="md"
                        className="shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{clientName}</h3>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {rel.planType || 'Premium'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Started{' '}
                          {rel.startedAt
                            ? new Date(rel.startedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recently'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {state.type === 'ACTIVE' ? (
                      <NutritionPlanStatusBadge
                        status={NutritionPlanStatus.ACTIVE}
                        label="Active Plan"
                        size="sm"
                      />
                    ) : state.type === 'PENDING_APPROVAL' ? (
                      <NutritionPlanStatusBadge
                        status={NutritionPlanStatus.PENDING_APPROVAL}
                        size="sm"
                      />
                    ) : state.type === 'DELETION_PENDING' ? (
                      <NutritionPlanStatusBadge
                        status={NutritionPlanStatus.DELETION_PENDING}
                        size="sm"
                      />
                    ) : state.type === 'DRAFT' ? (
                      <NutritionPlanStatusBadge status={NutritionPlanStatus.DRAFT} size="sm" />
                    ) : state.type === 'HISTORY_ONLY' ? (
                      <NutritionPlanStatusBadge
                        status="HISTORY_ONLY"
                        label="Plan History"
                        size="sm"
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        No Plan
                      </span>
                    )}
                  </div>

                  {/* Plan Summary Section */}
                  {state.type === 'ACTIVE' && state.activePlan ? (
                    <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {durationWeeks} weeks
                        </div>
                        <div className="text-[10px] text-slate-500">Duration</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {targetCalories > 0 ? `${targetCalories} kcal` : 'Custom'}
                        </div>
                        <div className="text-[10px] text-slate-500">Daily Target</div>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {state.activePlan.nutritionDays.length} Days
                        </div>
                        <div className="text-[10px] text-slate-500">Configured</div>
                      </div>
                    </div>
                  ) : state.type === 'PENDING_APPROVAL' && state.pendingPlan ? (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-950">
                          {state.pendingPlan.title}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">
                          v{state.pendingPlan.version} Pending
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Submitted to client. Awaiting review and approval.
                      </p>
                    </div>
                  ) : state.type === 'DELETION_PENDING' && state.activePlan ? (
                    <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-rose-950">Retirement Requested</span>
                        <span className="text-[10px] font-bold text-rose-700">
                          v{state.activePlan.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        Awaiting client confirmation to retire active plan.
                      </p>
                    </div>
                  ) : state.type === 'DRAFT' && state.draftPlan ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{state.draftPlan.title}</span>
                        <span className="text-[10px] font-bold text-slate-500">
                          v{state.draftPlan.version} Draft
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Draft in progress. Finish configuring to submit for client approval.
                      </p>
                    </div>
                  ) : state.type === 'HISTORY_ONLY' && state.completedPlan ? (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">Previous Plan Available</span>
                        <span className="text-[10px] font-bold text-slate-500">
                          v{state.completedPlan.version}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        History preserved. Open workspace to author next version.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 text-center text-xs text-slate-500 font-medium">
                      No nutrition plan prescribed yet.
                    </div>
                  )}
                </div>

                {/* Card Actions — Strictly following business rule */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectClientWorkspace(rel)}
                    className="rounded-xl text-xs font-semibold flex-1 border-slate-200 hover:bg-slate-50 text-slate-700"
                  >
                    Open Workspace
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>

                  {/* BUSINESS RULE: No history -> [Create Plan], History exists -> [View Plan] */}
                  {!state.hasNutritionHistory ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onCreatePlanForClient(rel)}
                      className="rounded-xl text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Create Plan
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectClientWorkspace(rel)}
                      className="rounded-xl text-xs font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      View Plan
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
