import { AggregateRoot } from '../../../../shared/core/AggregateRoot';
import { Result } from '../../../../shared/result/Result';
import { NutritionCompletionStatus, Weekday } from '../enums';
import { NutritionDaySnapshot } from '../value-objects/nutrition-day-snapshot.value-object';
import { MealCompletionRecord } from '../value-objects/meal-completion-record.value-object';
import {
  DailyMacroSummary,
  NutritionFeedback,
} from '../value-objects/nutrition-feedback.value-object';
import { HydrationSummary } from '../value-objects/hydration.value-object';
import {
  InvalidNutritionCompletionTransitionException,
  NutritionCompletionImmutableException,
} from '../exceptions/nutrition-domain.exceptions';
import {
  NutritionCompletedEvent,
  NutritionCompletionStartedEvent,
  NutritionCompletionUpdatedEvent,
} from '../events';

export function getWeekdayFromDate(date: Date): Weekday {
  const dayIndex = date.getUTCDay();
  const mapping: Record<number, Weekday> = {
    0: Weekday.SUNDAY,
    1: Weekday.MONDAY,
    2: Weekday.TUESDAY,
    3: Weekday.WEDNESDAY,
    4: Weekday.THURSDAY,
    5: Weekday.FRIDAY,
    6: Weekday.SATURDAY,
  };
  return mapping[dayIndex];
}

export function normalizeCalendarDate(dateInput?: Date | string): Date {
  const d = dateInput ? new Date(dateInput) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

export interface NutritionCompletionProps {
  coachingRelationshipId: string;
  nutritionPlanId: string;
  clientId: string;
  trainerId: string;
  completionDate: Date;
  weekday: Weekday;
  dayNumber: number;
  weekNumber: number;
  nutritionDaySnapshot: NutritionDaySnapshot;
  mealCompletions: MealCompletionRecord[];
  macroSummary?: DailyMacroSummary | null;
  hydrationSummary?: HydrationSummary | null;
  feedback?: NutritionFeedback | null;
  status: NutritionCompletionStatus;
  startedAt: Date;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class NutritionCompletion extends AggregateRoot<NutritionCompletionProps> {
  private constructor(props: NutritionCompletionProps, id: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get coachingRelationshipId(): string {
    return this.props.coachingRelationshipId;
  }

  get nutritionPlanId(): string {
    return this.props.nutritionPlanId;
  }

  get clientId(): string {
    return this.props.clientId;
  }

  get trainerId(): string {
    return this.props.trainerId;
  }

  get completionDate(): Date {
    return this.props.completionDate;
  }

  get weekday(): Weekday {
    return this.props.weekday;
  }

  get dayNumber(): number {
    return this.props.dayNumber;
  }

  get weekNumber(): number {
    return this.props.weekNumber;
  }

  get nutritionDaySnapshot(): NutritionDaySnapshot {
    return this.props.nutritionDaySnapshot;
  }

  get mealCompletions(): MealCompletionRecord[] {
    return [...this.props.mealCompletions];
  }

  get macroSummary(): DailyMacroSummary | null | undefined {
    return this.props.macroSummary;
  }

  get hydrationSummary(): HydrationSummary | null | undefined {
    return this.props.hydrationSummary;
  }

  get feedback(): NutritionFeedback | null | undefined {
    return this.props.feedback;
  }

  get status(): NutritionCompletionStatus {
    return this.props.status;
  }

  get startedAt(): Date {
    return this.props.startedAt;
  }

  get completedAt(): Date | null | undefined {
    return this.props.completedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateExecution(updates: {
    mealCompletions?: MealCompletionRecord[];
    macroSummary?: DailyMacroSummary | null;
    hydrationSummary?: HydrationSummary | null;
    feedback?: NutritionFeedback | null;
  }): Result<void> {
    if (this.props.status !== NutritionCompletionStatus.IN_PROGRESS) {
      throw new NutritionCompletionImmutableException(this._id, this.props.status);
    }

    if (updates.mealCompletions !== undefined) {
      // Single meal execution invariant: ensure unique mealId
      const seen = new Set<string>();
      const deduped: MealCompletionRecord[] = [];
      for (const meal of updates.mealCompletions) {
        if (!seen.has(meal.mealId)) {
          seen.add(meal.mealId);
          deduped.push(meal);
        }
      }
      this.props.mealCompletions = deduped;
    }
    if (updates.macroSummary !== undefined) {
      this.props.macroSummary = updates.macroSummary;
    }
    if (updates.hydrationSummary !== undefined) {
      this.props.hydrationSummary = updates.hydrationSummary;
    }
    if (updates.feedback !== undefined) {
      this.props.feedback = updates.feedback;
    }

    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new NutritionCompletionUpdatedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.nutritionPlanId,
        this.props.clientId,
        this.props.trainerId,
        this.props.dayNumber,
        this.props.updatedAt,
      ),
    );

    return Result.ok<void>();
  }

  public complete(
    completedAt: Date = new Date(),
    updates?: {
      mealCompletions?: MealCompletionRecord[];
      macroSummary?: DailyMacroSummary | null;
      hydrationSummary?: HydrationSummary | null;
      feedback?: NutritionFeedback | null;
    },
  ): Result<void> {
    if (this.props.status === NutritionCompletionStatus.COMPLETED) {
      return Result.ok<void>();
    }

    if (this.props.status !== NutritionCompletionStatus.IN_PROGRESS) {
      throw new InvalidNutritionCompletionTransitionException(
        this.props.status,
        NutritionCompletionStatus.COMPLETED,
      );
    }

    if (updates) {
      if (updates.mealCompletions !== undefined) {
        this.props.mealCompletions = [...updates.mealCompletions];
      }
      if (updates.macroSummary !== undefined) {
        this.props.macroSummary = updates.macroSummary;
      }
      if (updates.hydrationSummary !== undefined) {
        this.props.hydrationSummary = updates.hydrationSummary;
      }
      if (updates.feedback !== undefined) {
        this.props.feedback = updates.feedback;
      }
    }

    this.props.status = NutritionCompletionStatus.COMPLETED;
    this.props.completedAt = completedAt;
    this.props.updatedAt = new Date();

    this.addDomainEvent(
      new NutritionCompletedEvent(
        this._id,
        this.props.coachingRelationshipId,
        this.props.nutritionPlanId,
        this.props.clientId,
        this.props.trainerId,
        this.props.dayNumber,
        this.props.completedAt,
      ),
    );

    return Result.ok<void>();
  }

  public static create(
    props: Omit<
      NutritionCompletionProps,
      'createdAt' | 'updatedAt' | 'startedAt' | 'completionDate' | 'weekday' | 'weekNumber'
    > & {
      completionDate?: Date | string;
      weekday?: Weekday;
      weekNumber?: number;
      startedAt?: Date;
      createdAt?: Date;
      updatedAt?: Date;
    },
    id?: string,
  ): Result<NutritionCompletion> {
    if (!props.coachingRelationshipId) {
      return Result.fail<NutritionCompletion>('Coaching relationship ID is required.');
    }
    if (!props.nutritionPlanId) {
      return Result.fail<NutritionCompletion>('Nutrition plan ID is required.');
    }
    if (!props.clientId || !props.trainerId) {
      return Result.fail<NutritionCompletion>('Client ID and Trainer ID are required.');
    }
    if (!props.nutritionDaySnapshot) {
      return Result.fail<NutritionCompletion>('Prescribed NutritionDaySnapshot is required.');
    }

    const normalizedDate = normalizeCalendarDate(props.completionDate);
    const resolvedWeekday =
      props.weekday || props.nutritionDaySnapshot.weekday || getWeekdayFromDate(normalizedDate);
    const resolvedDayNumber = props.dayNumber || props.nutritionDaySnapshot.dayNumber || 1;
    const resolvedWeekNumber = props.weekNumber && props.weekNumber >= 1 ? props.weekNumber : 1;

    const completionId = id || crypto.randomUUID();
    const now = new Date();

    const completion = new NutritionCompletion(
      {
        ...props,
        completionDate: normalizedDate,
        weekday: resolvedWeekday,
        dayNumber: resolvedDayNumber,
        weekNumber: resolvedWeekNumber,
        mealCompletions: props.mealCompletions || [],
        status: props.status || NutritionCompletionStatus.IN_PROGRESS,
        startedAt: props.startedAt || now,
        createdAt: props.createdAt || now,
        updatedAt: props.updatedAt || now,
      },
      completionId,
    );

    if (!id) {
      completion.addDomainEvent(
        new NutritionCompletionStartedEvent(
          completionId,
          props.coachingRelationshipId,
          props.nutritionPlanId,
          props.clientId,
          props.trainerId,
          resolvedDayNumber,
          completion.startedAt,
        ),
      );
    }

    return Result.ok<NutritionCompletion>(completion);
  }

  public static normalizeCalendarDate(dateInput?: Date | string): Date {
    return normalizeCalendarDate(dateInput);
  }

  public static getWeekdayFromDate(date: Date): Weekday {
    return getWeekdayFromDate(date);
  }

  public static reconstitute(props: NutritionCompletionProps, id: string): NutritionCompletion {
    return new NutritionCompletion(props, id);
  }
}
