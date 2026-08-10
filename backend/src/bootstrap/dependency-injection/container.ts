import { createContainer, asClass, InjectionMode } from 'awilix';
import { WinstonLogger } from '../../infrastructure/logger/WinstonLogger';
import { DatabaseManager } from '../../infrastructure/database/DatabaseManager';
import { RedisManager } from '../../infrastructure/cache/RedisManager';
import { BackgroundJobManager } from '../../infrastructure/queue/BackgroundJobManager';
import { CloudinaryProvider } from '../../infrastructure/storage/CloudinaryProvider';
import { MockEmailProvider } from '../../infrastructure/mail/MockEmailProvider';
import { SocketIOManager } from '../../infrastructure/websocket/SocketIOManager';
import { WebRTCSignaling } from '../../infrastructure/websocket/WebRTCSignaling';
import { DomainEventDispatcher } from '../../shared/events/domain-event-dispatcher';
import { SocketIORealtimePublisher } from '../../infrastructure/websocket/publishers/SocketIORealtimePublisher';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerMarketplaceModule } from '../../modules/marketplace/module';

export const configureContainer = () => {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
  });

  container.register({
    logger: asClass(WinstonLogger).singleton(),
    dbManager: asClass(DatabaseManager).singleton(),
    redisManager: asClass(RedisManager).singleton(),
    jobManager: asClass(BackgroundJobManager).singleton(),
    cloudinaryProvider: asClass(CloudinaryProvider).singleton(),
    emailProvider: asClass(MockEmailProvider).singleton(),
    socketIOManager: asClass(SocketIOManager).singleton(),
    webRTCSignaling: asClass(WebRTCSignaling).singleton(),
    domainEventDispatcher: asClass(DomainEventDispatcher).singleton(),
    realtimePublisher: asClass(SocketIORealtimePublisher).singleton(),
    realtimeDomainEventSubscriber: asClass(RealtimeDomainEventSubscriber).singleton(),
  });

  registerMarketplaceModule(container);

  return container;
};
