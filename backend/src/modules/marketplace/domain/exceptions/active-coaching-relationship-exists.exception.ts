import { AppError } from '../../../../shared/exceptions/AppError';

export class ActiveCoachingRelationshipExistsException extends AppError {
  constructor(clientId: string, trainerId: string) {
    super(
      `An active coaching relationship already exists between client ${clientId} and trainer ${trainerId}`,
      'ACTIVE_COACHING_RELATIONSHIP_EXISTS',
      true,
    );
  }
}
