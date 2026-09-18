export interface CoachingRelationshipAccessInfo {
  relationshipId: string;
  clientId: string;
  trainerId: string;
  isActive: boolean;
  status: string;
}

export interface IWorkoutCoachingGateway {
  getRelationshipAccess(relationshipId: string): Promise<CoachingRelationshipAccessInfo | null>;
  getActiveRelationshipForClient(clientId: string): Promise<CoachingRelationshipAccessInfo | null>;
}
