import {
  INutritionCoachingGateway,
  NutritionCoachingRelationshipAccess,
} from '../../application/ports/INutritionCoachingGateway';
import { ICoachingRelationshipRepository } from '../../../coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationshipStatus } from '../../../coaching/domain/enums/coaching-relationship-status.enum';

export class NutritionCoachingAdapter implements INutritionCoachingGateway {
  constructor(private readonly coachingRelationshipRepository: ICoachingRelationshipRepository) {}

  async getRelationshipAccess(
    relationshipId: string,
  ): Promise<NutritionCoachingRelationshipAccess | null> {
    const relationship = await this.coachingRelationshipRepository.findById(relationshipId);
    if (!relationship) return null;

    return {
      relationshipId: relationship.id,
      clientId: relationship.clientId,
      trainerId: relationship.trainerId,
      isActive: relationship.status === CoachingRelationshipStatus.ACTIVE,
      status: relationship.status,
    };
  }

  async getActiveRelationshipForClient(
    clientId: string,
  ): Promise<NutritionCoachingRelationshipAccess | null> {
    const relationship = await this.coachingRelationshipRepository.findActiveByClientId(clientId);
    if (!relationship) return null;

    return {
      relationshipId: relationship.id,
      clientId: relationship.clientId,
      trainerId: relationship.trainerId,
      isActive: relationship.status === CoachingRelationshipStatus.ACTIVE,
      status: relationship.status,
    };
  }
}
