import { AppError } from '../../../../shared/exceptions/AppError';

export class InvalidCoachingTransitionException extends AppError {
  constructor(currentStatus: string, targetStatus: string) {
    super(
      `Invalid coaching relationship state transition from '${currentStatus}' to '${targetStatus}'.`,
      'INVALID_COACHING_STATE_TRANSITION',
      true,
    );
  }
}

export class ClientHasActiveRelationshipException extends AppError {
  constructor(clientId: string, existingRelationshipId: string) {
    super(
      `Client '${clientId}' already has an active coaching relationship '${existingRelationshipId}'. Only one active coaching relationship is permitted at a time.`,
      'CLIENT_ALREADY_HAS_ACTIVE_RELATIONSHIP',
      true,
    );
  }
}

export class UnauthorizedCoachingActionException extends AppError {
  constructor(action: string, reason: string) {
    super(
      `Unauthorized coaching action '${action}': ${reason}`,
      'UNAUTHORIZED_COACHING_ACTION',
      true,
    );
  }
}

export class CoachingRelationshipNotFoundException extends AppError {
  constructor(relationshipId: string) {
    super(
      `Coaching relationship '${relationshipId}' was not found.`,
      'COACHING_RELATIONSHIP_NOT_FOUND',
      true,
    );
  }
}

export class CoachingConcurrencyConflictException extends AppError {
  constructor(relationshipId: string) {
    super(
      `Concurrency conflict on coaching relationship '${relationshipId}': Aggregate was modified by a concurrent operation. Please reload and retry.`,
      'COACHING_CONCURRENCY_CONFLICT',
      true,
    );
  }
}

export class CoachingRelationshipImmutableException extends AppError {
  constructor(relationshipId: string, status: string) {
    super(
      `Coaching relationship '${relationshipId}' is in terminal state '${status}' and cannot be modified.`,
      'COACHING_RELATIONSHIP_IMMUTABLE',
      true,
    );
  }
}
