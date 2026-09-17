import { NutritionCompletion } from '../aggregates/nutrition-completion.aggregate';

export interface INutritionCompletionRepository {
  findById(id: string): Promise<NutritionCompletion | null>;
  findByPlanAndDay(nutritionPlanId: string, dayNumber: number): Promise<NutritionCompletion | null>;
  findByPlanClientAndDate(
    nutritionPlanId: string,
    clientId: string,
    completionDate: Date,
  ): Promise<NutritionCompletion | null>;
  findByRelationshipId(
    relationshipId: string,
    limit?: number,
    skip?: number,
  ): Promise<NutritionCompletion[]>;
  findByClientId(clientId: string, limit?: number, skip?: number): Promise<NutritionCompletion[]>;
  findByClientIdInRange(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionCompletion[]>;
  findByRelationshipIdInRange(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionCompletion[]>;
  save(completion: NutritionCompletion): Promise<void>;
  delete(id: string): Promise<void>;
}
