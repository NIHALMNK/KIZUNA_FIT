import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { CancelCoachingRelationshipDTO } from '../dtos/cancel-coaching-relationship.dto';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import { CoachingRelationshipNotFoundException } from '../../domain/exceptions/coaching-domain.exceptions';

export class CancelCoachingRelationshipUseCase {
  constructor(private readonly coachingRepo: ICoachingRelationshipRepository) {}

  public async execute(dto: CancelCoachingRelationshipDTO): Promise<CoachingRelationshipDTO> {
    const relationship = await this.coachingRepo.findById(dto.relationshipId);
    if (!relationship) {
      throw new CoachingRelationshipNotFoundException(dto.relationshipId);
    }

    relationship.cancel(dto.actorId, dto.reason, dto.isAdmin ?? false);
    await this.coachingRepo.save(relationship);

    return CoachingRelationshipMapper.toDTO(relationship);
  }
}
