import { IDomainEvent } from '../../../shared/core/AggregateRoot';
import { DomainEventDispatcher } from '../../../shared/events/domain-event-dispatcher';
import {
  IRealtimePublisher,
  RealtimeEventPayload,
} from '../../../shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../shared/contracts/ILogger';

export type EventToRecipientResolver<T extends IDomainEvent = IDomainEvent> = (event: T) => {
  targetUserId?: string;
  targetUserIds?: string[];
  targetRoom?: string;
  realtimeType: string;
  payload?: unknown;
};

/**
 * Infrastructure subscriber bridge connecting DomainEventDispatcher to IRealtimePublisher.
 * Listens for domain events dispatched by application/domain layers and forwards mapped
 * realtime event envelopes to recipient user rooms (`user:<userId>`) via Socket.IO.
 */
export class RealtimeDomainEventSubscriber {
  private resolvers: Map<string, EventToRecipientResolver> = new Map();

  constructor(
    private readonly domainEventDispatcher: DomainEventDispatcher,
    private readonly realtimePublisher: IRealtimePublisher,
    private readonly logger: ILogger,
  ) {}

  /**
   * Registers a domain event to realtime recipient mapping rule.
   */
  public registerMapping<T extends IDomainEvent>(
    domainEventName: string,
    resolver: EventToRecipientResolver<T>,
  ): void {
    this.resolvers.set(domainEventName, resolver as EventToRecipientResolver);

    // Subscribe handler with DomainEventDispatcher
    this.domainEventDispatcher.register<T>(domainEventName, async (event: T) => {
      await this.handleDomainEvent(event);
    });

    this.logger.info(
      `[RealtimeDomainEventSubscriber] Registered realtime mapping for '${domainEventName}'`,
    );
  }

  private async handleDomainEvent(event: IDomainEvent): Promise<void> {
    const eventName = event.constructor.name;
    const resolver = this.resolvers.get(eventName);

    if (!resolver) {
      return;
    }

    try {
      const { targetUserId, targetUserIds, targetRoom, realtimeType, payload } = resolver(event);

      const envelope: RealtimeEventPayload = {
        type: realtimeType,
        version: 1,
        timestamp: event.dateTimeOccurred
          ? event.dateTimeOccurred.toISOString()
          : new Date().toISOString(),
        entityId: event.getAggregateId(),
        payload: payload || event,
      };

      if (targetUserIds && targetUserIds.length > 0) {
        const uniqueUserIds = Array.from(
          new Set(targetUserIds.filter((id): id is string => Boolean(id))),
        );
        for (const userId of uniqueUserIds) {
          this.realtimePublisher.publishToUser(userId, envelope);
          this.logger.debug(
            `[RealtimeDomainEventSubscriber] Published '${realtimeType}' to user '${userId}'`,
          );
        }
      } else if (targetUserId) {
        this.realtimePublisher.publishToUser(targetUserId, envelope);
        this.logger.debug(
          `[RealtimeDomainEventSubscriber] Published '${realtimeType}' to user '${targetUserId}'`,
        );
      } else if (targetRoom) {
        this.realtimePublisher.publishToRoom(targetRoom, envelope);
        this.logger.debug(
          `[RealtimeDomainEventSubscriber] Published '${realtimeType}' to room '${targetRoom}'`,
        );
      } else {
        this.logger.warn(
          `[RealtimeDomainEventSubscriber] No recipient target specified for event '${eventName}'`,
        );
      }
    } catch (error: unknown) {
      this.logger.error(
        `[RealtimeDomainEventSubscriber] Failed to bridge domain event '${eventName}' to realtime`,
        { error },
      );
    }
  }
}
