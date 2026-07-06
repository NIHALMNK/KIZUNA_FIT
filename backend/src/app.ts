import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

export interface HealthDependencies {
  dbManager: { getStatus: () => string };
  redisManager: { getStatus: () => string };
  jobManager: { getStatus: () => string };
  socketIOManager: { getStatus: () => string };
}

export function createApp(deps: HealthDependencies): express.Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      mongodb: deps.dbManager.getStatus(),
      redis: deps.redisManager.getStatus(),
      bullmq: deps.jobManager.getStatus(),
      socketio: deps.socketIOManager.getStatus(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  return app;
}
