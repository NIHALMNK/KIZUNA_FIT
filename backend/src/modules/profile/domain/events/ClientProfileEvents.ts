import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export class ClientProfileCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly clientProfileId: string;
  public readonly userId: string;

  constructor(clientProfileId: string, userId: string) {
    this.clientProfileId = clientProfileId;
    this.userId = userId;
  }

  getAggregateId(): string {
    return this.clientProfileId;
  }
}

export class ClientProfileUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly clientProfileId: string;
  public readonly userId: string;

  constructor(clientProfileId: string, userId: string) {
    this.clientProfileId = clientProfileId;
    this.userId = userId;
  }

  getAggregateId(): string {
    return this.clientProfileId;
  }
}

export class ClientAvatarUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly clientProfileId: string;
  public readonly avatarUrl: string;

  constructor(clientProfileId: string, avatarUrl: string) {
    this.clientProfileId = clientProfileId;
    this.avatarUrl = avatarUrl;
  }

  getAggregateId(): string {
    return this.clientProfileId;
  }
}

export class ClientAvatarDeletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date = new Date();
  public readonly clientProfileId: string;

  constructor(clientProfileId: string) {
    this.clientProfileId = clientProfileId;
  }

  getAggregateId(): string {
    return this.clientProfileId;
  }
}
