import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import {
  CoachingRelationshipNotFoundException,
  UnauthorizedCoachingActionException,
} from '../../domain/exceptions/coaching-domain.exceptions';

export interface ActivateCoachingRelationshipCommand {
  relationshipId: string;
  actorRole: string;
}

export class ActivateCoachingRelationshipUseCase {
  constructor(private readonly coachingRepo: ICoachingRelationshipRepository) {}

  public async execute(
    command: ActivateCoachingRelationshipCommand,
  ): Promise<CoachingRelationshipDTO> {
    const isAuthorized = command.actorRole === 'ADMIN' || command.actorRole === 'SYSTEM';
    if (!isAuthorized) {
      throw new UnauthorizedCoachingActionException(
        'activate',
        'Only administrators or system processes can explicitly activate a pending relationship.',
      );
    }

    const relationship = await this.coachingRepo.findById(command.relationshipId);
    if (!relationship) {
      throw new CoachingRelationshipNotFoundException(command.relationshipId);
    }

    relationship.activate();
    await this.coachingRepo.save(relationship);

    return CoachingRelationshipMapper.toDTO(relationship);
  }
}
