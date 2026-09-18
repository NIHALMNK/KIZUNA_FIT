import { Router, Request, Response } from 'express';
import { CoachingRelationshipController } from '../controllers/coaching-relationship.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';

export const coachingRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): CoachingRelationshipController =>
    req.scope.resolve<CoachingRelationshipController>('coachingRelationshipController');

  // 1. Static query collection routes
  router.get(
    '/',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).listCoachingRelationships(req, res),
    ),
  );

  router.get(
    '/active',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getActiveCoachingRelationship(req, res),
    ),
  );

  router.get(
    '/history',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getCoachingHistory(req, res),
    ),
  );

  // 2. Individual resource routes
  router.get(
    '/:relationshipId',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getCoachingRelationship(req, res),
    ),
  );

  router.post(
    '/:relationshipId/activate',
    requireAuth,
    requireRole(['ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).activateCoachingRelationship(req, res),
    ),
  );

  router.post(
    '/:relationshipId/complete',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).completeCoachingRelationship(req, res),
    ),
  );

  router.post(
    '/:relationshipId/cancel',
    requireAuth,
    requireRole(['TRAINER', 'ADMIN']),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).cancelCoachingRelationship(req, res),
    ),
  );

  return router;
};
