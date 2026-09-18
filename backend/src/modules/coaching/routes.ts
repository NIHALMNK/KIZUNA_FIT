import { Router } from 'express';
import { coachingRouter } from './presentation/routes/coaching.routes';

export const coachingModuleRouter = (): Router => {
  const router = Router();
  router.use('/coaching-relationships', coachingRouter());
  return router;
};
