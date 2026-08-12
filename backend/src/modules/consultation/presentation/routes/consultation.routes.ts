import { Router, Request, Response } from 'express';
import { ConsultationController } from '../controllers/consultation.controller';
import { requireAuth } from '../../../../shared/infrastructure/http/middleware/requireAuth';
import { requireRole } from '../../../../shared/infrastructure/http/middleware/requireRole';
import { validateRequest } from '../../../../shared/infrastructure/http/middleware/validateRequest';
import { asyncHandler } from '../../../../shared/infrastructure/http/utils/asyncHandler';
import {
  CreateConsultationSchema,
  BookConsultationSlotSchema,
  ScheduleConsultationSchema,
  CancelConsultationSchema,
  ConsultationIdParamSchema,
  PipelineIdParamSchema,
  RoomIdParamSchema,
  GetConsultationsQuerySchema,
} from '../validators/consultation.validator';

export const consultationRouter = (): Router => {
  const router = Router();

  const resolveController = (req: Request): ConsultationController =>
    req.scope.resolve<ConsultationController>('consultationController');

  // 1. Create Consultation (Client | Trainer)
  router.post(
    '/',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(CreateConsultationSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).create(req, res)),
  );

  // 2. List Upcoming Consultations (Client | Trainer)
  router.get(
    '/upcoming',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetConsultationsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listUpcoming(req, res)),
  );

  // 3. List Consultation History (Client | Trainer)
  router.get(
    '/history',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(GetConsultationsQuerySchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).listHistory(req, res)),
  );

  // 4. Get Consultation by Pipeline ID (Client | Trainer)
  router.get(
    '/pipeline/:pipelineId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(PipelineIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getByPipelineId(req, res)),
  );

  // 5. Get Consultation by Room ID (Client | Trainer)
  router.get(
    '/room/:roomId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(RoomIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getByRoomId(req, res)),
  );

  // 6. Get Consultation by ID (Client | Trainer)
  router.get(
    '/:consultationId',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(ConsultationIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).getById(req, res)),
  );

  // 7. Book Slot (Client)
  router.post(
    '/:consultationId/book',
    requireAuth,
    requireRole(['CLIENT']),
    validateRequest(BookConsultationSlotSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).bookSlot(req, res)),
  );

  // 8. Schedule Consultation (Client | Trainer)
  router.post(
    '/:consultationId/schedule',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(ScheduleConsultationSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).schedule(req, res)),
  );

  // 9. Confirm Schedule (Trainer | Client)
  router.post(
    '/:consultationId/confirm',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(ConsultationIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).confirmSchedule(req, res)),
  );

  // 10. Cancel Consultation (Client | Trainer)
  router.post(
    '/:consultationId/cancel',
    requireAuth,
    requireRole(['CLIENT', 'TRAINER']),
    validateRequest(CancelConsultationSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).cancel(req, res)),
  );

  // 11. Complete Consultation (Trainer)
  router.post(
    '/:consultationId/complete',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(ConsultationIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).complete(req, res)),
  );

  // 12. Mark No-Show (Trainer)
  router.post(
    '/:consultationId/no-show',
    requireAuth,
    requireRole(['TRAINER']),
    validateRequest(ConsultationIdParamSchema),
    asyncHandler((req: Request, res: Response) => resolveController(req).markNoShow(req, res)),
  );

  return router;
};
