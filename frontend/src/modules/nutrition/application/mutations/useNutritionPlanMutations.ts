import { useMutation, useQueryClient } from '@tanstack/react-query';
import { nutritionRepository } from '../../infrastructure/repositories/NutritionRepository';
import { NUTRITION_QUERY_KEYS } from '../queryKeys';
import {
  CreateNutritionPlanDTO,
  UpdateNutritionPlanDTO,
  CreateNutritionPlanVersionDTO,
} from '../../domain/types/nutrition.types';

export const useCreateNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateNutritionPlanDTO) => nutritionRepository.createPlan(payload),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useUpdateNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, payload }: { planId: string; payload: UpdateNutritionPlanDTO }) =>
      nutritionRepository.updatePlan(planId, payload),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useCreateNutritionPlanVersion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      payload,
    }: {
      planId: string;
      payload?: CreateNutritionPlanVersionDTO;
    }) => nutritionRepository.createVersion(planId, payload),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useActivateNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.activatePlan(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useCompleteNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.completePlan(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useDeleteDraftNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.deleteDraftPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
    },
  });
};

export const useSubmitNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.submitPlan(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.pending(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useRecallNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.recallPlan(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.pending(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useAcceptNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.acceptPlan(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.pending(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useRejectNutritionPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, reason }: { planId: string; reason?: string }) =>
      nutritionRepository.rejectPlan(planId, reason),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.pending(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useRequestNutritionPlanDeletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.requestPlanDeletion(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useAcceptNutritionPlanDeletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.acceptPlanDeletion(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};

export const useRejectNutritionPlanDeletion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => nutritionRepository.rejectPlanDeletion(planId),
    onSuccess: (plan) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.all });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_QUERY_KEYS.plans.active(plan.coachingRelationshipId),
      });
      queryClient.invalidateQueries({ queryKey: NUTRITION_QUERY_KEYS.plans.detail(plan.id) });
    },
  });
};
