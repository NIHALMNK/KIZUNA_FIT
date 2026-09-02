import { Router, Request, Response } from 'express';
import { WorkoutProgramController } from '../controllers/workout-program.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';

export const workoutProgramRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): WorkoutProgramController =>
    req.scope.resolve<WorkoutProgramController>('workoutProgramController');

  // List programs
  router.get(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).listPrograms(req, res)),
  );

  // Get current active assigned program
  router.get(
    '/assigned',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getAssignedProgram(req, res),
    ),
  );

  router.get(
    '/active',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getAssignedProgram(req, res),
    ),
  );

  // Create program (Trainer only)
  router.post(
    '/',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).createProgram(req, res)),
  );

  // Get specific program
  router.get(
    '/:programId',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).getProgram(req, res)),
  );

  // Update draft program (Trainer only)
  router.patch(
    '/:programId',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).updateDraftProgram(req, res),
    ),
  );

  // Publish / Activate program (Trainer only)
  router.post(
    '/:programId/publish',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).activateProgram(req, res)),
  );

  router.post(
    '/:programId/activate',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).activateProgram(req, res)),
  );

  // Duplicate / Create new version of program (Trainer only)
  router.post(
    '/:programId/duplicate',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).duplicateProgram(req, res),
    ),
  );

  // Get or Create editable Draft for Coaching Relationship (Trainer only)
  router.post(
    '/relationship/:coachingRelationshipId/edit-draft',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getOrCreateDraftProgram(req, res),
    ),
  );

  return router;
};
