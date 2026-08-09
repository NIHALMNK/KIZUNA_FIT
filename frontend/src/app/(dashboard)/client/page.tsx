'use client';

import React from 'react';
import {
  useActiveCoaching,
  usePendingOffers,
  useUpcomingConsultations,
  useAssignedWorkouts,
  useAssignedNutrition,
  useCoachingEvaluations,
} from '../../../modules/client-dashboard/application/hooks/useClientDashboard';

import { ClientDashboardWelcome } from '../../../modules/client-dashboard/presentation/components/ClientDashboardWelcome';
import { ClientCoachingCard } from '../../../modules/client-dashboard/presentation/components/ClientCoachingCard';
import { ClientActionCard } from '../../../modules/client-dashboard/presentation/components/ClientActionCard';
import { ClientConsultationCard } from '../../../modules/client-dashboard/presentation/components/ClientConsultationCard';
import { ClientWorkoutCard } from '../../../modules/client-dashboard/presentation/components/ClientWorkoutCard';
import { ClientNutritionCard } from '../../../modules/client-dashboard/presentation/components/ClientNutritionCard';
import { ClientProgressCard } from '../../../modules/client-dashboard/presentation/components/ClientProgressCard';
import { ClientDashboardSkeleton } from '../../../modules/client-dashboard/presentation/components/ClientDashboardSkeleton';
import { ErrorState } from '../../../shared/components/feedback/ErrorState';

export default function ClientDashboard() {
  const { data: activeCoaching, isLoading: isLoadingCoaching, isError: isErrorCoaching, refetch: refetchCoaching } = useActiveCoaching();
  const { data: pendingOffers, isLoading: isLoadingOffers } = usePendingOffers();
  const { data: consultations, isError: isErrorConsultations, refetch: refetchConsultations } = useUpcomingConsultations();
  const { data: workouts, isError: isErrorWorkouts, refetch: refetchWorkouts } = useAssignedWorkouts();
  const { data: nutrition, isError: isErrorNutrition, refetch: refetchNutrition } = useAssignedNutrition();
  const { data: evaluations, isError: isErrorEvaluations, refetch: refetchEvaluations } = useCoachingEvaluations();

  // Full page skeleton loading during initial coaching fetch
  if (isLoadingCoaching || isLoadingOffers) {
    return <ClientDashboardSkeleton />;
  }

  const activeRelationship = activeCoaching?.[0] || null;
  const hasActiveCoaching = activeRelationship?.status === 'ACTIVE';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <ClientDashboardWelcome hasActiveCoaching={hasActiveCoaching} />

      {/* Primary Hero Section: Coaching Hero + Pending Action Required */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={pendingOffers && pendingOffers.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {isErrorCoaching ? (
            <ErrorState
              title="Unable to load coaching status"
              message="We encountered an issue fetching your coaching relationship details."
              onRetry={refetchCoaching}
            />
          ) : (
            <ClientCoachingCard relationship={activeRelationship} />
          )}
        </div>

        {pendingOffers && pendingOffers.length > 0 && (
          <div className="lg:col-span-1">
            <ClientActionCard offers={pendingOffers} />
          </div>
        )}
      </div>

      {/* Core Domain Grid: Workout Program & Nutrition Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isErrorWorkouts ? (
          <ErrorState
            title="Workout Data Unavailable"
            message="Could not load your assigned workout routines."
            onRetry={refetchWorkouts}
          />
        ) : (
          <ClientWorkoutCard programs={workouts} />
        )}

        {isErrorNutrition ? (
          <ErrorState
            title="Nutrition Data Unavailable"
            message="Could not load your assigned nutrition plan."
            onRetry={refetchNutrition}
          />
        ) : (
          <ClientNutritionCard plans={nutrition} />
        )}
      </div>

      {/* Secondary Domain Grid: Recent Progress & Upcoming Consultation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isErrorEvaluations ? (
          <ErrorState
            title="Progress Data Unavailable"
            message="Could not load recent evaluation records."
            onRetry={refetchEvaluations}
          />
        ) : (
          <ClientProgressCard evaluations={evaluations} />
        )}

        {isErrorConsultations ? (
          <ErrorState
            title="Consultations Unavailable"
            message="Could not load upcoming consultation schedule."
            onRetry={refetchConsultations}
          />
        ) : (
          <ClientConsultationCard consultations={consultations} />
        )}
      </div>
    </div>
  );
}
