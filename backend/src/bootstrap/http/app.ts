import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { notFoundHandler } from '../../shared/infrastructure/http/middleware/notFoundHandler';
import { errorHandler } from '../../shared/infrastructure/http/middleware/errorHandler';
import { AwilixContainer } from 'awilix';
import { env } from '../../config/env.config';
import { identityRouter } from '../../modules/identity/presentation/routes/identity.routes';

export function createApp(container: AwilixContainer): express.Application {
  const app = express();

  // Create scope per request
  app.use((req: Request, _res: Response, next: NextFunction) => {
    req.scope = container.createScope();
    next();
  });

  app.use(helmet());
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());
  
  app.get('/api/v1/health', (req, res) => {
    const dbManager = req.scope.resolve('dbManager');
    const redisManager = req.scope.resolve('redisManager');
    const jobManager = req.scope.resolve('jobManager');
    const socketIOManager = req.scope.resolve('socketIOManager');

    res.status(200).json({
      status: 'healthy',
      mongodb: dbManager.getStatus(),
      redis: redisManager.getStatus(),
      bullmq: jobManager.getStatus(),
      socketio: socketIOManager.getStatus(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Mount routers
  app.use('/api/v1/identity', identityRouter());

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
