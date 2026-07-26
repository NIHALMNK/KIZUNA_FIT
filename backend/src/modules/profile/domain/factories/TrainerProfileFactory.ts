import { Result } from '../../../../shared/result/Result';
import { TrainerProfile, TrainerProfileProps } from '../aggregates/TrainerProfile';
import { TrainerLocation } from '../value-objects/TrainerLocation';
import { TrainerAvailability } from '../value-objects/TrainerAvailability';
import { TrainerAvailabilityStatus } from '../enums/TrainerAvailabilityStatus';
import { TrainerSpecialization } from '../enums/TrainerSpecialization';

export class TrainerProfileFactory {
  public static createNew(props: {
    userId: string;
    headline: string;
    bio: string;
    yearsOfExperience: number;
    languages: string[];
    specializations: TrainerSpecialization[];
    city: string;
    state: string;
    country: string;
    timezone?: string;
  }): Result<TrainerProfile> {
    const locationResult = TrainerLocation.create(props.city, props.state, props.country);
    if (locationResult.isFailure) {
      return Result.fail<TrainerProfile>(locationResult.error);
    }

    const availabilityResult = TrainerAvailability.create(
      TrainerAvailabilityStatus.AVAILABLE,
      props.timezone || 'UTC',
      [],
    );
    if (availabilityResult.isFailure) {
      return Result.fail<TrainerProfile>(availabilityResult.error);
    }

    const fullProps: TrainerProfileProps = {
      userId: props.userId,
      headline: props.headline,
      bio: props.bio,
      yearsOfExperience: props.yearsOfExperience,
      languages: props.languages,
      specializations: props.specializations,
      certifications: [],
      showcase: [],
      location: locationResult.getValue(),
      availability: availabilityResult.getValue(),
      avatarUrl: null,
      totalClients: 0,
      totalReviews: 0,
      averageRating: 0.0,
      profileCompleted: false,
    };

    return TrainerProfile.create(fullProps);
  }
}
