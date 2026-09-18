import { INutritionRepository } from '../../domain/repositories/INutritionRepository';
import {
  NutritionPlan,
  NutritionCompletion,
  NutritionPlanFilterParams,
  NutritionCompletionFilterParams,
  CreateNutritionPlanDTO,
  UpdateNutritionPlanDTO,
  CreateNutritionPlanVersionDTO,
  StartNutritionCompletionDTO,
  UpdateNutritionCompletionDTO,
  CompleteNutritionCompletionDTO,
} from '../../domain/types/nutrition.types';
import { nutritionPlanApi } from '../api/nutritionPlanApi';
import { nutritionCompletionApi } from '../api/nutritionCompletionApi';

export class NutritionRepository implements INutritionRepository {
  // Plan operations
  async listPlans(
    params?: NutritionPlanFilterParams,
  ): Promise<{ plans: NutritionPlan[]; total: number }> {
    return nutritionPlanApi.list(params);
  }

  async getPlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.getById(planId);
  }

  async getActivePlan(coachingRelationshipId?: string): Promise<NutritionPlan | null> {
    return nutritionPlanApi.getActive(coachingRelationshipId);
  }

  async getPendingPlan(coachingRelationshipId?: string): Promise<NutritionPlan | null> {
    return nutritionPlanApi.getPending(coachingRelationshipId);
  }

  async createPlan(payload: CreateNutritionPlanDTO): Promise<NutritionPlan> {
    return nutritionPlanApi.create(payload);
  }

  async updatePlan(planId: string, payload: UpdateNutritionPlanDTO): Promise<NutritionPlan> {
    return nutritionPlanApi.update(planId, payload);
  }

  async createVersion(
    planId: string,
    payload?: CreateNutritionPlanVersionDTO,
  ): Promise<NutritionPlan> {
    return nutritionPlanApi.createVersion(planId, payload);
  }

  async activatePlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.activate(planId);
  }

  async submitPlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.submit(planId);
  }

  async recallPlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.recall(planId);
  }

  async acceptPlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.accept(planId);
  }

  async rejectPlan(planId: string, reason?: string): Promise<NutritionPlan> {
    return nutritionPlanApi.reject(planId, reason);
  }

  async requestPlanDeletion(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.requestDeletion(planId);
  }

  async acceptPlanDeletion(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.acceptDeletion(planId);
  }

  async rejectPlanDeletion(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.rejectDeletion(planId);
  }

  async completePlan(planId: string): Promise<NutritionPlan> {
    return nutritionPlanApi.complete(planId);
  }

  async deleteDraftPlan(planId: string): Promise<void> {
    return nutritionPlanApi.deleteDraft(planId);
  }

  // Completion operations
  async listCompletions(
    params?: NutritionCompletionFilterParams,
  ): Promise<{ completions: NutritionCompletion[]; total: number }> {
    return nutritionCompletionApi.list(params);
  }

  async getCompletion(completionId: string): Promise<NutritionCompletion> {
    return nutritionCompletionApi.getById(completionId);
  }

  async startCompletion(payload: StartNutritionCompletionDTO): Promise<NutritionCompletion> {
    return nutritionCompletionApi.start(payload);
  }

  async updateExecution(
    completionId: string,
    payload: UpdateNutritionCompletionDTO,
  ): Promise<NutritionCompletion> {
    return nutritionCompletionApi.updateExecution(completionId, payload);
  }

  async completeCompletion(
    completionId: string,
    payload?: CompleteNutritionCompletionDTO,
  ): Promise<NutritionCompletion> {
    return nutritionCompletionApi.complete(completionId, payload);
  }
}

export const nutritionRepository = new NutritionRepository();
