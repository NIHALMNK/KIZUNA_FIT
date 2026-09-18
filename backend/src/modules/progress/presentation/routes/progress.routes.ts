import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';

export function createProgressRoutes(progressController: ProgressController): Router {
  const router = Router();

  router.use(requireAuth);

  // Client's overall progress across all coaching relationships
  router.get('/my', requireRole(['CLIENT']), progressController.getMyProgress);

  // Relationship-scoped progress for client or trainer of the relationship
  router.get(
    '/relationship/:relationshipId',
    requireRole(['CLIENT', 'TRAINER']),
    progressController.getRelationshipProgress,
  );

  return router;
}
