export interface TrainerEligibilityCandidate {
  verificationStatus: string;
  availabilityStatus: string;
}

/**
 * Specification verifying that a trainer candidate is platform-APPROVED
 * and AVAILABLE to accept new clients.
 */
export class EligibleTrainerSpecification {
  public isSatisfiedBy(candidate: TrainerEligibilityCandidate): boolean {
    if (!candidate) {
      return false;
    }

    const isApproved = candidate.verificationStatus === 'APPROVED';
    const isAvailable = candidate.availabilityStatus === 'AVAILABLE';

    return isApproved && isAvailable;
  }
}
