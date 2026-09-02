import { Router, Request, Response } from 'express';
import multer from 'multer';
import { ExerciseController } from '../controllers/exercise.controller';
import {
  requireAuth,
  optionalAuth,
} from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max for video demonstration
});

export const exerciseRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): ExerciseController =>
    req.scope.resolve<ExerciseController>('exerciseController');

  // Media Asset Upload (Trainer or Admin)
  router.post(
    '/media/upload',
    requireAuth,
    requireRole(['TRAINER', 'ADMIN']),
    upload.single('file'),
    asyncHandler((req: Request, res: Response) => resolveController(req).uploadMedia(req, res)),
  );

  // Media Asset Delete (Trainer or Admin)
  router.delete(
    '/media',
    requireAuth,
    requireRole(['TRAINER', 'ADMIN']),
    asyncHandler((req: Request, res: Response) => resolveController(req).deleteMedia(req, res)),
  );

  // List / Search Exercises (supports optionalAuth for mine=true scoping)
  router.get(
    '/',
    optionalAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).listExercises(req, res)),
  );

  // Get Single Exercise
  router.get(
    '/:exerciseId',
    optionalAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).getExercise(req, res)),
  );

  // Create Exercise (Trainer or Admin)
  router.post(
    '/',
    requireAuth,
    requireRole(['TRAINER', 'ADMIN']),
    asyncHandler((req: Request, res: Response) => resolveController(req).createExercise(req, res)),
  );

  // Update Exercise (Trainer or Admin)
  router.patch(
    '/:exerciseId',
    requireAuth,
    requireRole(['TRAINER', 'ADMIN']),
    asyncHandler((req: Request, res: Response) => resolveController(req).updateExercise(req, res)),
  );

  // Report Exercise (Trainers)
  router.post(
    '/:exerciseId/report',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).reportExercise(req, res)),
  );

  // Deprecate Exercise (Admin only)
  router.delete(
    '/:exerciseId',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).deprecateExercise(req, res),
    ),
  );

  return router;
};
