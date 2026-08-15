import { Router } from 'express';
import { consultationRouter } from './presentation/routes/consultation.routes';

export const consultationModuleRouter = (): Router => {
  const router = Router();
  router.use('/consultations', consultationRouter());
  return router;
};
