import { AwilixContainer, asClass } from 'awilix';

// Infrastructure
import { MongoCoachingRelationshipRepository } from './infrastructure/persistence/mongoose/repositories/mongo-coaching-relationship.repository';
import { CoachingPaymentSubscriber } from './infrastructure/subscribers/coaching-payment.subscriber';
import { CoachingParticipantEnricherAdapter } from './infrastructure/gateways/coaching-participant-enricher.adapter';

// Application Use Cases
import { CreateCoachingRelationshipUseCase } from './application/use-cases/create-coaching-relationship.use-case';
import { ActivateCoachingRelationshipUseCase } from './application/use-cases/activate-coaching-relationship.use-case';
import { GetCoachingRelationshipUseCase } from './application/use-cases/get-coaching-relationship.use-case';
import { ListCoachingRelationshipsUseCase } from './application/use-cases/list-coaching-relationships.use-case';
import { GetActiveCoachingRelationshipUseCase } from './application/use-cases/get-active-coaching-relationship.use-case';
import { GetCoachingHistoryUseCase } from './application/use-cases/get-coaching-history.use-case';
import { CompleteCoachingRelationshipUseCase } from './application/use-cases/complete-coaching-relationship.use-case';
import { CancelCoachingRelationshipUseCase } from './application/use-cases/cancel-coaching-relationship.use-case';

// Presentation Controller
import { CoachingRelationshipController } from './presentation/controllers/coaching-relationship.controller';

export const registerCoachingDependencies = (container: AwilixContainer): void => {
  // Infrastructure (Scoped & Singleton)
  container.register({
    coachingRepo: asClass(MongoCoachingRelationshipRepository).scoped(),
    coachingPaymentSubscriber: asClass(CoachingPaymentSubscriber).singleton(),
    coachingParticipantEnricher: asClass(CoachingParticipantEnricherAdapter).singleton(),
  });

  // Application Use Cases (Scoped)
  container.register({
    createCoachingRelationshipUseCase: asClass(CreateCoachingRelationshipUseCase).scoped(),
    activateCoachingRelationshipUseCase: asClass(ActivateCoachingRelationshipUseCase).scoped(),
    getCoachingRelationshipUseCase: asClass(GetCoachingRelationshipUseCase).scoped(),
    listCoachingRelationshipsUseCase: asClass(ListCoachingRelationshipsUseCase).scoped(),
    getActiveCoachingRelationshipUseCase: asClass(GetActiveCoachingRelationshipUseCase).scoped(),
    getCoachingHistoryUseCase: asClass(GetCoachingHistoryUseCase).scoped(),
    completeCoachingRelationshipUseCase: asClass(CompleteCoachingRelationshipUseCase).scoped(),
    cancelCoachingRelationshipUseCase: asClass(CancelCoachingRelationshipUseCase).scoped(),
  });

  // Presentation Controller (Scoped)
  container.register({
    coachingRelationshipController: asClass(CoachingRelationshipController).scoped(),
  });
};
