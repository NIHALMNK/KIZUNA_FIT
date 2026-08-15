import { TrainerSnapshotProps } from '../../domain/value-objects/trainer-snapshot.value-object';
import { TrainerEligibilityCandidate } from '../../domain/specifications/eligible-trainer.specification';

export interface TrainerEligibilityAndSnapshotInfo {
  eligibility: TrainerEligibilityCandidate;
  snapshot: TrainerSnapshotProps;
}

/**
 * Application Port for inter-domain queries to the Profile Domain.
 * Allows Marketplace to verify trainer eligibility and fetch snapshots without direct repository access.
 */
export interface ProfileGateway {
  getTrainerEligibilityAndSnapshot(
    trainerId: string,
  ): Promise<TrainerEligibilityAndSnapshotInfo | null>;
}
