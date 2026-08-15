import {
  EligibleTrainerSpecification,
  TrainerEligibilityCandidate,
} from '../specifications/eligible-trainer.specification';
import { TrainerNotEligibleException } from '../exceptions/trainer-not-eligible.exception';
import { ClientCannotRequestSelfException } from '../exceptions/client-cannot-request-self.exception';

/**
 * Policy enforcing all trainer eligibility criteria before initiating an acquisition pipeline:
 * 1. Client cannot request themselves.
 * 2. Trainer must be platform-APPROVED and AVAILABLE to take new clients.
 */
export class TrainerEligibilityPolicy {
  private readonly eligibleSpec = new EligibleTrainerSpecification();

  public validate(
    clientId: string,
    trainerId: string,
    trainerProfile: TrainerEligibilityCandidate | null,
  ): void {
    if (clientId === trainerId) {
      throw new ClientCannotRequestSelfException(clientId);
    }

    if (!trainerProfile) {
      throw new TrainerNotEligibleException(
        trainerId,
        'Trainer profile not found',
        'TRAINER_NOT_FOUND',
      );
    }

    if (trainerProfile.verificationStatus !== 'APPROVED') {
      throw new TrainerNotEligibleException(
        trainerId,
        `Trainer verification status is '${trainerProfile.verificationStatus}', expected 'APPROVED'`,
        'TRAINER_NOT_VERIFIED',
      );
    }

    if (trainerProfile.availabilityStatus !== 'AVAILABLE') {
      throw new TrainerNotEligibleException(
        trainerId,
        `Trainer availability status is '${trainerProfile.availabilityStatus}', expected 'AVAILABLE'`,
        'TRAINER_NOT_AVAILABLE',
      );
    }

    if (!this.eligibleSpec.isSatisfiedBy(trainerProfile)) {
      throw new TrainerNotEligibleException(
        trainerId,
        'Trainer fails eligibility specification',
        'TRAINER_NOT_VERIFIED',
      );
    }
  }
}
