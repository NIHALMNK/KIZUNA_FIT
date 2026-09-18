import { Router, Request, Response } from 'express';
import { NutritionPlanController } from '../controllers/nutrition-plan.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateNutritionPlanSchema,
  UpdateNutritionPlanSchema,
  CreateNutritionPlanVersionSchema,
  ListNutritionPlansQuerySchema,
  PlanIdParamSchema,
  RejectNutritionPlanSchema,
  RelationshipParamSchema,
} from '../validation/nutrition.schema';

export const nutritionPlanRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): NutritionPlanController =>
    req.scope.resolve<NutritionPlanController>('nutritionPlanController');

  // Get assigned active nutrition plan for authenticated client
  router.get(
    '/assigned',
    requireAuth,
    asyncHandler((req: Request, res: Response) => resolveController(req).getAssignedPlan(req, res)),
  );

  // Get pending nutrition plan proposal for authenticated client
  router.get(
    '/pending',
    requireAuth,
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getPendingPlanForClient(req, res),
    ),
  );

  // List nutrition plans for a relationship
  router.get(
    '/',
    requireAuth,
    validateRequest(ListNutritionPlansQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listPlans(req, res)),
  );

  // Create new draft nutrition plan (Trainer only)
  router.post(
    '/',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(CreateNutritionPlanSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).createPlan(req, res)),
  );

  // Get specific nutrition plan
  router.get(
    '/:planId',
    requireAuth,
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getPlan(req, res)),
  );

  // Update existing draft nutrition plan (Trainer only)
  router.put(
    '/:planId',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(UpdateNutritionPlanSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).updatePlan(req, res)),
  );

  // Create new sequential draft version of a plan (Trainer only)
  router.post(
    '/:planId/version',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(CreateNutritionPlanVersionSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).createVersion(req, res)),
  );

  // Activate nutrition plan (Trainer only)
  router.post(
    '/:planId/activate',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).activatePlan(req, res)),
  );

  // Complete nutrition plan (Trainer only)
  router.post(
    '/:planId/complete',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).completePlan(req, res)),
  );

  // Get pending plan for a coaching relationship (Trainer or Client)
  router.get(
    '/relationship/:relationshipId/pending',
    requireAuth,
    validateRequest(RelationshipParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getPendingPlan(req, res)),
  );

  // Submit draft nutrition plan for client approval (Trainer only)
  router.post(
    '/:planId/submit',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).submitPlan(req, res)),
  );

  // Recall pending nutrition plan back to draft (Trainer only)
  router.post(
    '/:planId/recall',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).recallPlan(req, res)),
  );

  // Accept pending nutrition plan (Client only)
  router.post(
    '/:planId/accept',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).acceptPlan(req, res)),
  );

  // Reject pending nutrition plan (Client only)
  router.post(
    '/:planId/reject',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(RejectNutritionPlanSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).rejectPlan(req, res)),
  );

  // Request retirement/deletion for active plan (Trainer only)
  router.post(
    '/:planId/request-deletion',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).requestDeletion(req, res)),
  );

  // Accept plan retirement/deletion (Client only)
  router.post(
    '/:planId/accept-deletion',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).acceptDeletion(req, res)),
  );

  // Reject plan retirement/deletion (Client only)
  router.post(
    '/:planId/reject-deletion',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).rejectDeletion(req, res)),
  );

  // Delete draft nutrition plan (Trainer only)
  router.delete(
    '/:planId',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(PlanIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).deleteDraft(req, res)),
  );

  return router;
};
