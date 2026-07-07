import { IDomainEvent } from '../../../../shared/core/AggregateRoot';

export interface IEventBus {
  publish(events: IDomainEvent[]): Promise<void>;
}
