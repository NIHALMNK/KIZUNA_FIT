export interface CancelCoachingRelationshipDTO {
  relationshipId: string;
  actorId: string;
  reason: string;
  isAdmin?: boolean;
}
