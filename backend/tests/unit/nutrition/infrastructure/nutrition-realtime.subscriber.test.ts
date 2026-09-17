import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { IRealtimePublisher } from '../../../../src/shared/contracts/IRealtimePublisher';
import { ILogger } from '../../../../src/shared/contracts/ILogger';
import { RealtimeDomainEventSubscriber } from '../../../../src/infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerNutritionRealtimeEvents } from '../../../../src/modules/nutrition/infrastructure/realtime/nutrition-realtime.subscriber';
import {
  NutritionPlanCreatedEvent,
  NutritionPlanActivatedEvent,
  NutritionPlanCompletedEvent,
  NutritionCompletionStartedEvent,
  NutritionCompletionUpdatedEvent,
  NutritionCompletedEvent,
} from '../../../../src/modules/nutrition/domain/events';
import { NutritionPlanStatus } from '../../../../src/modules/nutrition/domain/enums';

describe('Nutrition Realtime Subscriber Unit Tests', () => {
  let dispatcher: DomainEventDispatcher;
  let mockPublisher: IRealtimePublisher;
  let mockLogger: ILogger;
  let subscriber: RealtimeDomainEventSubscriber;

  let publishedEvents: Array<{ userId: string; event: any }>;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };

    publishedEvents = [];
    mockPublisher = {
      publishToUser: vi.fn((userId, event) => {
        publishedEvents.push({ userId, event });
      }),
      publishToRoom: vi.fn(),
      publishToAll: vi.fn(),
    };

    dispatcher = new DomainEventDispatcher(mockLogger);
    subscriber = new RealtimeDomainEventSubscriber(dispatcher, mockPublisher, mockLogger);

    registerNutritionRealtimeEvents(subscriber);
  });

  it('should map and publish NutritionPlanCreatedEvent to client and trainer rooms', async () => {
    const event = new NutritionPlanCreatedEvent(
      'plan_1',
      'rel_1',
      'trainer_1',
      'client_1',
      1,
      NutritionPlanStatus.DRAFT,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    expect(publishedEvents[0].userId).toBe('client_1');
    expect(publishedEvents[1].userId).toBe('trainer_1');

    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:plan_created');
    expect(envelope.entityId).toBe('plan_1');
    expect(envelope.payload).toEqual({
      planId: 'plan_1',
      coachingRelationshipId: 'rel_1',
      trainerId: 'trainer_1',
      clientId: 'client_1',
      version: 1,
      status: NutritionPlanStatus.DRAFT,
    });
  });

  it('should map and publish NutritionPlanActivatedEvent to client and trainer rooms', async () => {
    const activatedAt = new Date();
    const event = new NutritionPlanActivatedEvent(
      'plan_2',
      'rel_1',
      'trainer_1',
      'client_1',
      2,
      activatedAt,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:plan_activated');
    expect(envelope.payload.planId).toBe('plan_2');
    expect(envelope.payload.version).toBe(2);
    expect(envelope.payload.activatedAt).toBe(activatedAt.toISOString());
  });

  it('should map and publish NutritionPlanCompletedEvent to client and trainer rooms', async () => {
    const completedAt = new Date();
    const event = new NutritionPlanCompletedEvent(
      'plan_1',
      'rel_1',
      'trainer_1',
      'client_1',
      1,
      completedAt,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:plan_completed');
    expect(envelope.payload.planId).toBe('plan_1');
    expect(envelope.payload.completedAt).toBe(completedAt.toISOString());
  });

  it('should map and publish NutritionCompletionStartedEvent to client and trainer rooms', async () => {
    const startedAt = new Date();
    const event = new NutritionCompletionStartedEvent(
      'comp_1',
      'rel_1',
      'plan_1',
      'client_1',
      'trainer_1',
      1,
      startedAt,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:completion_started');
    expect(envelope.payload.completionId).toBe('comp_1');
    expect(envelope.payload.dayNumber).toBe(1);
    expect(envelope.payload.startedAt).toBe(startedAt.toISOString());
  });

  it('should map and publish NutritionCompletionUpdatedEvent to client and trainer rooms', async () => {
    const updatedAt = new Date();
    const event = new NutritionCompletionUpdatedEvent(
      'comp_1',
      'rel_1',
      'plan_1',
      'client_1',
      'trainer_1',
      1,
      updatedAt,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:completion_updated');
    expect(envelope.payload.completionId).toBe('comp_1');
    expect(envelope.payload.updatedAt).toBe(updatedAt.toISOString());
  });

  it('should map and publish NutritionCompletedEvent to client and trainer rooms', async () => {
    const completedAt = new Date();
    const event = new NutritionCompletedEvent(
      'comp_1',
      'rel_1',
      'plan_1',
      'client_1',
      'trainer_1',
      1,
      completedAt,
    );

    await dispatcher.dispatch(event);

    expect(publishedEvents.length).toBe(2);
    const envelope = publishedEvents[0].event;
    expect(envelope.type).toBe('nutrition:completed');
    expect(envelope.payload.completionId).toBe('comp_1');
    expect(envelope.payload.completedAt).toBe(completedAt.toISOString());
  });

  it('should handle publisher failure gracefully without bubbling errors to domain dispatcher', async () => {
    (mockPublisher.publishToUser as any).mockImplementation(() => {
      throw new Error('Socket.IO connection network error');
    });

    const event = new NutritionPlanCreatedEvent(
      'plan_err',
      'rel_err',
      'trainer_1',
      'client_1',
      1,
      NutritionPlanStatus.DRAFT,
    );

    // Dispatching should not throw an unhandled exception
    await expect(dispatcher.dispatch(event)).resolves.not.toThrow();
  });
});
