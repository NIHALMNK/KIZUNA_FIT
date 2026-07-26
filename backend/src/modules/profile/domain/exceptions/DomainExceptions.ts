export class InvalidProfileRoleException extends Error {
  constructor(expectedRole: string, actualRole: string) {
    super(`Cannot create profile. Expected role '${expectedRole}', got '${actualRole}'`);
    this.name = 'InvalidProfileRoleException';
  }
}

export class ProfileAlreadyCompletedException extends Error {
  constructor(profileId: string) {
    super(`Profile ${profileId} is already marked as completed`);
    this.name = 'ProfileAlreadyCompletedException';
  }
}

export class CertificationAlreadyVerifiedException extends Error {
  constructor(certificationId: string) {
    super(`Certification ${certificationId} has already been verified and cannot be edited`);
    this.name = 'CertificationAlreadyVerifiedException';
  }
}

export class CertificationNotFoundException extends Error {
  constructor(certificationId: string) {
    super(`Certification ${certificationId} was not found in profile`);
    this.name = 'CertificationNotFoundException';
  }
}

export class ShowcaseItemNotFoundException extends Error {
  constructor(showcaseId: string) {
    super(`Showcase item ${showcaseId} was not found in profile`);
    this.name = 'ShowcaseItemNotFoundException';
  }
}

export class OverlappingAvailabilityException extends Error {
  constructor(
    message: string = 'Overlapping time slots detected in trainer availability schedule',
  ) {
    super(message);
    this.name = 'OverlappingAvailabilityException';
  }
}
