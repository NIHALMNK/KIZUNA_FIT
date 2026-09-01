import {
  ICoachingRelationshipRepository,
  PaginatedResult,
} from '../ports/coaching-relationship.repository.interface';
import { ICoachingParticipantEnricher } from '../ports/coaching-participant-enricher.port';
import { CoachingRelationshipListItemDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import { CoachingRelationshipStatus } from '../../domain/enums/coaching-relationship-status.enum';

export interface GetCoachingHistoryQuery {
  actorId: string;
  role: string;
  status?: CoachingRelationshipStatus | CoachingRelationshipStatus[];
  page?: number;
  limit?: number;
}

export class GetCoachingHistoryUseCase {
  constructor(
    private readonly coachingRepo: ICoachingRelationshipRepository,
    private readonly coachingParticipantEnricher?: ICoachingParticipantEnricher,
  ) {}

  public async execute(
    query: GetCoachingHistoryQuery,
  ): Promise<PaginatedResult<CoachingRelationshipListItemDTO>> {
    const historicalStatuses = query.status ?? [
      CoachingRelationshipStatus.COMPLETED,
      CoachingRelationshipStatus.CANCELLED,
      CoachingRelationshipStatus.REFUNDED,
      CoachingRelationshipStatus.EXPIRED,
    ];

    const filter: Record<string, any> = {
      status: historicalStatuses,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
      sort: 'newest',
    };

    if (query.role === 'CLIENT') {
      filter.clientId = query.actorId;
    } else if (query.role === 'TRAINER') {
      filter.trainerId = query.actorId;
    }

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
