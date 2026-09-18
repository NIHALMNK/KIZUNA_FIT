import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidNutritionPlanTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid nutrition plan transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_NUTRITION_PLAN_TRANSITION',
      true,
    );
  }
}

export class ActiveNutritionPlanImmutableException extends AppError {
  constructor(planId: string) {
    super(
      `Nutrition plan '${planId}' is ACTIVE and cannot be directly modified. Create a new version to modify (Rule ND-2).`,
      'ACTIVE_NUTRITION_PLAN_IMMUTABLE',
      true,
    );
  }
}

export class CompletedNutritionPlanImmutableException extends AppError {
  constructor(planId: string) {
    super(
      `Nutrition plan '${planId}' is COMPLETED and cannot be modified.`,
      'COMPLETED_NUTRITION_PLAN_IMMUTABLE',
      true,
    );
  }
}

export class CancelledNutritionPlanImmutableException extends AppError {
  constructor(planId: string) {
    super(
      `Nutrition plan '${planId}' is CANCELLED and cannot be modified.`,
      'CANCELLED_NUTRITION_PLAN_IMMUTABLE',
      true,
    );
  }
}

export class NutritionPlanPendingApprovalImmutableException extends AppError {
  constructor(planId: string) {
    super(
      `Nutrition plan '${planId}' is PENDING_APPROVAL and is locked against modifications while awaiting client review.`,
      'NUTRITION_PLAN_PENDING_APPROVAL_IMMUTABLE',
      true,
    );
  }
}

export class NutritionPlanDeletionPendingImmutableException extends AppError {
  constructor(planId: string) {
    super(
      `Nutrition plan '${planId}' is DELETION_PENDING and cannot be modified while retirement is under client review.`,
      'NUTRITION_PLAN_DELETION_PENDING_IMMUTABLE',
      true,
    );
  }
}

export class NutritionPlanVersionAlreadyExistsException extends AppError {
  constructor(coachingRelationshipId: string, version: number) {
    super(
      `A nutrition plan version ${version} already exists for coaching relationship '${coachingRelationshipId}'.`,
      'NUTRITION_PLAN_VERSION_ALREADY_EXISTS',
      true,
    );
  }
}

export class PendingNutritionPlanAlreadyExistsException extends AppError {
  constructor(coachingRelationshipId: string, existingPlanId: string) {
    super(
      `Coaching relationship '${coachingRelationshipId}' already has a nutrition plan '${existingPlanId}' pending client approval. Only one pending approval plan is permitted at a time.`,
      'PENDING_NUTRITION_PLAN_ALREADY_EXISTS',
      true,
    );
  }
}

export class InitialNutritionPlanAlreadyExistsException extends AppError {
  constructor(coachingRelationshipId: string) {
    super(
      `Coaching relationship '${coachingRelationshipId}' already has nutrition plan history. Initial plan creation endpoint is restricted to relationships with zero history. Use version/forking instead.`,
      'INITIAL_NUTRITION_PLAN_ALREADY_EXISTS',
      true,
    );
  }
}

export class ActiveNutritionPlanAlreadyExistsException extends AppError {
  constructor(coachingRelationshipId: string, existingPlanId: string) {
    super(
      `Coaching relationship '${coachingRelationshipId}' already has an active nutrition plan '${existingPlanId}'. Only one active nutrition plan is permitted per relationship (Rule ND-7).`,
      'ACTIVE_NUTRITION_PLAN_ALREADY_EXISTS',
      true,
    );
  }
}

export class NutritionPlanNotFoundException extends AppError {
  constructor(planId: string) {
    super(`Nutrition plan with ID '${planId}' was not found.`, 'NUTRITION_PLAN_NOT_FOUND', true);
  }
}

export class InvalidNutritionDurationException extends AppError {
  constructor(durationWeeks: number) {
    super(
      `Invalid nutrition plan duration '${durationWeeks}' weeks. Duration must be between 1 and 52 weeks (Rule ND-11/12).`,
      'INVALID_NUTRITION_DURATION',
      true,
    );
  }
}

export class InvalidNutritionDayNumberingException extends AppError {
  constructor(message: string) {
    super(`Invalid nutrition day numbering: ${message}`, 'INVALID_NUTRITION_DAY_NUMBERING', true);
  }
}

export class EmptyNutritionDaysException extends AppError {
  constructor() {
    super(
      'Nutrition plan must contain at least one prescribed nutrition day (Rule ND-13).',
      'EMPTY_NUTRITION_DAYS',
      true,
    );
  }
}

export class EmptyMealsInNutritionDayException extends AppError {
  constructor(dayNumber: number) {
    super(
      `NutritionDay ${dayNumber} must contain at least one prescribed meal (Rule ND-13).`,
      'EMPTY_MEALS_IN_NUTRITION_DAY',
      true,
    );
  }
}

export class InvalidMealTypeException extends AppError {
  constructor(mealType: string) {
    super(
      `Invalid meal type '${mealType}'. Allowed types are BREAKFAST, LUNCH, DINNER, SNACK, CUSTOM.`,
      'INVALID_MEAL_TYPE',
      true,
    );
  }
}

export class InvalidNutritionCompletionTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid nutrition completion transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_NUTRITION_COMPLETION_TRANSITION',
      true,
    );
  }
}

export class NutritionCompletionNotFoundException extends AppError {
  constructor(completionId: string) {
    super(
      `Nutrition completion record '${completionId}' was not found.`,
      'NUTRITION_COMPLETION_NOT_FOUND',
      true,
    );
  }
}

export class NutritionCompletionImmutableException extends AppError {
  constructor(completionId: string, status: string) {
    super(
      `Nutrition completion '${completionId}' is finalized with status '${status}' and cannot be altered.`,
      'NUTRITION_COMPLETION_IMMUTABLE',
      true,
    );
  }
}

export class DuplicateNutritionCompletionException extends AppError {
  constructor(planId: string, dayOrDate: number | string) {
    super(
      `A nutrition completion record already exists for plan '${planId}' and ${typeof dayOrDate === 'number' ? `day ${dayOrDate}` : `date ${dayOrDate}`}.`,
      'DUPLICATE_NUTRITION_COMPLETION',
      true,
    );
  }
}

export class UnauthorizedNutritionActionException extends AppError {
  constructor(action: string, reason: string) {
    super(
      `Unauthorized nutrition action '${action}': ${reason}`,
      'UNAUTHORIZED_NUTRITION_ACTION',
      true,
    );
  }
}

export class NutritionConcurrencyConflictException extends AppError {
  constructor(aggregateId: string) {
    super(
      `Concurrency conflict on nutrition aggregate '${aggregateId}': Aggregate was modified by a concurrent operation. Please reload and retry.`,
      'NUTRITION_CONCURRENCY_CONFLICT',
      true,
    );
  }
}
