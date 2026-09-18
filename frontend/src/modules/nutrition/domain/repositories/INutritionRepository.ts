import {
  NutritionPlan,
  NutritionCompletion,
  CreateNutritionPlanDTO,
  UpdateNutritionPlanDTO,
  CreateNutritionPlanVersionDTO,
  StartNutritionCompletionDTO,
  UpdateNutritionCompletionDTO,
  CompleteNutritionCompletionDTO,
  NutritionPlanFilterParams,
  NutritionCompletionFilterParams,
} from '../types/nutrition.types';

export interface INutritionRepository {
  // Plan operations
  listPlans(params?: NutritionPlanFilterParams): Promise<{ plans: NutritionPlan[]; total: number }>;
  getPlan(planId: string): Promise<NutritionPlan>;
  getActivePlan(coachingRelationshipId?: string): Promise<NutritionPlan | null>;
  getPendingPlan(coachingRelationshipId?: string): Promise<NutritionPlan | null>;
  createPlan(payload: CreateNutritionPlanDTO): Promise<NutritionPlan>;
  updatePlan(planId: string, payload: UpdateNutritionPlanDTO): Promise<NutritionPlan>;
  createVersion(planId: string, payload?: CreateNutritionPlanVersionDTO): Promise<NutritionPlan>;
  activatePlan(planId: string): Promise<NutritionPlan>;
  submitPlan(planId: string): Promise<NutritionPlan>;
  recallPlan(planId: string): Promise<NutritionPlan>;
  acceptPlan(planId: string): Promise<NutritionPlan>;
  rejectPlan(planId: string, reason?: string): Promise<NutritionPlan>;
  requestPlanDeletion(planId: string): Promise<NutritionPlan>;
  acceptPlanDeletion(planId: string): Promise<NutritionPlan>;
  rejectPlanDeletion(planId: string): Promise<NutritionPlan>;
  completePlan(planId: string): Promise<NutritionPlan>;
  deleteDraftPlan(planId: string): Promise<void>;

  // Completion operations
  listCompletions(
    params?: NutritionCompletionFilterParams,
  ): Promise<{ completions: NutritionCompletion[]; total: number }>;
  getCompletion(completionId: string): Promise<NutritionCompletion>;
  startCompletion(payload: StartNutritionCompletionDTO): Promise<NutritionCompletion>;
  updateExecution(
    completionId: string,
    payload: UpdateNutritionCompletionDTO,
  ): Promise<NutritionCompletion>;
  completeCompletion(
    completionId: string,
    payload?: CompleteNutritionCompletionDTO,
  ): Promise<NutritionCompletion>;
}
