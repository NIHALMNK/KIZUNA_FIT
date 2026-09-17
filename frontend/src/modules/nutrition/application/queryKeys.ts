import {
  NutritionPlanFilterParams,
  NutritionCompletionFilterParams,
} from '../domain/types/nutrition.types';

export const NUTRITION_QUERY_KEYS = {
  all: ['nutrition'] as const,
  plans: {
    all: ['nutrition', 'plans'] as const,
    list: (params?: NutritionPlanFilterParams) => ['nutrition', 'plans', 'list', params] as const,
    detail: (planId: string) => ['nutrition', 'plans', 'detail', planId] as const,
    active: (coachingRelationshipId?: string) =>
      ['nutrition', 'plans', 'active', coachingRelationshipId] as const,
    pending: (coachingRelationshipId?: string) =>
      ['nutrition', 'plans', 'pending', coachingRelationshipId] as const,
  },
  completions: {
    all: ['nutrition', 'completions'] as const,
    list: (params?: NutritionCompletionFilterParams) =>
      ['nutrition', 'completions', 'list', params] as const,
    detail: (completionId: string) => ['nutrition', 'completions', 'detail', completionId] as const,
  },
} as const;
