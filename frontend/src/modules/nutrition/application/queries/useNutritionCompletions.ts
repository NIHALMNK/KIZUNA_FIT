import { useQuery } from '@tanstack/react-query';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { NutritionCompletionFilterParams } from '../../domain/types/nutrition.types';
import { NUTRITION_QUERY_KEYS } from '../queryKeys';

export const useNutritionCompletions = (params?: NutritionCompletionFilterParams) => {
  return useQuery({
    queryKey: NUTRITION_QUERY_KEYS.completions.list(params),
    queryFn: () => nutritionRepository.listCompletions(params),
  });
};

export const useNutritionCompletionDetail = (completionId?: string) => {
  return useQuery({
    queryKey: completionId
      ? NUTRITION_QUERY_KEYS.completions.detail(completionId)
      : ['nutrition', 'completions', 'none'],
    queryFn: () =>
      completionId ? nutritionRepository.getCompletion(completionId) : Promise.reject('No ID'),
    enabled: !!completionId,
  });
};
