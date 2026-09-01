import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { ICoachingParticipantEnricher } from '../ports/coaching-participant-enricher.port';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import { CoachingRelationshipStatus } from '../../domain/enums/coaching-relationship-status.enum';

export interface GetActiveCoachingRelationshipQuery {
  actorId: string;
  role: string;
}

export class GetActiveCoachingRelationshipUseCase {
  constructor(
    private readonly coachingRepo: ICoachingRelationshipRepository,
    private readonly coachingParticipantEnricher?: ICoachingParticipantEnricher,
  ) {}

  public async execute(
    query: GetActiveCoachingRelationshipQuery,
  ): Promise<CoachingRelationshipDTO | CoachingRelationshipDTO[] | null> {
    if (query.role === 'CLIENT') {
      const active = await this.coachingRepo.findActiveByClientId(query.actorId);
      if (!active) return null;
      const dto = CoachingRelationshipMapper.toDTO(active);
      return this.coachingParticipantEnricher
        ? this.coachingParticipantEnricher.enrichRelationship(dto)
        : dto;
    }

    if (query.role === 'TRAINER') {
      const activeList = await this.coachingRepo.findActiveByTrainerId(query.actorId);
      const dtos = activeList.map(CoachingRelationshipMapper.toDTO);
      if (this.coachingParticipantEnricher) {
        return Promise.all(
          dtos.map((d) => this.coachingParticipantEnricher!.enrichRelationship(d)),
        );
      }
      return dtos;
    }

    // Admin query fallback
    const result = await this.coachingRepo.findAll({
      status: CoachingRelationshipStatus.ACTIVE,
      limit: 100,
    });
    const dtos = result.items.map(CoachingRelationshipMapper.toDTO);
    if (this.coachingParticipantEnricher) {
      return Promise.all(dtos.map((d) => this.coachingParticipantEnricher!.enrichRelationship(d)));
    }
    return dtos;
  }
}
