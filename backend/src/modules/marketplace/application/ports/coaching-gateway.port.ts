/**
 * Application Port for inter-domain queries to the Coaching Domain.
 * Allows Marketplace to check for existing active coaching relationships without direct repository access.
 */
export interface CoachingGateway {
  hasActiveRelationship(clientId: string, trainerId: string): Promise<boolean>;
}
