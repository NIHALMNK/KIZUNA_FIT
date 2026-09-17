import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  NutritionPlan,
  NutritionPlanStatus,
  NutritionPlanFilterParams,
  CreateNutritionPlanDTO,
  UpdateNutritionPlanDTO,
  CreateNutritionPlanVersionDTO,
} from '../../domain/types/nutrition.types';

export const nutritionPlanApi = {
  list: async (
    params?: NutritionPlanFilterParams,
  ): Promise<{ plans: NutritionPlan[]; total: number }> => {
    const res = await httpClient.get<any>('/nutrition-plans', { params });
    const plans: NutritionPlan[] = Array.isArray(res) ? res : res?.plans || res?.data || [];
    const total: number = Array.isArray(res)
      ? res.length
      : res?.total || res?.meta?.total || plans.length;
    return { plans, total };
  },

  getById: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.get<any>(`/nutrition-plans/${planId}`);
    return res && res.data && !res.id ? res.data : res;
  },

  getActive: async (coachingRelationshipId?: string): Promise<NutritionPlan | null> => {
    if (!coachingRelationshipId) {
      try {
        const res = await httpClient.get<any>('/nutrition-plans/assigned');
        return res && res.data !== undefined ? res.data : res;
      } catch (err: any) {
        if (err?.response?.status === 404 || err?.status === 404) {
          return null;
        }
        throw err;
      }
    }
    const params: NutritionPlanFilterParams = {
      status: NutritionPlanStatus.ACTIVE,
      coachingRelationshipId,
      limit: 1,
    };
    const { plans } = await nutritionPlanApi.list(params);
    return plans.length > 0 ? plans[0] : null;
  },

  getPending: async (coachingRelationshipId?: string): Promise<NutritionPlan | null> => {
    try {
      const url = coachingRelationshipId
        ? `/nutrition-plans/relationship/${coachingRelationshipId}/pending`
        : '/nutrition-plans/pending';
      const res = await httpClient.get<any>(url);
      return res && res.data !== undefined ? res.data : res;
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.status === 404) {
        return null;
      }
      throw err;
    }
  },

  create: async (payload: CreateNutritionPlanDTO): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>('/nutrition-plans', payload);
    return res && res.data && !res.id ? res.data : res;
  },

  update: async (planId: string, payload: UpdateNutritionPlanDTO): Promise<NutritionPlan> => {
    const res = await httpClient.put<any>(`/nutrition-plans/${planId}`, payload);
    return res && res.data && !res.id ? res.data : res;
  },

  createVersion: async (
    planId: string,
    payload?: CreateNutritionPlanVersionDTO,
  ): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/version`, payload || {});
    return res && res.data && !res.id ? res.data : res;
  },

  activate: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/activate`);
    return res && res.data && !res.id ? res.data : res;
  },

  submit: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/submit`);
    return res && res.data && !res.id ? res.data : res;
  },

  recall: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/recall`);
    return res && res.data && !res.id ? res.data : res;
  },

  accept: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/accept`);
    return res && res.data && !res.id ? res.data : res;
  },

  reject: async (planId: string, reason?: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/reject`, { reason });
    return res && res.data && !res.id ? res.data : res;
  },

  requestDeletion: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/request-deletion`);
    return res && res.data && !res.id ? res.data : res;
  },

  acceptDeletion: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/accept-deletion`);
    return res && res.data && !res.id ? res.data : res;
  },

  rejectDeletion: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/reject-deletion`);
    return res && res.data && !res.id ? res.data : res;
  },

  complete: async (planId: string): Promise<NutritionPlan> => {
    const res = await httpClient.post<any>(`/nutrition-plans/${planId}/complete`);
    return res && res.data && !res.id ? res.data : res;
  },

  deleteDraft: async (planId: string): Promise<void> => {
    await httpClient.delete<any>(`/nutrition-plans/${planId}`);
  },
};
