import { ClientProfile } from '../aggregates/ClientProfile';
import { TrainerProfile } from '../aggregates/TrainerProfile';

export class ProfileCompletionCalculator {
  public static calculateClientCompletion(profile: ClientProfile): {
    percentage: number;
    isComplete: boolean;
  } {
    let score = 0;
    const totalWeight = 8;

    if (profile.fullName && profile.fullName.trim().length > 0) score += 1;
    if (profile.gender) score += 1;
    if (profile.dateOfBirth) score += 1;
    if (profile.weight) score += 1;
    if (profile.height) score += 1;
    if (profile.fitnessGoals && profile.fitnessGoals.length > 0) score += 1;
    if (profile.experienceLevel) score += 1;
    if (profile.activityLevel) score += 1;

    const percentage = Math.round((score / totalWeight) * 100);
    const isComplete = percentage >= 80;

    return { percentage, isComplete };
  }

  public static calculateTrainerCompletion(profile: TrainerProfile): {
    percentage: number;
    isComplete: boolean;
  } {
    let score = 0;
    const totalWeight = 6;

    if (profile.headline && profile.headline.trim().length > 0) score += 1;
    if (profile.bio && profile.bio.trim().length > 0) score += 1;
    if (profile.yearsOfExperience !== undefined && profile.yearsOfExperience >= 0) score += 1;
    if (profile.languages && profile.languages.length > 0) score += 1;
    if (profile.specializations && profile.specializations.length > 0) score += 1;
    if (profile.location) score += 1;

    const percentage = Math.round((score / totalWeight) * 100);
    const isComplete = percentage >= 80;

    return { percentage, isComplete };
  }
}
