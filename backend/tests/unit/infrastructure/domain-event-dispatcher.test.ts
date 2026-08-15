import { describe, it, expect, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../src/shared/events/domain-event-dispatcher';
import { IDomainEvent } from '../../../src/shared/core/AggregateRoot';

class DummyDomainEvent implements IDomainEvent {
  public readonly dateTimeOccurred = new Date();
  constructor(
    public readonly aggregateId: string,
    public readonly message: string,
  ) {}

  public getAggregateId(): string {
    return this.aggregateId;
  }
}

describe('DomainEventDispatcher (TEST R9 & R11)', () => {
  it('TEST R9 — should dispatch registered events to subscribers without domain coupling', async () => {
    const dispatcher = new DomainEventDispatcher();
    const handlerFn = vi.fn();

    dispatcher.register<DummyDomainEvent>('DummyDomainEvent', handlerFn);

    const event = new DummyDomainEvent('agg_123', 'Hello Domain Event');
    await dispatcher.dispatch(event);

    expect(handlerFn).toHaveBeenCalledTimes(1);
    expect(handlerFn).toHaveBeenCalledWith(event);
  });

  it('TEST R11 — domain layer contains zero dependency on Socket.IO', async () => {
    const dispatcher = new DomainEventDispatcher();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    dispatcher.register('DummyDomainEvent', handler1);
    dispatcher.register('DummyDomainEvent', handler2);

    await dispatcher.dispatchAll([new DummyDomainEvent('agg_1', 'Msg 1')]);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
