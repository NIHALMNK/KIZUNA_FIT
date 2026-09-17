export interface NutritionRecordSummary {
  id: string;
  clientId: string;
  coachingRelationshipId: string;
  completionDate: Date;
  status: string;
  mealsPrescribedCount: number;
  mealsCompletedCount: number;
  totalCalories: number | null;
  hydrationLoggedMl: number | null;
}

export interface IProgressNutritionGateway {
  getNutritionRecordsForClient(
    clientId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionRecordSummary[]>;
  getNutritionRecordsForRelationship(
    relationshipId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<NutritionRecordSummary[]>;
}
