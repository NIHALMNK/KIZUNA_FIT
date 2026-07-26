import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { TrainerAvailabilityStatus } from '../enums/TrainerAvailabilityStatus';

export class TrainerProfileCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly userId: string;

  constructor(trainerProfileId: string, userId: string) {
    this.trainerProfileId = trainerProfileId;
    this.userId = userId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerProfileUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;

  constructor(trainerProfileId: string) {
    this.trainerProfileId = trainerProfileId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerAvatarUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly avatarUrl: string;

  constructor(trainerProfileId: string, avatarUrl: string) {
    this.trainerProfileId = trainerProfileId;
    this.avatarUrl = avatarUrl;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerAvatarDeletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;

  constructor(trainerProfileId: string) {
    this.trainerProfileId = trainerProfileId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerAvailabilityChangedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly newStatus: TrainerAvailabilityStatus;

  constructor(trainerProfileId: string, newStatus: TrainerAvailabilityStatus) {
    this.trainerProfileId = trainerProfileId;
    this.newStatus = newStatus;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerCertificationAddedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly certificationId: string;

  constructor(trainerProfileId: string, certificationId: string) {
    this.trainerProfileId = trainerProfileId;
    this.certificationId = certificationId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerCertificationUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly certificationId: string;

  constructor(trainerProfileId: string, certificationId: string) {
    this.trainerProfileId = trainerProfileId;
    this.certificationId = certificationId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerCertificationDeletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly certificationId: string;

  constructor(trainerProfileId: string, certificationId: string) {
    this.trainerProfileId = trainerProfileId;
    this.certificationId = certificationId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerShowcaseAddedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly showcaseId: string;

  constructor(trainerProfileId: string, showcaseId: string) {
    this.trainerProfileId = trainerProfileId;
    this.showcaseId = showcaseId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerShowcaseUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly showcaseId: string;

  constructor(trainerProfileId: string, showcaseId: string) {
    this.trainerProfileId = trainerProfileId;
    this.showcaseId = showcaseId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}

export class TrainerShowcaseDeletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly trainerProfileId: string;
  public readonly showcaseId: string;

  constructor(trainerProfileId: string, showcaseId: string) {
    this.trainerProfileId = trainerProfileId;
    this.showcaseId = showcaseId;
  }

  getAggregateId(): string {
    return this.trainerProfileId;
  }
}
