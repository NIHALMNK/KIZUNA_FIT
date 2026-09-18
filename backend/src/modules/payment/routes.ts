import { Router } from 'express';
import { paymentRouter } from './presentation/routes/payment.routes';

export const paymentModuleRouter = (): Router => {
  const router = Router();
  router.use('/payments', paymentRouter());
  return router;
};
