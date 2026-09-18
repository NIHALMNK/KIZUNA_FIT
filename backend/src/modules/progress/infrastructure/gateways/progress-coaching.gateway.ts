import {
  IProgressCoachingGateway,
  CoachingRelationshipSummary,
} from '../../application/ports/IProgressCoachingGateway';
import { ICoachingRelationshipRepository } from '../../../coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationship } from '../../../coaching/domain/aggregates/coaching-relationship.aggregate';

export class ProgressCoachingGateway implements IProgressCoachingGateway {
  constructor(private readonly coachingRelationshipRepository: ICoachingRelationshipRepository) {}

  async getClientRelationships(clientId: string): Promise<CoachingRelationshipSummary[]> {
    const result = await this.coachingRelationshipRepository.findAll({
      clientId,
      limit: 100,
      sort: 'oldest',
    });

    return result.items.map((rel) => this.mapToSummary(rel));
  }

  async getRelationshipById(relationshipId: string): Promise<CoachingRelationshipSummary | null> {
    const rel = await this.coachingRelationshipRepository.findById(relationshipId);
    if (!rel) return null;
    return this.mapToSummary(rel);
  }

  private mapToSummary(rel: CoachingRelationship): CoachingRelationshipSummary {
    const timeline = rel.timeline;
    const startDate = timeline?.activatedAt || rel.createdAt;
    const endDate =
      timeline?.completedAt ||
      timeline?.cancelledAt ||
      timeline?.refundedAt ||
      timeline?.expiredAt ||
      null;

    return {
      id: rel.id,
      clientId: rel.clientId,
      trainerId: rel.trainerId,
      status: rel.status,
      startDate,
      endDate,
    };
  }
}
