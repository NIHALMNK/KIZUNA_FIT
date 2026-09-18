import { AwilixContainer, asClass, asValue, asFunction } from 'awilix';
import { ClientSession } from 'mongoose';
import { DomainEventDispatcher } from '../../shared/events/domain-event-dispatcher';
import { IDomainEvent } from '../../shared/core/AggregateRoot';
import { MongoNutritionPlanRepository } from './infrastructure/persistence/mongoose/repositories/MongoNutritionPlanRepository';
import { MongoNutritionCompletionRepository } from './infrastructure/persistence/mongoose/repositories/MongoNutritionCompletionRepository';
import {
  MongooseNutritionUnitOfWork,
  NutritionRepositoryFactory,
} from './infrastructure/persistence/mongoose/MongooseNutritionUnitOfWork';
import { NutritionCoachingAdapter } from './infrastructure/gateways/nutrition-coaching.adapter';

import { CreateNutritionPlanUseCase } from './application/use-cases/plan/create-nutrition-plan.use-case';
import { UpdateNutritionPlanUseCase } from './application/use-cases/plan/update-nutrition-plan.use-case';
import { CreateNutritionPlanVersionUseCase } from './application/use-cases/plan/create-nutrition-plan-version.use-case';
import { ActivateNutritionPlanUseCase } from './application/use-cases/plan/activate-nutrition-plan.use-case';
import { CompleteNutritionPlanUseCase } from './application/use-cases/plan/complete-nutrition-plan.use-case';
import { DeleteDraftNutritionPlanUseCase } from './application/use-cases/plan/delete-draft-nutrition-plan.use-case';
import { GetNutritionPlanUseCase } from './application/use-cases/plan/get-nutrition-plan.use-case';
import { GetActiveNutritionPlanUseCase } from './application/use-cases/plan/get-active-nutrition-plan.use-case';
import { ListNutritionPlansUseCase } from './application/use-cases/plan/list-nutrition-plans.use-case';
import { SubmitNutritionPlanUseCase } from './application/use-cases/plan/submit-nutrition-plan.use-case';
import { RecallNutritionPlanUseCase } from './application/use-cases/plan/recall-nutrition-plan.use-case';
import { AcceptNutritionPlanUseCase } from './application/use-cases/plan/accept-nutrition-plan.use-case';
import { RejectNutritionPlanUseCase } from './application/use-cases/plan/reject-nutrition-plan.use-case';
import { RequestNutritionPlanDeletionUseCase } from './application/use-cases/plan/request-nutrition-plan-deletion.use-case';
import { AcceptNutritionPlanDeletionUseCase } from './application/use-cases/plan/accept-nutrition-plan-deletion.use-case';
import { RejectNutritionPlanDeletionUseCase } from './application/use-cases/plan/reject-nutrition-plan-deletion.use-case';
import { GetPendingNutritionPlanUseCase } from './application/use-cases/plan/get-pending-nutrition-plan.use-case';

// Completion Use Cases
import { StartNutritionCompletionUseCase } from './application/use-cases/completion/start-nutrition-completion.use-case';
import { UpdateNutritionCompletionUseCase } from './application/use-cases/completion/update-nutrition-completion.use-case';
import { CompleteNutritionCompletionUseCase } from './application/use-cases/completion/complete-nutrition-completion.use-case';
import { GetNutritionCompletionUseCase } from './application/use-cases/completion/get-nutrition-completion.use-case';
import { ListNutritionCompletionsUseCase } from './application/use-cases/completion/list-nutrition-completions.use-case';

// Presentation Controllers
import { NutritionPlanController } from './presentation/controllers/nutrition-plan.controller';
import { NutritionCompletionController } from './presentation/controllers/nutrition-completion.controller';

export const registerNutritionDependencies = (container: AwilixContainer): void => {
  // 1. Register Session-aware Repository Factory for Unit of Work
  const nutritionRepositoryFactory: NutritionRepositoryFactory = (
    session?: ClientSession,
    eventQueue?: IDomainEvent[],
  ) => {
    const domainEventDispatcher = container.hasRegistration('domainEventDispatcher')
      ? container.resolve<DomainEventDispatcher>('domainEventDispatcher')
      : undefined;

    return {
      planRepo: new MongoNutritionPlanRepository(domainEventDispatcher, session, eventQueue),
      completionRepo: new MongoNutritionCompletionRepository(
        domainEventDispatcher,
        session,
        eventQueue,
      ),
    };
  };

  container.register({
    nutritionRepositoryFactory: asValue(nutritionRepositoryFactory),
    repositoryFactory: asValue(nutritionRepositoryFactory),

    // 2. Register Unit of Work & Adapters
    nutritionUnitOfWork: asFunction(
      (
        repositoryFactory: NutritionRepositoryFactory,
        domainEventDispatcher: DomainEventDispatcher,
      ) => new MongooseNutritionUnitOfWork(repositoryFactory, domainEventDispatcher),
    ).scoped(),
    nutritionCoachingGateway: asClass(NutritionCoachingAdapter).scoped(),

    // 3. Register Repositories
    nutritionPlanRepository: asFunction(
      (domainEventDispatcher: DomainEventDispatcher) =>
        new MongoNutritionPlanRepository(domainEventDispatcher),
    ).scoped(),
    nutritionCompletionRepository: asFunction(
      (domainEventDispatcher: DomainEventDispatcher) =>
        new MongoNutritionCompletionRepository(domainEventDispatcher),
    ).scoped(),

    // 4. Plan Use Cases
    createNutritionPlanUseCase: asClass(CreateNutritionPlanUseCase).scoped(),
    updateNutritionPlanUseCase: asClass(UpdateNutritionPlanUseCase).scoped(),
    createNutritionPlanVersionUseCase: asClass(CreateNutritionPlanVersionUseCase).scoped(),
    activateNutritionPlanUseCase: asClass(ActivateNutritionPlanUseCase).scoped(),
    completeNutritionPlanUseCase: asClass(CompleteNutritionPlanUseCase).scoped(),
    deleteDraftNutritionPlanUseCase: asClass(DeleteDraftNutritionPlanUseCase).scoped(),
    getNutritionPlanUseCase: asClass(GetNutritionPlanUseCase).scoped(),
    getActiveNutritionPlanUseCase: asClass(GetActiveNutritionPlanUseCase).scoped(),
    listNutritionPlansUseCase: asClass(ListNutritionPlansUseCase).scoped(),
    submitNutritionPlanUseCase: asClass(SubmitNutritionPlanUseCase).scoped(),
    recallNutritionPlanUseCase: asClass(RecallNutritionPlanUseCase).scoped(),
    acceptNutritionPlanUseCase: asClass(AcceptNutritionPlanUseCase).scoped(),
    rejectNutritionPlanUseCase: asClass(RejectNutritionPlanUseCase).scoped(),
    requestNutritionPlanDeletionUseCase: asClass(RequestNutritionPlanDeletionUseCase).scoped(),
    acceptNutritionPlanDeletionUseCase: asClass(AcceptNutritionPlanDeletionUseCase).scoped(),
    rejectNutritionPlanDeletionUseCase: asClass(RejectNutritionPlanDeletionUseCase).scoped(),
    getPendingNutritionPlanUseCase: asClass(GetPendingNutritionPlanUseCase).scoped(),

    // 5. Completion Use Cases
    startNutritionCompletionUseCase: asClass(StartNutritionCompletionUseCase).scoped(),
    updateNutritionCompletionUseCase: asClass(UpdateNutritionCompletionUseCase).scoped(),
    completeNutritionCompletionUseCase: asClass(CompleteNutritionCompletionUseCase).scoped(),
    getNutritionCompletionUseCase: asClass(GetNutritionCompletionUseCase).scoped(),
    listNutritionCompletionsUseCase: asClass(ListNutritionCompletionsUseCase).scoped(),

    // 6. Presentation Controllers
    nutritionPlanController: asClass(NutritionPlanController).scoped(),
    nutritionCompletionController: asClass(NutritionCompletionController).scoped(),
  });
};
