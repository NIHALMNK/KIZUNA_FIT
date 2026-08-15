import { useQuery } from '@tanstack/react-query';
import { clientDashboardApi } from '../../infrastructure/api/clientDashboardApi';

export const CLIENT_DASHBOARD_KEYS = {
  activeCoaching: ['client-dashboard', 'active-coaching'] as const,
  upcomingConsultations: ['client-dashboard', 'upcoming-consultations'] as const,
  pendingOffers: ['client-dashboard', 'pending-offers'] as const,
  assignedWorkouts: ['client-dashboard', 'assigned-workouts'] as const,
  assignedNutrition: ['client-dashboard', 'assigned-nutrition'] as const,
  evaluations: ['client-dashboard', 'evaluations'] as const,
};

export const useActiveCoaching = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.activeCoaching,
    queryFn: () => clientDashboardApi.getActiveCoaching(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useUpcomingConsultations = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.upcomingConsultations,
    queryFn: () => clientDashboardApi.getUpcomingConsultations(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const usePendingOffers = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.pendingOffers,
    queryFn: () => clientDashboardApi.getPendingOffers(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useAssignedWorkouts = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.assignedWorkouts,
    queryFn: () => clientDashboardApi.getAssignedWorkouts(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useAssignedNutrition = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.assignedNutrition,
    queryFn: () => clientDashboardApi.getAssignedNutrition(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useCoachingEvaluations = () => {
  return useQuery({
    queryKey: CLIENT_DASHBOARD_KEYS.evaluations,
    queryFn: () => clientDashboardApi.getCoachingEvaluations(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
