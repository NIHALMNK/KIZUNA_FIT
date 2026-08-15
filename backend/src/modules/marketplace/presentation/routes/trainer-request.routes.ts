import { Router, Request, Response } from 'express';
import { TrainerRequestController } from '../controllers/trainer-request.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateTrainerRequestSchema,
  RejectTrainerRequestSchema,
  GetTrainerRequestsQuerySchema,
  SwitchTrainerSchema,
} from '../validators/trainer-request.validator';

export const trainerRequestRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): TrainerRequestController =>
    req.scope.resolve<TrainerRequestController>('trainerRequestController');

  // 1. Create Trainer Request (Client)
  router.post(
    '/',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(CreateTrainerRequestSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).create(req, res)),
  );

  // 2. List Trainer Requests (Client | Trainer)
  router.get(
    '/',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetTrainerRequestsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).list(req, res)),
  );

  // 3. Get Pending Trainer Requests (Client | Trainer)
  router.get(
    '/pending',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetTrainerRequestsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getPending(req, res)),
  );

  // 4. Get Trainer Request History (Client | Trainer)
  router.get(
    '/history',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetTrainerRequestsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getHistory(req, res)),
  );

  // 5. Get Single Trainer Request Detail (Client | Trainer)
  router.get(
    '/:requestId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).getById(req, res)),
  );

  // 6. Accept Trainer Request (Trainer)
  router.post(
    '/:requestId/accept',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).accept(req, res)),
  );

  // 7. Reject Trainer Request (Trainer)
  router.post(
    '/:requestId/reject',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(RejectTrainerRequestSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).reject(req, res)),
  );

  // 8. Withdraw Trainer Request (Client)
  router.post(
    '/:requestId/withdraw',
    requireAuth,
    requireRole(['CLIENT']),
    asyncHandler((req: Request, res: Response) => resolveController(req).withdraw(req, res)),
  );

  // 9. Close Trainer Request (Trainer)
  router.post(
    '/:requestId/close',
    requireAuth,
    requireRole(['TRAINER']),
    asyncHandler((req: Request, res: Response) => resolveController(req).close(req, res)),
  );

  // 10. Switch Trainer (Client)
  router.post(
    '/switch-trainer',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(SwitchTrainerSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).switchTrainer(req, res)),
  );

  return router;
};
