import { CoachingGateway } from '../../application/ports/coaching-gateway.port';
import { ICoachingRelationshipRepository } from '../../../coaching/application/ports/coaching-relationship.repository.interface';
import { CoachingRelationshipStatus } from '../../../coaching/domain/enums/coaching-relationship-status.enum';

export class CoachingGatewayAdapter implements CoachingGateway {
  constructor(private readonly coachingRepo: ICoachingRelationshipRepository) {}

  public async hasActiveRelationship(clientId: string, trainerId?: string): Promise<boolean> {
    if (!clientId) {
      return false;
    }

    try {
      const activeRel = await this.coachingRepo.findActiveByClientId(clientId);
      if (!activeRel) {
        return false;
      }

      if (trainerId) {
        return activeRel.trainerId === trainerId;
      }

      return activeRel.status === CoachingRelationshipStatus.ACTIVE;
    } catch (_err: unknown) {
      return false;
    }
  }
}
