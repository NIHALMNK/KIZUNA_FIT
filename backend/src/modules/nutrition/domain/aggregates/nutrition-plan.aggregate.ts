import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { NutritionPlanStatus, Weekday } from '../enums';
import { NutritionDay } from '../entities/nutrition-day.entity';
import { Meal } from '../entities/meal.entity';
import { FoodEntry } from '../value-objects/food-entry.value-object';
import {
  ActiveNutritionPlanImmutableException,
  CancelledNutritionPlanImmutableException,
  CompletedNutritionPlanImmutableException,
  InvalidNutritionDayNumberingException,
  InvalidNutritionDurationException,
  InvalidNutritionPlanTransitionException,
  NutritionPlanDeletionPendingImmutableException,
  NutritionPlanPendingApprovalImmutableException,
} from '../exceptions/nutrition-domain.exceptions';
import {
  NutritionPlanAcceptedEvent,
  NutritionPlanActivatedEvent,
  NutritionPlanCompletedEvent,
  NutritionPlanCreatedEvent,
  NutritionPlanDeletionAcceptedEvent,
  NutritionPlanDeletionRejectedEvent,
  NutritionPlanDeletionRequestedEvent,
  NutritionPlanRecalledEvent,
  NutritionPlanRejectedEvent,
  NutritionPlanSubmittedEvent,
} from '../events';

export interface NutritionPlanProps {
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  durationWeeks: number;
  nutritionDays: NutritionDay[];
  status: NutritionPlanStatus;
  activatedAt?: Date | null;
  completedAt?: Date | null;
  submittedAt?: Date | null;
  acceptedAt?: Date | null;
  reviewedAt?: Date | null;
  rejectionReason?: string | null;
  deletionRequestedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class NutritionPlan extends AggregateRoot<NutritionPlanProps> {
  private constructor(props: NutritionPlanProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get coachingRelationshipId(): string {
    return this.props.coachingRelationshipId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get version(): number {
    return this.props.version;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | null | undefined {
    return this.props.description;
  }

  get durationWeeks(): number {
    return this.props.durationWeeks;
  }

  get nutritionDays(): NutritionDay[] {
    return [...this.props.nutritionDays];
  }

  get status(): NutritionPlanStatus {
    return this.props.status;
  }

  get activatedAt(): Date | null | undefined {
    return this.props.activatedAt;
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  get submittedAt(): Date | null | undefined {
    return this.props.submittedAt;
  }

  get acceptedAt(): Date | null | undefined {
    return this.props.acceptedAt;
  }

  get reviewedAt(): Date | null | undefined {
    return this.props.reviewedAt;
  }

  get rejectionReason(): string | null | undefined {
    return this.props.rejectionReason;
  }

  get deletionRequestedAt(): Date | null | undefined {
    return this.props.deletionRequestedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateDraft(updates: {
    title?: string;
    description?: string | null;
    durationWeeks?: number;
    nutritionDays?: NutritionDay[];
  }): Result<void> {
    if (this.props.status === NutritionPlanStatus.COMPLETED) {
      throw new CompletedNutritionPlanImmutableException(this._id);
    }
    if (this.props.status === NutritionPlanStatus.CANCELLED) {
      throw new CancelledNutritionPlanImmutableException(this._id);
    }
    if (this.props.status === NutritionPlanStatus.PENDING_APPROVAL) {
      throw new NutritionPlanPendingApprovalImmutableException(this._id);
    }
    if (this.props.status === NutritionPlanStatus.DELETION_PENDING) {
      throw new NutritionPlanDeletionPendingImmutableException(this._id);
    }
    if (this.props.status !== NutritionPlanStatus.DRAFT) {
      throw new ActiveNutritionPlanImmutableException(this._id);
    }

    if (updates.durationWeeks !== undefined) {
      if (updates.durationWeeks < 1 || updates.durationWeeks > 52) {
        throw new InvalidNutritionDurationException(updates.durationWeeks);
      }
      this.props.durationWeeks = updates.durationWeeks;
    }

    if (updates.nutritionDays !== undefined) {
      const validationResult = NutritionPlan.validateNutritionDays(
        updates.nutritionDays,
        this.props.durationWeeks,
      );
      if (validationResult.isFailure) {
        return Result.fail<void>(validationResult.error as string);
      }
      this.props.nutritionDays = [...updates.nutritionDays];
    }

    if (updates.title && updates.title.trim().length > 0) {
      this.props.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      this.props.description = updates.description ? updates.description.trim() : null;
    }

    this.props.updatedAt = new Date();
    return Result.ok<void>();
  }

  public activate(activatedAt: Date = new Date()): Result<void> {
    if (this.props.status === NutritionPlanStatus.ACTIVE) {
      return Result.ok<void>();
    }

    if (this.props.status !== NutritionPlanStatus.PENDING_APPROVAL) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.ACTIVE,
      );
    }

    if (this.props.nutritionDays.length === 0) {
      return Result.fail<void>(
        'Cannot activate a nutrition plan with no prescribed nutrition days.',
      );
    }

    const dayValidation = NutritionPlan.validateNutritionDays(
      this.props.nutritionDays,
      this.props.durationWeeks,
    );
    if (dayValidation.isFailure) {
      return Result.fail<void>(dayValidation.error as string);
    }

    this.props.status = NutritionPlanStatus.ACTIVE;
    this.props.activatedAt = activatedAt;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new NutritionPlanActivatedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        this.props.activatedAt,
      ),
    );

    return Result.ok<void>();
  }

  public submit(submittedAt: Date = new Date()): Result<void> {
    if (this.props.status === NutritionPlanStatus.PENDING_APPROVAL) {
      return Result.ok<void>();
    }

    if (this.props.status !== NutritionPlanStatus.DRAFT) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.PENDING_APPROVAL,
      );
    }

    if (this.props.nutritionDays.length === 0) {
      return Result.fail<void>('Cannot submit a nutrition plan with no prescribed nutrition days.');
    }

    const dayValidation = NutritionPlan.validateNutritionDays(
      this.props.nutritionDays,
      this.props.durationWeeks,
    );
    if (dayValidation.isFailure) {
      return Result.fail<void>(dayValidation.error as string);
    }

    this.props.status = NutritionPlanStatus.PENDING_APPROVAL;
    this.props.submittedAt = submittedAt;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new NutritionPlanSubmittedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        this.props.submittedAt,
      ),
    );

    return Result.ok<void>();
  }

  public recall(recalledAt: Date = new Date()): Result<void> {
    if (this.props.status !== NutritionPlanStatus.PENDING_APPROVAL) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.DRAFT,
      );
    }

    this.props.status = NutritionPlanStatus.DRAFT;
    this.props.updatedAt = recalledAt;

    this.addDomainEvent(
      new NutritionPlanRecalledEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        recalledAt,
      ),
    );

    return Result.ok<void>();
  }

  public accept(acceptedAt: Date = new Date(), previousActivePlanId?: string | null): Result<void> {
    if (this.props.status !== NutritionPlanStatus.PENDING_APPROVAL) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.ACTIVE,
      );
    }

    this.props.status = NutritionPlanStatus.ACTIVE;
    this.props.acceptedAt = acceptedAt;
    this.props.activatedAt = acceptedAt;
    this.props.reviewedAt = acceptedAt;
    this.props.updatedAt = acceptedAt;

    this.addDomainEvent(
      new NutritionPlanAcceptedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        acceptedAt,
        previousActivePlanId,
      ),
    );

    this.addDomainEvent(
      new NutritionPlanActivatedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        acceptedAt,
      ),
    );

    return Result.ok<void>();
  }

  public reject(reason?: string, rejectedAt: Date = new Date()): Result<void> {
    if (this.props.status !== NutritionPlanStatus.PENDING_APPROVAL) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.DRAFT,
      );
    }

    this.props.status = NutritionPlanStatus.DRAFT;
    this.props.rejectionReason = reason ? reason.trim() : null;
    this.props.reviewedAt = rejectedAt;
    this.props.updatedAt = rejectedAt;

    this.addDomainEvent(
      new NutritionPlanRejectedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        rejectedAt,
        this.props.rejectionReason,
      ),
    );

    return Result.ok<void>();
  }

  public requestDeletion(requestedAt: Date = new Date()): Result<void> {
    if (this.props.status === NutritionPlanStatus.DELETION_PENDING) {
      return Result.ok<void>();
    }

    if (this.props.status !== NutritionPlanStatus.ACTIVE) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.DELETION_PENDING,
      );
    }

    this.props.status = NutritionPlanStatus.DELETION_PENDING;
    this.props.deletionRequestedAt = requestedAt;
    this.props.updatedAt = requestedAt;

    this.addDomainEvent(
      new NutritionPlanDeletionRequestedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        requestedAt,
      ),
    );

    return Result.ok<void>();
  }

  public acceptDeletion(cancelledAt: Date = new Date()): Result<void> {
    if (this.props.status !== NutritionPlanStatus.DELETION_PENDING) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.CANCELLED,
      );
    }

    this.props.status = NutritionPlanStatus.CANCELLED;
    this.props.completedAt = cancelledAt;
    this.props.updatedAt = cancelledAt;

    this.addDomainEvent(
      new NutritionPlanDeletionAcceptedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        cancelledAt,
      ),
    );

    return Result.ok<void>();
  }

  public rejectDeletion(rejectedAt: Date = new Date()): Result<void> {
    if (this.props.status !== NutritionPlanStatus.DELETION_PENDING) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.ACTIVE,
      );
    }

    this.props.status = NutritionPlanStatus.ACTIVE;
    this.props.updatedAt = rejectedAt;

    this.addDomainEvent(
      new NutritionPlanDeletionRejectedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        rejectedAt,
      ),
    );

    return Result.ok<void>();
  }

  public complete(completedAt: Date = new Date()): Result<void> {
    if (this.props.status === NutritionPlanStatus.COMPLETED) {
      return Result.ok<void>();
    }

    if (
      this.props.status !== NutritionPlanStatus.ACTIVE &&
      this.props.status !== NutritionPlanStatus.DELETION_PENDING
    ) {
      throw new InvalidNutritionPlanTransitionException(
        this.props.status,
        NutritionPlanStatus.COMPLETED,
      );
    }

    this.props.status = NutritionPlanStatus.COMPLETED;
    this.props.completedAt = completedAt;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new NutritionPlanCompletedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.trainerId,
        this.props.clientId,
        this.props.version,
        this.props.completedAt,
      ),
    );

    return Result.ok<void>();
  }

  public createNewVersion(
    newProps?: Partial<
      Pick<NutritionPlanProps, 'title' | 'description' | 'durationWeeks' | 'nutritionDays'>
    > & { versionOverride?: number },
  ): NutritionPlan {
    const nextVersion = newProps?.versionOverride || this.props.version + 1;
    const now = new Date();

    const sourceDays = newProps?.nutritionDays || this.props.nutritionDays;
    const clonedDays = sourceDays.map((day) => {
      const clonedMeals = day.meals.map((m) => {
        const foodEntries = m.foodEntries.map((fe) =>
          FoodEntry.create({
            name: fe.name,
            quantity: fe.quantity,
            unit: fe.unit,
            calories: fe.calories,
            protein: fe.protein,
            carbohydrates: fe.carbohydrates,
            fats: fe.fats,
            notes: fe.notes,
          }).getValue(),
        );

        return Meal.create({
          mealType: m.mealType,
          name: m.name,
          timeOfDay: m.timeOfDay,
          targetCalories: m.targetCalories,
          targetMacros: m.targetMacros,
          foodEntries,
          notes: m.notes,
        }).getValue();
      });

      return NutritionDay.create({
        weekday: day.weekday,
        dayNumber: day.dayNumber,
        name: day.name,
        targetCalories: day.targetCalories,
        dailyMacroTargets: day.dailyMacroTargets,
        hydrationGoal: day.hydrationGoal,
        meals: clonedMeals,
        notes: day.notes,
      }).getValue();
    });

    const newPlanResult = NutritionPlan.create({
      coachingRelationshipId: this.props.coachingRelationshipId,
      trainerId: this.props.trainerId,
      clientId: this.props.clientId,
      version: nextVersion,
      title: newProps?.title || `${this.props.title} (v${nextVersion})`,
      description:
        newProps?.description !== undefined ? newProps.description : this.props.description,
      durationWeeks: newProps?.durationWeeks || this.props.durationWeeks,
      nutritionDays: clonedDays,
      status: NutritionPlanStatus.DRAFT,
      createdAt: now,
      updatedAt: now,
    });

    if (newPlanResult.isFailure) {
      throw new Error(
        `Failed to clone nutrition plan to version ${nextVersion}: ${newPlanResult.error}`,
      );
    }

    return newPlanResult.getValue();
  }

  public static validateNutritionDays(days: NutritionDay[], _durationWeeks?: number): Result<void> {
    if (!days || days.length === 0) {
      return Result.fail<void>('Nutrition plan must contain at least one nutrition day.');
    }

    if (days.length > 7) {
      return Result.fail<void>(
        `A weekly nutrition plan cannot contain more than 7 weekday prescriptions (found ${days.length}).`,
      );
    }

    // Check unique weekday
    const seenWeekdays = new Set<string>();
    for (const day of days) {
      if (!day.weekday || !Object.values(Weekday).includes(day.weekday)) {
        return Result.fail<void>(`Invalid weekday '${day.weekday}' detected.`);
      }

      if (seenWeekdays.has(day.weekday)) {
        return Result.fail<void>(`Duplicate nutrition day for weekday '${day.weekday}' detected.`);
      }
      seenWeekdays.add(day.weekday);

      if (day.meals.length === 0) {
        return Result.fail<void>(
          `NutritionDay for ${day.weekday} must contain at least one prescribed meal.`,
        );
      }
    }

    return Result.ok<void>();
  }

  public static create(
    props: Omit<NutritionPlanProps, 'createdAt' | 'updatedAt'> & {
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<NutritionPlan> {
    if (!props.coachingRelationshipId) {
      return Result.fail<NutritionPlan>('Coaching relationship ID is required.');
    }
    if (!props.trainerId || !props.clientId) {
      return Result.fail<NutritionPlan>('Trainer ID and Client ID are required.');
    }
    if (!props.title || props.title.trim().length === 0) {
      return Result.fail<NutritionPlan>('Nutrition plan title is required.');
    }
    if (props.version < 1) {
      return Result.fail<NutritionPlan>('Plan version must be 1 or higher.');
    }
    if (props.durationWeeks < 1 || props.durationWeeks > 52) {
      return Result.fail<NutritionPlan>(
        `Invalid duration ${props.durationWeeks} weeks. Duration must be between 1 and 52 weeks.`,
      );
    }

    if (props.nutritionDays && props.nutritionDays.length > 0) {
      const daysValidation = NutritionPlan.validateNutritionDays(
        props.nutritionDays,
        props.durationWeeks,
      );
      if (daysValidation.isFailure) {
        return Result.fail<NutritionPlan>(daysValidation.error as string);
      }
    }

    const planId = id || crypto.randomUUID();
    const now = new Date();

    const plan = new NutritionPlan(
      {
        ...props,
        title: props.title.trim(),
        description: props.description ? props.description.trim() : null,
        nutritionDays: props.nutritionDays || [],
        status: props.status || NutritionPlanStatus.DRAFT,
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      planId,
    );

    if (!id) {
      plan.addDomainEvent(
        new NutritionPlanCreatedEvent(
          planId,
          props.coachingRelationshipId,
          props.trainerId,
          props.clientId,
          props.version,
          plan.status,
        ),
      );
    }

    return Result.ok<NutritionPlan>(plan);
  }

  public static reconstitute(props: NutritionPlanProps, id: string): NutritionPlan {
    return new NutritionPlan(props, id);
  }
}
