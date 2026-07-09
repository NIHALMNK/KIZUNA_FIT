import { IDomainEvent } from '../../core/AggregateRoot';

// Defining IEventHandler locally for the shared implementation
export interface IEventHandler<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
}

export class InMemoryEventBus {
  private handlers: Map<string, IEventHandler<IDomainEvent>[]> = new Map();

  public subscribe<T extends IDomainEvent>(eventName: string, handler: IEventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  public async publish(events: IDomainEvent[]): Promise<void> {
    for (const event of events) {
      const eventName = event.constructor.name;
      const eventHandlers = this.handlers.get(eventName) || [];
      
      if (eventHandlers.length === 0) {
        continue;
      }

      // Execute all handlers for this event in parallel
      const promises = eventHandlers.map(handler => this.executeHandlerSafely(handler, event, eventName));
      await Promise.allSettled(promises);
    }
  }

  private async executeHandlerSafely(handler: IEventHandler<IDomainEvent>, event: IDomainEvent, eventName: string): Promise<void> {
    try {
      await handler.handle(event);
    } catch (error) {
      // Failure Isolation Policy: Log the error, but do not throw it to the publisher
      console.error(`[InMemoryEventBus] Error executing handler for event ${eventName}:`, error);
    }
  }
}
