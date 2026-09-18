import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { NUTRITION_QUERY_KEYS } from '../queryKeys';
import {
  StartNutritionCompletionDTO,
  UpdateNutritionCompletionDTO,
  CompleteNutritionCompletionDTO,
} from '../../domain/types/nutrition.types';

export const useStartNutritionCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartNutritionCompletionDTO) =>
      nutritionRepository.startCompletion(payload),
    onSuccess: (completion) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(completion.id),
      });
    },
  });
};

export const useUpdateNutritionCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      completionId,
      payload,
    }: {
      completionId: string;
      payload: UpdateNutritionCompletionDTO;
    }) => nutritionRepository.updateExecution(completionId, payload),
    onSuccess: (completion) => {
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(completion.id),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });
    },
  });
};

export const useCompleteNutritionCompletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      completionId,
      payload,
    }: {
      completionId: string;
      payload?: CompleteNutritionCompletionDTO;
    }) => nutritionRepository.completeCompletion(completionId, payload),
    onSuccess: (completion) => {
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.completions.detail(completion.id),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.completions.all });
    },
  });
};
