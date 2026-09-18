import mongoose, { ClientSession } from 'mongoose';
import {
  INutritionUnitOfWork,
  NutritionTransactionalRepositories,
} from '../../../application/ports/INutritionUnitOfWork';
import { IDomainEvent } from '../../../../../shared/core/AggregateRoot';
import { DomainEventDispatcher } from '../../../../../shared/events/domain-event-dispatcher';

export type NutritionRepositoryFactory = (
  session?: ClientSession,
  eventQueue?: IDomainEvent[],
) => NutritionTransactionalRepositories;

export class MongooseNutritionUnitOfWork implements INutritionUnitOfWork {
  constructor(
    private readonly repositoryFactory: NutritionRepositoryFactory,
    private readonly domainEventDispatcher?: DomainEventDispatcher,
  ) {}

  async withTransaction<T>(
    work: (repos: NutritionTransactionalRepositories) => Promise<T>,
  ): Promise<T> {
    const session: ClientSession = await mongoose.startSession();
    let pendingEvents: IDomainEvent[] = [];
    try {
      let result: T;
      await session.withTransaction(async () => {
        // Reset queue at the start of each attempt so transaction retries do not accumulate duplicate events
        pendingEvents = [];
        const repos = this.repositoryFactory(session, pendingEvents);
        result = await work(repos);
      });

      // Dispatched ONLY after successful transaction commit
      if (this.domainEventDispatcher && pendingEvents.length > 0) {
        try {
          await this.domainEventDispatcher.dispatchAll(pendingEvents);
        } catch {
          // Database transaction has committed permanently. DomainEventDispatcher already handles
          // handler errors internally, but this ensures post-commit dispatch never unseats committed state.
        }
      }

      return result!;
    } finally {
      await session.endSession();
    }
  }
}
