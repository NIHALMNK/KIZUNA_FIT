export interface CoachingRelationshipSummary {
  id: string;
  clientId: string;
  trainerId: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
}

export interface IProgressCoachingGateway {
  getClientRelationships(clientId: string): Promise<CoachingRelationshipSummary[]>;
  getRelationshipById(relationshipId: string): Promise<CoachingRelationshipSummary | null>;
}
