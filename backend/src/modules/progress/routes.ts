import { Router, Request, Response } from 'express';
import { ProgressController } from './presentation/controllers/progress.controller';
import { requireAuth } from '../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../shared/infrastructure/http/middleware/requireRole';
import { asyncHandler } from '../../shared/infrastructure/http/utils/asyncHandler';

export const progressModuleRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): ProgressController =>
    req.scope.resolve<ProgressController>('progressController');

  router.use(requireAuth);

  // Client's overall progress across all coaching relationships
  router.get(
    '/progress/my',
    requireRole(['CLIENT']),
    asyncHandler((req: Request, res: Response) => resolveController(req).getMyProgress(req, res)),
  );

  // Relationship-scoped progress for client or trainer of the relationship
  router.get(
    '/progress/relationship/:relationshipId',
    requireRole(['CLIENT', 'TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getRelationshipProgress(req, res),
    ),
  );

  return router;
};
