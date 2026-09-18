import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidExerciseStatusException extends AppError {
  constructor(message: string) {
    super(message, 'INVALID_EXERCISE_STATUS', true);
  }
}

export class ExerciseNotFoundException extends AppError {
  constructor(exerciseId: string) {
    super(`Exercise with ID '${exerciseId}' was not found.`, 'EXERCISE_NOT_FOUND', true);
  }
}

export class DeprecatedExerciseUsageException extends AppError {
  constructor(exerciseId: string) {
    super(
      `Exercise '${exerciseId}' is DEPRECATED and cannot be prescribed in new workout programs (Rule EX-2).`,
      'DEPRECATED_EXERCISE_USAGE_FORBIDDEN',
      true,
    );
  }
}

export class InvalidWorkoutProgramTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid workout program transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_WORKOUT_PROGRAM_TRANSITION',
      true,
    );
  }
}

export class ActiveWorkoutProgramImmutableException extends AppError {
  constructor(programId: string) {
    super(
      `Workout program '${programId}' is ACTIVE and cannot be directly modified. Create a new version to modify (Rule WP-4).`,
      'ACTIVE_WORKOUT_PROGRAM_IMMUTABLE',
      true,
    );
  }
}

export class ActiveProgramAlreadyExistsException extends AppError {
  constructor(coachingRelationshipId: string, existingProgramId: string) {
    super(
      `Coaching relationship '${coachingRelationshipId}' already has an active workout program '${existingProgramId}'. Only one active workout program is permitted per relationship (Rule WP-3).`,
      'ACTIVE_WORKOUT_PROGRAM_ALREADY_EXISTS',
      true,
    );
  }
}

export class WorkoutProgramNotFoundException extends AppError {
  constructor(programId: string) {
    super(
      `Workout program with ID '${programId}' was not found.`,
      'WORKOUT_PROGRAM_NOT_FOUND',
      true,
    );
  }
}

export class InvalidWorkoutCompletionTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid workout completion transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_WORKOUT_COMPLETION_TRANSITION',
      true,
    );
  }
}

export class WorkoutCompletionNotFoundException extends AppError {
  constructor(completionId: string) {
    super(
      `Workout completion record '${completionId}' was not found.`,
      'WORKOUT_COMPLETION_NOT_FOUND',
      true,
    );
  }
}

export class WorkoutCompletionImmutableException extends AppError {
  constructor(completionId: string, status: string) {
    super(
      `Workout completion '${completionId}' is finalized with status '${status}' and cannot be altered (Rule WC-2).`,
      'WORKOUT_COMPLETION_IMMUTABLE',
      true,
    );
  }
}

export class UnauthorizedWorkoutActionException extends AppError {
  constructor(action: string, reason: string) {
    super(
      `Unauthorized workout action '${action}': ${reason}`,
      'UNAUTHORIZED_WORKOUT_ACTION',
      true,
    );
  }
}

export class WorkoutConcurrencyConflictException extends AppError {
  constructor(aggregateId: string) {
    super(
      `Concurrency conflict on workout aggregate '${aggregateId}': Aggregate was modified by a concurrent operation. Please reload and retry.`,
      'WORKOUT_CONCURRENCY_CONFLICT',
      true,
    );
  }
}
