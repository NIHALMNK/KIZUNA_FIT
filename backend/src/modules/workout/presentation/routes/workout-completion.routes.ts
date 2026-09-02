import { Router, Request, Response } from 'express';
import { WorkoutCompletionController } from '../controllers/workout-completion.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';

export const workoutCompletionRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): WorkoutCompletionController =>
    req.scope.resolve<WorkoutCompletionController>('workoutCompletionController');

  // List completions
  router.get(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).listCompletions(req, res)),
  );

  // Get workout history / stats
  router.get(
    '/history',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).getHistory(req, res)),
  );

  // Start / log new workout completion session
  router.post(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).startCompletion(req, res)),
  );

  // Get specific completion details
  router.get(
    '/:completionId',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).getCompletion(req, res)),
  );

  // Update in-progress workout execution sets/reps
  router.patch(
    '/:completionId',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).updateExecution(req, res)),
  );

  // Complete workout session
  router.post(
    '/:completionId/complete',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).completeWorkout(req, res)),
  );

  return router;
};
