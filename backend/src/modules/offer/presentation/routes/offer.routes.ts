import { Router, Request, Response } from 'express';
import { OfferController } from '../controllers/offer.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateOfferSchema,
  DeclineOfferSchema,
  OfferIdParamSchema,
  ConsultationIdParamSchema,
  PipelineIdParamSchema,
  GetOffersQuerySchema,
} from '../validators/offer.validator';

export const offerRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): OfferController =>
    req.scope.resolve<OfferController>('offerController');

  // 1. Create Offer (Trainer)
  router.post(
    '/',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(CreateOfferSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).create(req, res)),
  );

  // 2. List Sent Offers (Trainer)
  router.get(
    '/sent',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(GetOffersQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listSent(req, res)),
  );

  // 3. List Received Offers (Client)
  router.get(
    '/received',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(GetOffersQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listReceived(req, res)),
  );

  // 4. List Pending / All Offers for Authenticated User (Client | Trainer)
  router.get(
    '/',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetOffersQuerySchema),
    asyncHandler((req: Request, res: Response) => {
      const role = req.auth?.role;
      if (role === 'TRAINER') {
        return resolveController(req).listSent(req, res);
      }
      return resolveController(req).listReceived(req, res);
    }),
  );

  // 5. Get Offer by Pipeline ID (Client | Trainer | Admin)
  router.get(
    '/pipeline/:pipelineId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER', 'ADMIN']),
    validateRequest(PipelineIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getByPipelineId(req, res)),
  );

  // 6. Get Offer by Consultation ID (Client | Trainer | Admin)
  router.get(
    '/consultation/:consultationId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER', 'ADMIN']),
    validateRequest(ConsultationIdParamSchema),
    asyncHandler((req: Request, res: Response) =>
      resolveController(req).getByConsultationId(req, res),
    ),
  );

  // 7. Get Offer by ID (Client | Trainer | Admin)
  router.get(
    '/:offerId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER', 'ADMIN']),
    validateRequest(OfferIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getById(req, res)),
  );

  // 8. Send Draft Offer (Trainer)
  router.post(
    '/:offerId/send',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(OfferIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).send(req, res)),
  );

  // 9. Accept Offer (Client)
  router.post(
    '/:offerId/accept',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(OfferIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).accept(req, res)),
  );

  // 10. Decline Offer (Client)
  router.post(
    '/:offerId/decline',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(DeclineOfferSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).decline(req, res)),
  );

  // 10b. Reject Offer (Client alias to decline)
  router.post(
    '/:offerId/reject',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(DeclineOfferSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).decline(req, res)),
  );

  // 11. Expire Offer (Admin | Trainer)
  router.post(
    '/:offerId/expire',
    requireAuth,
    requireRole(['ADMIN', 'TRAINER']),
    validateRequest(OfferIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).expire(req, res)),
  );

  return router;
};
