import { NutritionPlan } from '../aggregates/nutrition-plan.aggregate';

export interface INutritionPlanRepository {
  findById(id: string): Promise<NutritionPlan | null>;
  findActiveByRelationshipId(relationshipId: string): Promise<NutritionPlan | null>;
  findPendingByRelationshipId(relationshipId: string): Promise<NutritionPlan | null>;
  findActiveByClientId(clientId: string): Promise<NutritionPlan | null>;
  findPendingByClientId(clientId: string): Promise<NutritionPlan | null>;
  findByRelationshipId(relationshipId: string): Promise<NutritionPlan[]>;
  findHighestVersionNumber(relationshipId: string): Promise<number>;
  save(plan: NutritionPlan): Promise<void>;
  delete(id: string): Promise<void>;
}
