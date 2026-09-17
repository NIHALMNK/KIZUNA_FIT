import { IDomainEvent } from '../../../../shared/core/AggregateRoot';
import { NutritionPlanStatus } from '../enums';

export class NutritionPlanCreatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly status: NutritionPlanStatus,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanActivatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly activatedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanCompletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly completedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanSubmittedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly submittedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanRecalledEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly recalledAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanAcceptedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly acceptedAt: Date,
    public readonly previousActivePlanId?: string | null,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanRejectedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly rejectedAt: Date,
    public readonly reason?: string | null,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanDeletionRequestedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly deletionRequestedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanDeletionAcceptedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly cancelledAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionPlanDeletionRejectedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly planId: string,
    public readonly coachingRelationshipId: string,
    public readonly trainerId: string,
    public readonly clientId: string,
    public readonly version: number,
    public readonly rejectedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.planId;
  }
}

export class NutritionCompletionStartedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly completionId: string,
    public readonly coachingRelationshipId: string,
    public readonly nutritionPlanId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly dayNumber: number,
    public readonly startedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.completionId;
  }
}

export class NutritionCompletionUpdatedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly completionId: string,
    public readonly coachingRelationshipId: string,
    public readonly nutritionPlanId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly dayNumber: number,
    public readonly updatedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.completionId;
  }
}

export class NutritionCompletedEvent implements IDomainEvent {
  public readonly dateTimeOccurred: Date;

  constructor(
    public readonly completionId: string,
    public readonly coachingRelationshipId: string,
    public readonly nutritionPlanId: string,
    public readonly clientId: string,
    public readonly trainerId: string,
    public readonly dayNumber: number,
    public readonly completedAt: Date,
  ) {
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.completionId;
  }
}
