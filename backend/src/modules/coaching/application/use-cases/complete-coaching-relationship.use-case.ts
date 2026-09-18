import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import { CoachingRelationshipNotFoundException } from '../../domain/exceptions/coaching-domain.exceptions';

export interface CompleteCoachingRelationshipCommand {
  relationshipId: string;
  actorId: string;
}

export class CompleteCoachingRelationshipUseCase {
  constructor(private readonly coachingRepo: ICoachingRelationshipRepository) {}

  public async execute(
    command: CompleteCoachingRelationshipCommand,
  ): Promise<CoachingRelationshipDTO> {
    const relationship = await this.coachingRepo.findById(command.relationshipId);
    if (!relationship) {
      throw new CoachingRelationshipNotFoundException(command.relationshipId);
    }

    relationship.complete(command.actorId);
    await this.coachingRepo.save(relationship);

    return CoachingRelationshipMapper.toDTO(relationship);
  }
}
