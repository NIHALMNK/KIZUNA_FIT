import { IDomainEvent } from '../core/AggregateRoot';
import { ILogger } from '../contracts/ILogger';

export type DomainEventHandler<T extends IDomainEvent = IDomainEvent> = (
  event: T,
) => Promise<void> | void;

/**
 * Platform-wide Domain Event Dispatcher.
 * Dispatches aggregate domain events to registered infrastructure/application subscribers
 * (such as RealtimePublisher, BullMQ, Analytics, Audit loggers) without coupling domain aggregates to infrastructure.
 */
export class DomainEventDispatcher {
  private handlers: Map<string, DomainEventHandler[]> = new Map();

  constructor(private readonly logger?: ILogger) {}

  public register<T extends IDomainEvent>(eventName: string, handler: DomainEventHandler<T>): void {
    const existing = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...existing, handler as DomainEventHandler]);
    if (this.logger) {
      this.logger.debug(`[DomainEventDispatcher] Registered handler for '${eventName}'`);
    }
  }

  public async dispatch(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const handlers = this.handlers.get(eventName) || [];

    if (this.logger) {
      this.logger.debug(
        `[DomainEventDispatcher] Dispatching '${eventName}' for aggregate '${event.getAggregateId()}' to ${handlers.length} handler(s)`,
      );
    }

    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        if (this.logger) {
          this.logger.error(`[DomainEventDispatcher] Error in handler for event '${eventName}'`, {
            error,
          });
        }
      }
    }
  }

  public async dispatchAll(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }
}
