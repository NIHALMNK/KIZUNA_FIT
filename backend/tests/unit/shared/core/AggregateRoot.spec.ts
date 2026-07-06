import { describe, it, expect } from 'vitest';
import { AggregateRoot, IDomainEvent } from '../../../../src/shared/core/AggregateRoot';

class TestAggregate extends AggregateRoot<{ name: string }> {
  public doSomething() {
    this.addDomainEvent({ dateTimeOccurred: new Date(), getAggregateId: () => this.id } as IDomainEvent);
  }
}

describe('AggregateRoot', () => {
  it('should add domain events', () => {
    const aggregate = new TestAggregate({ name: 'test' }, 'id-1');
    aggregate.doSomething();
    expect(aggregate.domainEvents.length).toBe(1);
  });

  it('should clear domain events', () => {
    const aggregate = new TestAggregate({ name: 'test' }, 'id-1');
    aggregate.doSomething();
    aggregate.clearEvents();
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
