import { Router } from 'express';
import { offerRouter } from './presentation/routes/offer.routes';

export const offerModuleRouter = (): Router => {
  const router = Router();
  router.use('/offers', offerRouter());
  return router;
};
