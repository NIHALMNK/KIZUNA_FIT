import {
  CoachingRelationshipDTO,
  CoachingRelationshipListItemDTO,
  ParticipantSummaryDTO,
} from '../dtos/coaching-relationship.dto';

export type { ParticipantSummaryDTO };

export interface ICoachingParticipantEnricher {
  enrichRelationship(dto: CoachingRelationshipDTO): Promise<CoachingRelationshipDTO>;
  enrichRelationshipList(
    items: CoachingRelationshipListItemDTO[],
  ): Promise<CoachingRelationshipListItemDTO[]>;
}
