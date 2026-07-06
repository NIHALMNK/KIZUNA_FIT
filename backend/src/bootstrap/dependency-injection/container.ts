import { createContainer, asClass, InjectionMode } from 'awilix';
import { WinstonLogger } from '../../infrastructure/logger/WinstonLogger';
import { DatabaseManager } from '../../infrastructure/database/DatabaseManager';
import { RedisManager } from '../../infrastructure/cache/RedisManager';
import { BackgroundJobManager } from '../../infrastructure/queue/BackgroundJobManager';
import { CloudinaryProvider } from '../../infrastructure/storage/CloudinaryProvider';
import { MockEmailProvider } from '../../infrastructure/mail/MockEmailProvider';
import { SocketIOManager } from '../../infrastructure/websocket/SocketIOManager';
import { WebRTCSignaling } from '../../infrastructure/websocket/WebRTCSignaling';

export const configureContainer = () => {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
  });

  container.register({
    logger: asClass(WinstonLogger).singleton(),
    dbManager: asClass(DatabaseManager).singleton(),
    redisManager: asClass(RedisManager).singleton(),
    jobManager: asClass(BackgroundJobManager).singleton(),
    cloudinaryProvider: asClass(CloudinaryProvider).singleton(),
    emailProvider: asClass(MockEmailProvider).singleton(),
    socketIOManager: asClass(SocketIOManager).singleton(),
    webRTCSignaling: asClass(WebRTCSignaling).singleton()
  });

  return container;
};
