import { useQuery } from '@tanstack/react-query';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { NutritionPlanFilterParams } from '../../domain/types/nutrition.types';
import { NUTRITION_QUERY_KEYS } from '../queryKeys';

export const useNutritionPlans = (params?: NutritionPlanFilterParams) => {
  return useQuery({
    queryKey: NUTRITION_QUERY_KEYS.plans.list(params),
    queryFn: () => nutritionRepository.listPlans(params),
  });
};

export const useNutritionPlanDetail = (planId?: string) => {
  return useQuery({
    queryKey: planId ? NUTRITION_QUERY_KEYS.plans.detail(planId) : ['nutrition', 'plans', 'none'],
    queryFn: () => (planId ? nutritionRepository.getPlan(planId) : Promise.reject('No ID')),
    enabled: !!planId,
  });
};

export const useActiveNutritionPlan = (coachingRelationshipId?: string) => {
  return useQuery({
    queryKey: NUTRITION_QUERY_KEYS.plans.active(coachingRelationshipId),
    queryFn: () => nutritionRepository.getActivePlan(coachingRelationshipId),
  });
};

export const usePendingNutritionPlan = (coachingRelationshipId?: string) => {
  return useQuery({
    queryKey: NUTRITION_QUERY_KEYS.plans.pending(coachingRelationshipId),
    queryFn: () => nutritionRepository.getPendingPlan(coachingRelationshipId),
  });
};
