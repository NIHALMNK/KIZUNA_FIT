import { Router } from 'express';
import { nutritionPlanRouter } from './presentation/routes/nutrition-plan.routes';
import { nutritionCompletionRouter } from './presentation/routes/nutrition-completion.routes';

export const nutritionModuleRouter = (): Router => {
  const router = Router();
  router.use('/nutrition-plans', nutritionPlanRouter());
  router.use('/nutrition-completions', nutritionCompletionRouter());
  return router;
};
