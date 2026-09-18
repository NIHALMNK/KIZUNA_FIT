import { ICoachingRelationshipRepository } from '../ports/coaching-relationship.repository.interface';
import { CreateCoachingRelationshipDTO } from '../dtos/create-coaching-relationship.dto';
import { CoachingRelationshipDTO } from '../dtos/coaching-relationship.dto';
import { CoachingRelationshipMapper } from '../mappers/coaching-relationship.mapper';
import { CoachingRelationship } from '../../domain/aggregates/coaching-relationship.aggregate';
import { ClientHasActiveRelationshipException } from '../../domain/exceptions/coaching-domain.exceptions';

export class CreateCoachingRelationshipUseCase {
  constructor(private readonly coachingRepo: ICoachingRelationshipRepository) {}

  public async execute(dto: CreateCoachingRelationshipDTO): Promise<CoachingRelationshipDTO> {
    // 1. Idempotency check: if relationship for this payment already exists, return it
    const existingPaymentRel = await this.coachingRepo.findByPaymentId(dto.paymentId);
    if (existingPaymentRel) {
      return CoachingRelationshipMapper.toDTO(existingPaymentRel);
    }

    // 2. Invariant check: One active coaching relationship per client (Rule 2)
    const existingActive = await this.coachingRepo.findActiveByClientId(dto.clientId);
    if (existingActive) {
      throw new ClientHasActiveRelationshipException(dto.clientId, existingActive.id);
    }

    // 3. Create aggregate directly in ACTIVE state (Normal PaymentSucceeded flow)
    const createResult = CoachingRelationship.createDirectActive({
      acquisitionPipelineId: dto.acquisitionPipelineId,
      paymentId: dto.paymentId,
      subscriptionId: dto.subscriptionId,
      clientId: dto.clientId,
      trainerId: dto.trainerId,
    });

    if (createResult.isFailure) {
      throw new Error(createResult.error as string);
    }

    const relationship = createResult.getValue()!;

    // 4. Persist
    await this.coachingRepo.save(relationship);

    return CoachingRelationshipMapper.toDTO(relationship);
  }
}
