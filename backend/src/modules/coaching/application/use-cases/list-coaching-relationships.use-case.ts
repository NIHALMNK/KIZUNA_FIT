import {
  ICoachingRelationshipRepository,
  PaginatedResult,
} from '../ports/coaching-relationship.repository.interface';
import { ICoachingParticipantEnricher } from '../ports/coaching-participant-enricher.port';
import { ListCoachingRelationshipsQueryDTO } from '../dtos/list-coaching-relationships.dto';
import { CoachingRelationshipListItemDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';

export class ListCoachingRelationshipsUseCase {
  constructor(
    private readonly coachingRepo: ICoachingRelationshipRepository,
    private readonly coachingParticipantEnricher?: ICoachingParticipantEnricher,
  ) {}

  public async execute(
    query: ListCoachingRelationshipsQueryDTO,
  ): Promise<PaginatedResult<CoachingRelationshipListItemDTO>> {
    const filter: Record<string, any> = {
      status: query.status,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sort: query.sort ?? 'newest',
    };

    if (query.role === 'CLIENT') {
      filter.clientId = query.actorId;
    } else if (query.role === 'TRAINER') {
      filter.trainerId = query.actorId;
    }
    // ADMIN can view all without actorId filter

    const result = await this.coachingRepo.findAll(filter);
    const rawItems = result.items.map(CoachingRelationshipMapper.toListItemDTO);
    const enrichedItems = this.coachingParticipantEnricher
      ? await this.coachingParticipantEnricher.enrichRelationshipList(rawItems)
      : rawItems;

    return {
      items: enrichedItems,
      pagination: result.pagination,
    };
  }
}
