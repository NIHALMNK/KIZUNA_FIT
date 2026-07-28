import { Router } from 'express';
import { trainerRequestRouter } from './presentation/routes/trainer-request.routes';

export const marketplaceRouter = (): Router => {
  const router = Router();
  router.use('/trainer-requests', trainerRequestRouter());
  return router;
};
