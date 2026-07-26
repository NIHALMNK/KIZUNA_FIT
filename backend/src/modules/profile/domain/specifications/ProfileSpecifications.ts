import { Result } from '../../../../shared/result/Result';
import { CertificationStatus } from '../enums/TrainerEnums';
import { TrainerCertification } from '../entities/TrainerCertification';

export class CanCreateClientProfileSpecification {
  public static isSatisfiedBy(userRole: string, alreadyHasProfile: boolean): Result<void> {
    if (userRole !== 'CLIENT') {
      return Result.fail<void>(
        `User role must be CLIENT to create a client profile. Got '${userRole}'`,
      );
    }
    if (alreadyHasProfile) {
      return Result.fail<void>('Client profile already exists for this user');
    }
    return Result.ok<void>();
  }
}

export class CanCreateTrainerProfileSpecification {
  public static isSatisfiedBy(userRole: string, alreadyHasProfile: boolean): Result<void> {
    if (userRole !== 'TRAINER') {
      return Result.fail<void>(
        `User role must be TRAINER to create a trainer profile. Got '${userRole}'`,
      );
    }
    if (alreadyHasProfile) {
      return Result.fail<void>('Trainer profile already exists for this user');
    }
    return Result.ok<void>();
  }
}

export class TrainerProfileVisibilitySpecification {
  public static isPubliclyVisible(profileCompleted: boolean, userAccountStatus: string): boolean {
    return profileCompleted && userAccountStatus === 'ACTIVE';
  }
}

export class CertificationEditableSpecification {
  public static isSatisfiedBy(certification: TrainerCertification): Result<void> {
    if (certification.status === CertificationStatus.APPROVED) {
      return Result.fail<void>(
        `Certification ${certification.certificationId} is APPROVED and cannot be edited or deleted`,
      );
    }
    return Result.ok<void>();
  }
}
