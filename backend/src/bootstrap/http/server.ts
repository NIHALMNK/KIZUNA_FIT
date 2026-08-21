import { createApp } from './app';
import { configureContainer } from '../dependency-injection/container';
import { registerIdentityModule } from '../../modules/identity/module';
import { registerProfileModule } from '../../modules/profile/module';
import { env } from '../../config/env.config';
import http from 'http';
import { ILogger } from '../../shared/contracts/ILogger';
import { DatabaseManager } from '../../infrastructure/database/DatabaseManager';
import { RedisManager } from '../../infrastructure/cache/RedisManager';
import { BackgroundJobManager } from '../../infrastructure/queue/BackgroundJobManager';
import { CloudinaryProvider } from '../../infrastructure/storage/CloudinaryProvider';
import { MockEmailProvider } from '../../infrastructure/mail/MockEmailProvider';
import { SocketIOManager } from '../../infrastructure/websocket/SocketIOManager';
import { WebRTCSignaling } from '../../infrastructure/websocket/WebRTCSignaling';
import { RealtimeDomainEventSubscriber } from '../../infrastructure/websocket/subscribers/RealtimeDomainEventSubscriber';
import { registerMarketplaceRealtimeEvents } from '../../modules/marketplace/infrastructure/realtime/marketplace-realtime.subscriber';
import { registerProfileRealtimeEvents } from '../../modules/profile/infrastructure/realtime/profile-realtime.subscriber';
import { registerConsultationRealtimeEvents } from '../../modules/consultation/infrastructure/realtime/consultation-realtime.subscriber';
import { MarketplaceConsultationSubscriber } from '../../modules/marketplace/infrastructure/subscribers/marketplace-consultation.subscriber';

async function bootstrap() {
  // 1. Load Environment (Handled by env import)

  // 2. Initialize Logger & Container
  const container = configureContainer();
  const logger = container.resolve<ILogger>('logger');
  logger.info('✅ Environment Loaded');
  logger.info('✅ Logger Initialized');

  // Register Modules
  registerIdentityModule(container);
  logger.info('✅ Identity Module Registered');

  registerProfileModule(container);
  logger.info('✅ Profile Module Registered');

  // Resolve managers
  const dbManager = container.resolve<DatabaseManager>('dbManager');
  const redisManager = container.resolve<RedisManager>('redisManager');
  const jobManager = container.resolve<BackgroundJobManager>('jobManager');
  const socketIOManager = container.resolve<SocketIOManager>('socketIOManager');
  const webRTCSignaling = container.resolve<WebRTCSignaling>('webRTCSignaling');

  // Resolve providers that don't need to be kept around
  container.resolve<CloudinaryProvider>('cloudinaryProvider');
  container.resolve<MockEmailProvider>('emailProvider');
  const realtimeSubscriber = container.resolve<RealtimeDomainEventSubscriber>(
    'realtimeDomainEventSubscriber',
  );
  const marketplaceConsultationSubscriber = container.resolve<MarketplaceConsultationSubscriber>(
    'marketplaceConsultationSubscriber',
  );
  marketplaceConsultationSubscriber.register();

  const marketplaceOfferSubscriber = container.resolve<{ register: () => void }>(
    'marketplaceOfferSubscriber',
  );
  marketplaceOfferSubscriber.register();

  registerMarketplaceRealtimeEvents(realtimeSubscriber);
  registerProfileRealtimeEvents(realtimeSubscriber);
  registerConsultationRealtimeEvents(realtimeSubscriber);

  try {
    // 3. Connect MongoDB (Fail Fast)
    await dbManager.connect();

    // 4. Connect Redis (Fail Fast)
    await redisManager.connect();

    // 5. Initialize BullMQ
    // Accessing jobManager ensures it's constructed
    logger.info('✅ BullMQ Initialized');

    // 6. Initialize Cloudinary
    logger.info('✅ Cloudinary Initialized');

    // 7. Initialize Email Provider
    logger.info('✅ Email Provider Initialized');

    // 8. Create Express App
    const app = createApp(container);
    logger.info('✅ Express App Created');

    // 9. Create HTTP Server
    const server = http.createServer(app);
    logger.info('✅ HTTP Server Created');

    // 10. Initialize Socket.IO
    socketIOManager.initialize(server);
    logger.info('✅ Socket.IO Initialized');

    // 11. Initialize WebRTC Signaling
    webRTCSignaling.initialize();
    logger.info('✅ WebRTC Signaling Initialized');

    // 12. Register Routes and Global Error Handler
    // Routes and handlers are currently registered inside createApp
    logger.info('✅ Routes and Handlers Registered');

    // 14. Start HTTP Server
    server.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    // 15. Register Graceful Shutdown
    const shutdown = async (signal: string) => {
      logger.info(`🛑 Received ${signal}. Shutting down gracefully...`);

      const timeout = setTimeout(() => {
        logger.error('❌ Graceful shutdown exceeded 30s timeout. Forcing termination.');
        process.exit(1);
      }, 30000);

      try {
        // Stop accepting HTTP requests
        await new Promise<void>((resolve, reject) => {
          server.close((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        logger.info('✅ HTTP server closed');

        // Close Socket.IO
        const io = socketIOManager.getIO();
        if (io) {
          io.close();
          logger.info('✅ Socket.IO closed');
        }

        // Stop BullMQ workers
        await jobManager.shutdown();

        // Disconnect Redis
        await redisManager.disconnect();

        // Disconnect MongoDB
        await dbManager.disconnect();

        clearTimeout(timeout);
        process.exit(0);
      } catch (err) {
        logger.error('❌ Error during shutdown', { error: err });
        clearTimeout(timeout);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('❌ Fatal bootstrap error, terminating application', { error });
    process.exit(1);
  }
}

bootstrap();
