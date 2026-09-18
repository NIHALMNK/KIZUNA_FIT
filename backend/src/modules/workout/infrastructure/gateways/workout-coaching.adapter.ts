import {
  CoachingRelationshipAccessInfo,
  IWorkoutCoachingGateway,
} from '../../domain/repositories/workout-coaching.gateway.interface';
import { ICoachingRelationshipRepository } from '../../../coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationshipStatus } from '../../../coaching/domain/enums/coaching-relationship-status.enum';

export class WorkoutCoachingAdapter implements IWorkoutCoachingGateway {
  constructor(private readonly coachingRelationshipRepository: ICoachingRelationshipRepository) {}

  async getRelationshipAccess(
    relationshipId: string,
  ): Promise<CoachingRelationshipAccessInfo | null> {
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
  ): Promise<CoachingRelationshipAccessInfo | null> {
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
