export interface NutritionCoachingRelationshipAccess {
  relationshipId: string;
  clientId: string;
  trainerId: string;
  isActive: boolean;
  status: string;
}

export interface INutritionCoachingGateway {
  getRelationshipAccess(
    relationshipId: string,
  ): Promise<NutritionCoachingRelationshipAccess | null>;
  getActiveRelationshipForClient(
    clientId: string,
  ): Promise<NutritionCoachingRelationshipAccess | null>;
}
