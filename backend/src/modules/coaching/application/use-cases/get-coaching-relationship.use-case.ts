import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { ICoachingParticipantEnricher } from '../ports/coaching-participant-enricher.port';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import {
  CoachingRelationshipNotFoundException,
  UnauthorizedCoachingActionException,
} from '../../domain/exceptions/coaching-domain.exceptions';

export interface GetCoachingRelationshipQuery {
  relationshipId: string;
  actorId: string;
  actorRole: string;
}

export class GetCoachingRelationshipUseCase {
  constructor(
    private readonly coachingRepo: ICoachingRelationshipRepository,
    private readonly coachingParticipantEnricher?: ICoachingParticipantEnricher,
  ) {}

  public async execute(query: GetCoachingRelationshipQuery): Promise<CoachingRelationshipDTO> {
    const relationship = await this.coachingRepo.findById(query.relationshipId);
    if (!relationship) {
      throw new CoachingRelationshipNotFoundException(query.relationshipId);
    }

    // Ownership check: Client, assigned Trainer, or Admin
    const isParticipant =
      relationship.clientId === query.actorId || relationship.trainerId === query.actorId;
    const isAdmin = query.actorRole === 'ADMIN';

    if (!isParticipant && !isAdmin) {
      throw new UnauthorizedCoachingActionException(
        'view',
        'You do not have permission to view this coaching relationship.',
      );
    }

    const dto = CoachingRelationshipMapper.toDTO(relationship);
    return this.coachingParticipantEnricher
      ? this.coachingParticipantEnricher.enrichRelationship(dto)
      : dto;
  }
}
