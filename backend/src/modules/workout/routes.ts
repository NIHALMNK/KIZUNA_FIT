import { Router } from 'express';
import { exerciseRouter } from './presentation/routes/exercise.routes';
import { workoutProgramRouter } from './presentation/routes/workout-program.routes';
import { workoutCompletionRouter } from './presentation/routes/workout-completion.routes';

export const workoutModuleRouter = (): Router => {
  const router = Router();
  router.use('/exercises', exerciseRouter());
  router.use('/workout-programs', workoutProgramRouter());
  router.use('/workout-completions', workoutCompletionRouter());
  return router;
};
