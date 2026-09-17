import { Router, Request, Response } from 'express';
import { NutritionCompletionController } from '../controllers/nutrition-completion.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CompleteNutritionCompletionSchema,
  CompletionIdParamSchema,
  ListNutritionCompletionsQuerySchema,
  StartNutritionCompletionSchema,
  UpdateNutritionCompletionSchema,
} from '../validation/nutrition.schema';

export const nutritionCompletionRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): NutritionCompletionController =>
    req.scope.resolve<NutritionCompletionController>('nutritionCompletionController');

  // List completions (Client or Trainer)
  router.get(
    '/',
    requireAuth,
    validateRequest(ListNutritionCompletionsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listCompletions(req, res)),
  );

  // Start tracking a nutrition day (Client only)
  router.post(
    '/',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(StartNutritionCompletionSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).startCompletion(req, res)),
  );

  // Get specific completion record
  router.get(
    '/:completionId',
    requireAuth,
    validateRequest(CompletionIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getCompletion(req, res)),
  );

  // Update in-progress meal execution / hydration / feedback (Client only)
  router.patch(
    '/:completionId',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(UpdateNutritionCompletionSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).updateCompletion(req, res),
    ),
  );

  // Finalize / Complete nutrition day (Client only)
  router.post(
    '/:completionId/complete',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(CompleteNutritionCompletionSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).completeCompletion(req, res),
    ),
  );

  return router;
};
